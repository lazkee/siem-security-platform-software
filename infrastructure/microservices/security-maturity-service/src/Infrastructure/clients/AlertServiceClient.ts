import { AxiosInstance } from "axios";
import { AlertForKpi } from "../../Domain/types/AlertForKpi";
import { AlertPayloadDto } from "../../Domain/types/AlertPayloadDto";
import { mapAlertPayloadToDomain } from "../mappers/alertPayloadMapper";
import { ILogerService } from "../../Domain/services/ILoggerService";

export class AlertServiceClient {
  public constructor(private readonly client: AxiosInstance, private readonly loger: ILogerService) {}

  public async fetchAlerts(from: Date, to: Date): Promise<AlertForKpi[]> {
    const res = await this.client.get<AlertPayloadDto[]>("/alerts/for-kpi", {
      params: { from: from.toISOString(), to: to.toISOString() },
    });

    return res.data
      .map((x) => mapAlertPayloadToDomain(x, this.loger))
      .filter((a) => a.isValid);
  }
}
