import { Between, MongoRepository, Repository } from "typeorm";
import { Alert } from "../Domain/models/Alert";
import { IQueryAlertRepositoryService } from "../Domain/services/IQueryAlertRepositoryService";
import { CacheAlertEntry } from "../Domain/models/CacheAlertEntry";
import { ILoggerService } from "../Domain/services/ILoggerService";
import { InvertedIndexStructureForAlerts } from "../Utils/InvertedIndexStructureForAlerts";
import { CacheEntryDTO } from "../Domain/DTOs/CacheEntryDTO";
import { HourlyStatisticsDTO } from "../Domain/DTOs/HourlyStatisticsDTO";
import { buildLast24HourBuckets } from "../Utils/BuildLast24HourBucket";
import { floorToHour } from "../Utils/FloorToHour";
import { formatHourHH } from "../Utils/FormatHour";

const emptyCacheEntry: CacheAlertEntry = {
    _id: "",
    key: "NOT_FOUND",
    result: [],
    cachedAt: new Date(0),
    lastProcessedId: 0
};

export class QueryAlertRepositoryService implements IQueryAlertRepositoryService {
    public readonly invertedIndexStructureForAlerts: InvertedIndexStructureForAlerts;
    constructor(private readonly cacheAlertRepository : MongoRepository<CacheAlertEntry>,
                private readonly loggerService: ILoggerService,
                private readonly alertRepository: Repository<Alert>)
    {
        this.invertedIndexStructureForAlerts = new InvertedIndexStructureForAlerts(this);
        this.loggerService.log("QueryAlertRepositoryService initialized.");
        this.loggerService.log("Inverted index structure for alerts initialized and " + this.invertedIndexStructureForAlerts.getAlertsCount() + " alerts indexed.");
        
    }
    async addEntry(entry: CacheEntryDTO): Promise<CacheAlertEntry> {
       const newEntry = new CacheAlertEntry();
               newEntry.key = entry.key;
               newEntry.result = entry.result;
               newEntry.cachedAt = new Date(); 
               newEntry.lastProcessedId = entry.lastProcessedId;
               // postavljamo trenutno vreme kao vreme kesiranja
               return await this.cacheAlertRepository.save(newEntry);
    }
    
    async getOldAlerts(hours: number): Promise<Alert[]> {
        const allAlerts = await this.getAllAlerts();
        const xHoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000);
        
        const oldAlerts = allAlerts.filter(alert => {
            const alertDate = alert.createdAt instanceof Date ? alert.createdAt : new Date(alert.createdAt);
            const isOld = alertDate.getTime() <= xHoursAgo.getTime();
            return isOld;
        });
        
        oldAlerts.forEach(alert => {
            this.invertedIndexStructureForAlerts.removeAlertFromIndex(alert.id);
        });
        
        if (oldAlerts.length > 0)
        {
            await this.cacheAlertRepository.deleteMany({});
            this.loggerService.log("Deleted old events and cleared cache.");
        } 
        return oldAlerts;
    }
    findAlerts(query: string): Set<number> {
        const resultIds = this.invertedIndexStructureForAlerts.getIdsForTokens(query);
        return resultIds;
    }
    async findByKey(key: string): Promise<CacheAlertEntry> {
        const response = await this.cacheAlertRepository.findOne({ where: { key } });
        if(!response) return emptyCacheEntry;
        return response;
    }
    async deleteByKey(key: string): Promise<boolean> {
        const response = await this.cacheAlertRepository.deleteOne({key});
        return response.deletedCount === 1;
    }
    async getLastThreeAlerts(): Promise<Alert[]> {
        const alerts = await this.alertRepository.find({
            order: { createdAt: "DESC" },
            take: 3
        });
        return alerts;
    }
    public getAlertsCount(): number {
        return this.invertedIndexStructureForAlerts.getAlertsCount();
    }
    public getLastProcessedId(): number {
        return this.invertedIndexStructureForAlerts.getLastProcessedId();
    }
    public async getMaxId(): Promise<number> {
        const result = await this.alertRepository.find({
            select: ["id"],
            order: { id: "DESC" },
            take: 1
        });

        return result.length ? result[0].id : 0;
    }
    public async getAlertsFromId1ToId2(fromId: number, toId: number): Promise<Alert[]> {
        return await this.alertRepository.find({where: {id: Between(fromId, toId)}, order: { id: "ASC" }});
    }

    public async getHourlyAlertStatistics(): Promise<HourlyStatisticsDTO[]> {
    const now = new Date();
    const buckets = buildLast24HourBuckets(now);

    const from = buckets[0]; 
    const to = now;

    const rows = await this.alertRepository.find({
      select: ["createdAt"],
      where: { createdAt: Between(from, to) },
    });

    const countsByBucketStartMs = new Map<number, number>();
    for (const r of rows) {
      const bucketStart = floorToHour(new Date(r.createdAt)).getTime();
      countsByBucketStartMs.set(
        bucketStart,
        (countsByBucketStartMs.get(bucketStart) ?? 0) + 1
      );
    }

    return buckets.map((b) => ({
      hour: formatHourHH(b),
      count: countsByBucketStartMs.get(b.getTime()) ?? 0,
    }));
  }

    async getAllAlerts(): Promise<Alert[]> {
        return this.alertRepository.find();
    } 
    public async getFilteredAlerts(
    severity: string,
    status?: string,
    source?: string,
    dateFrom?: string,
    dateTo?: string 
): Promise<Alert[]> {
    
    
    const queryBuilder = this.alertRepository.createQueryBuilder("alert");

    if (severity && severity !== 'all') {
        queryBuilder.andWhere("alert.severity = :severity", { severity });
    }
    if (status && status !== 'all') {
        queryBuilder.andWhere("alert.status = :status", { status });
    }
    if (source && source.trim() !== '') {
        queryBuilder.andWhere("alert.source LIKE :source", { source: `%${source}%` });
    }
    if (dateFrom && dateTo && dateFrom !== 'undefined' && dateTo !== 'undefined') {
        queryBuilder.andWhere("alert.createdAt BETWEEN :dateFrom AND :dateTo", { 
            dateFrom: new Date(dateFrom), 
            dateTo: new Date(dateTo) 
        });
    }

    return await queryBuilder.orderBy("alert.createdAt", "DESC").getMany();
}

async getAlertsByUserId(userId: number): Promise<Alert[]> {
    return await this.alertRepository.find({
        where: { userId: userId },
        order: { createdAt: "DESC" }
    });
}

async getAlertsByUserRole(userRole: string): Promise<Alert[]> {
    return await this.alertRepository.find({
        where: { userRole: userRole },
        order: { createdAt: "DESC" }
    });
}

async getAllUserIds(): Promise<number[]> {
    const alerts = await this.alertRepository
        .createQueryBuilder("alert")
        .select("alert.userId")
        .where("alert.userId IS NOT NULL")
        .getMany();

    const uniqueIds = [...new Set(alerts.map(a => a.userId).filter((id): id is number => id !== null && id !== undefined))];
    return uniqueIds.sort((a, b) => a - b);
}

async getAllRoles(): Promise<string[]> {
    const alerts = await this.alertRepository
        .createQueryBuilder("alert")
        .select("alert.userRole")
        .where("alert.userRole IS NOT NULL")
        .getMany();

    const uniqueRoles = [...new Set(alerts.map(a => a.userRole).filter((role): role is string => role !== null && role !== undefined))];
    return uniqueRoles.sort();
}
    
}   