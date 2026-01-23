import axios from "axios";
import { Repository } from "typeorm";
import { ServiceThreshold } from "../Domain/models/ServiceThreshold";
import { ServiceCheck } from "../Domain/models/ServiceCheck";
import { IMonitoringService } from "../Domain/services/IMonitoringService";
import { ServiceStatus } from "../Domain/enums/ServiceStatusEnum";

export class MonitoringService implements IMonitoringService {
  constructor(
    private thresholdRepo: Repository<ServiceThreshold>,
    private checkRepo: Repository<ServiceCheck>
  ) {}

  async runChecks(): Promise<void> {
    const services = await this.thresholdRepo.find();

    for (const s of services) {
      const start = Date.now();
      try {
        await axios.get(s.pingUrl, { timeout: s.timeoutMs });
        const responseTimeMs = Date.now() - start;

        await this.checkRepo.save({
          serviceName: s.serviceName,
          checkedAt: new Date(),
          status: ServiceStatus.UP,
          responseTimeMs,
          errorType: null,
        });
      } catch (err: any) {
        const errorType =
          err?.code === "ECONNABORTED" ? "timeout" : err?.code || "request_failed";

        await this.checkRepo.save({
          serviceName: s.serviceName,
          checkedAt: new Date(),
          status: ServiceStatus.DOWN,
          responseTimeMs: null,
          errorType,
        });
      }
    }
  }
}
