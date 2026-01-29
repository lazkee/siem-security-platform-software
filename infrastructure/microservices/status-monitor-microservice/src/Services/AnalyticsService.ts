import { Repository, MoreThan } from "typeorm";
import { ServiceCheck } from "../Domain/models/ServiceCheck";
import { ServiceStatus } from "../Domain/enums/ServiceStatusEnum";

export class AnalyticsService {
    constructor(private checkRepo: Repository<ServiceCheck>) {}

    async calculateStats(serviceName: string, hours: number = 24) {
        const timeLimit = new Date();
        timeLimit.setHours(timeLimit.getHours() - hours);

        const checks = await this.checkRepo.find({
            where: { 
                serviceName, 
                checkedAt: MoreThan(timeLimit) 
            }
        });

        if (checks.length === 0) return { uptime: 0, avgResponseTime: 0, errorRate: 0 };

        const total = checks.length;
        const upCount = checks.filter(c => c.status === ServiceStatus.UP).length;
        const totalResponseTime = checks.reduce((acc, c) => acc + (c.responseTimeMs || 0), 0);
        
        // Error rate su svi koji nisu UP ili imaju specifican errorType
        const errors = checks.filter(c => c.status === ServiceStatus.DOWN).length;

        return {
            uptime: (upCount / total) * 100, // Procentualno
            avgResponseTime: totalResponseTime / (upCount || 1), // Prosecno vreme za uspesne pingove
            errorRate: (errors / total) * 100
        };
    }
}