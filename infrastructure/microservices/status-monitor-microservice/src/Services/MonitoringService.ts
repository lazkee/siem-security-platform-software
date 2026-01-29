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
      // Koristimo timeoutMs specifičan za taj servis iz baze
      await axios.get(s.pingUrl, { timeout: s.timeoutMs });
      const responseTimeMs = Date.now() - start;

      await this.checkRepo.save({
        serviceName: s.serviceName,
        checkedAt: new Date(),
        status: ServiceStatus.UP,
        responseTimeMs,
        errorType: null, // Sve je u redu
      });

    } catch (err: any) {
      // Detektujemo da li je pao zbog timeout-a ili nečeg drugog (npr. 500 Error)
      let errorType = "request_failed";
      
      if (err?.code === "ECONNABORTED" || err?.message?.includes("timeout")) {
        errorType = "timeout";
      } else if (err?.response) {
        errorType = `http_${err.response.status}`; // npr. http_500
      }

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
