import { RecommendationContextDto } from "../types/recommendationContext/RecommendationContext";

export interface IRecommendationContextService {
  buildContext(fromUtc: Date, toUtc: Date): Promise<RecommendationContextDto>;
}