import { Repository, IsNull} from "typeorm";
import { ServiceCheck } from "../Domain/models/ServiceCheck";
import { ServiceIncident } from "../Domain/models/ServiceIncident";
import { ServiceThreshold } from "../Domain/models/ServiceThreshold";
import { ServiceStatus } from "../Domain/enums/ServiceStatusEnum";
import { IIncidentService } from "../Domain/services/IIncidentService";

export class IncidentService implements IIncidentService {
  constructor(
    private checkRepo: Repository<ServiceCheck>,
    private incidentRepo: Repository<ServiceIncident>,
    private thresholdRepo: Repository<ServiceThreshold>
  ) {}

  async evaluate(serviceName: string): Promise<void> {
    const threshold = await this.thresholdRepo.findOne({
      where: { serviceName },
    });

    if (!threshold) return;

    if (threshold.maxConsecutiveDown <= 0 || threshold.recoveryUpCount <= 0) {
        return;
    }

    //da li vec postoji iscident
    const openIncident = await this.incidentRepo.findOne({
      where: {
        serviceName,
        endTime: IsNull()
      },
      order: { startTime: "DESC" },
    });

    //uzmi poslednje checkove
    const recentChecks = await this.checkRepo.find({
      where: { serviceName },
      order: { checkedAt: "DESC" },
      take: Math.max(
        threshold.maxConsecutiveDown,
        threshold.recoveryUpCount
      ),
    });

    if (recentChecks.length === 0) return;

  
    // OTVARANJE INCIDENTA
    if (!openIncident) {
        const downs = recentChecks.slice(0, threshold.maxConsecutiveDown).every(c => c.status === ServiceStatus.DOWN);

        if (downs) {
            await this.incidentRepo.save({
                        serviceName,
                        startTime: new Date(),
                        endTime: null,
                        reason: `Service down ${threshold.maxConsecutiveDown} consecutive checks`,
                        correlationSummary: null,
                        correlationRefs: null,
            });
        }

      return;
    }

    // ZATVARANJE INCIDENTA
    const ups = recentChecks.slice(0, threshold.recoveryUpCount).every(c => c.status === ServiceStatus.UP);

    if (ups) {
        openIncident.endTime = new Date();
         await this.incidentRepo.save(openIncident);
    }
  }
}
