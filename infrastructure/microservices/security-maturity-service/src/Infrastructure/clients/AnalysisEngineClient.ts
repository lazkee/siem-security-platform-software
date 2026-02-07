import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { Recommendation } from "../../Domain/types/Recommendation";
import { RecommendationPayloadDto } from "../../Domain/types/RecommendationPayloadDto";
import { mapRecommendationPayloadDto } from "../mappers/recommendationPayloadMapper";
import { createAxiosClient } from "../helpers/createAxiosClient";
import { RecommendationContextDto } from "../../Domain/types/recommendationContext/RecommendationContext";
import { ILogerService } from "../../Domain/services/ILoggerService";

export class AnalysisEngineClient {
  private readonly client: AxiosInstance;
  private readonly loger: ILogerService;

  constructor(baseUrl: string, loger: ILogerService) {
    this.client = createAxiosClient(baseUrl, 60000);
    this.loger = loger;
  }
  public async fetchRecommendations(context: RecommendationContextDto): Promise<Recommendation[]> {
    try {
      const response: AxiosResponse<RecommendationPayloadDto[]> =
        await this.client.post("/recommendations", context);

      
      
      if (!Array.isArray(response.data)) {
        this.loger.log("[AnalysisEngineClient] Invalid response shape (not array).");
        return [];
      }

      const results: Recommendation[] = [];

      for (const dto of response.data) {
        const mapped = mapRecommendationPayloadDto(dto);

        if (mapped.errors.length > 0) {
          this.loger.log(
            "[AnalysisEngineClient] Dropping invalid recommendation payload:" +
            mapped.errors.join("; ")
          );
          continue;
        }

        if (mapped.recommendation.id === -1) {
          continue;
        }

        results.push(mapped.recommendation);
      }

      return results;
    } catch (e) {
      this.loger.log("[AnalysisEngineClient] Request failed."+ String(e));
      return [];
    }
  }
}
