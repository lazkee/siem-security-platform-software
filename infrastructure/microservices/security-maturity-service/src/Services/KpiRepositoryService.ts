import { Repository } from "typeorm";
import { IKpiRepositoryService } from "../Domain/services/IKpiRepositoryService";
import { KpiSnapshot } from "../Domain/models/KpiSnapshot";
import { KpiSnapshotCategoryCount } from "../Domain/models/KpiSnapshotCategoryCount";
import { AlertCategory } from "../Domain/enums/AlertCategory";
import { NOT_FOUND } from "../Domain/constants/Sentinels";

export class KpiRepositoryService implements IKpiRepositoryService {
  private readonly snapshotRepo: Repository<KpiSnapshot>;
  private readonly categoryRepo: Repository<KpiSnapshotCategoryCount>;

  public constructor(
    snapshotRepo: Repository<KpiSnapshot>,
    categoryRepo: Repository<KpiSnapshotCategoryCount>
  ) {
    this.snapshotRepo = snapshotRepo;
    this.categoryRepo = categoryRepo;
  }

  public async upsertSnapshot(snapshot: KpiSnapshot): Promise<number> {
    try {
      await this.snapshotRepo.upsert(
        {
          windowFrom: snapshot.windowFrom,
          windowTo: snapshot.windowTo,

          mttdMinutes: snapshot.mttdMinutes,
          mttrMinutes: snapshot.mttrMinutes,

          mttdSampleCount: snapshot.mttdSampleCount,
          mttrSampleCount: snapshot.mttrSampleCount,

          totalAlerts: snapshot.totalAlerts,
          resolvedAlerts: snapshot.resolvedAlerts,
          openAlerts: snapshot.openAlerts,

          falseAlarms: snapshot.falseAlarms,
          falseAlarmRate: snapshot.falseAlarmRate,

          scoreValue: snapshot.scoreValue,
          maturityLevel: snapshot.maturityLevel,
        },
        ["windowFrom", "windowTo"]
      );
    } catch (e) {
      console.log("[KpiRepository] Failed to upsert KpiSnapshot.", e);
      return NOT_FOUND;
    }

    try {
      const saved = await this.snapshotRepo.findOne({
        where: { windowFrom: snapshot.windowFrom, windowTo: snapshot.windowTo },
      });

      return saved ? saved.id : NOT_FOUND;
    } catch (e) {
      console.log("[KpiRepository] Failed to reload KpiSnapshot after upsert.", e);
      return NOT_FOUND;
    }
  }

  public async replaceCategoryCounts(
    snapshotId: number,
    categoryCounts: Partial<Record<AlertCategory, number>>
  ): Promise<boolean> {
    try {
      await this.categoryRepo.delete({ snapshotId });
    } catch (e) {
      console.log("[KpiRepository] Failed to delete old category rows.", e);
      return false;
    }

    const rows: KpiSnapshotCategoryCount[] = Object.entries(categoryCounts).map(
      ([category, count]) => {
        const row = new KpiSnapshotCategoryCount();
        row.snapshotId = snapshotId;
        row.category = category as AlertCategory;
        row.count = count as number;
        return row;
      }
    );

    if (rows.length === 0) return true;

    try {
      await this.categoryRepo.save(rows);
      return true;
    } catch (e) {
      console.log("[KpiRepository] Failed to save category rows.", e);
      return false;
    }
  }

  public async getSnapshots(from: Date, to: Date): Promise<KpiSnapshot[]> {
    try {
      return await this.snapshotRepo
        .createQueryBuilder("s")
        .where("s.windowFrom >= :from", { from })
        .andWhere("s.windowFrom < :to", { to })
        .orderBy("s.windowFrom", "ASC")
        .getMany();
    } catch (e) {
      console.log("[KpiRepository] Failed to read snapshots.", e);
      return [];
    }
  }

  public async getCategoryCounts(from: Date, to: Date): Promise<KpiSnapshotCategoryCount[]> {
    try {
      return await this.categoryRepo
        .createQueryBuilder("c")
        .innerJoin(KpiSnapshot, "s", "s.id = c.snapshotId")
        .where("s.windowFrom >= :from", { from })
        .andWhere("s.windowFrom < :to", { to })
        .getMany();
    } catch (e) {
      console.log("[KpiRepository] Failed to read category counts.", e);
      return [];
    }
  }
}
