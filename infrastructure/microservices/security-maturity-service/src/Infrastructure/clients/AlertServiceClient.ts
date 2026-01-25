import { AxiosInstance } from "axios";
import { AlertForKpi } from "../../Domain/types/AlertForKpi";
import { AlertPayloadDto } from "../../Domain/types/AlertPayloadDto";
import { mapAlertPayloadToDomain } from "../mappers/alertPayloadMapper";

export class AlertServiceClient {
  public constructor(private readonly client: AxiosInstance) {}

  public async fetchAlerts(from: Date, to: Date): Promise<AlertForKpi[]> {
    const res = await this.client.get<AlertPayloadDto[]>("/alerts", {
      params: { from: from.toISOString(), to: to.toISOString() },
    });

    return res.data
      .map((x) => mapAlertPayloadToDomain(x))
      .filter((a) => a.isValid);
  }
}
