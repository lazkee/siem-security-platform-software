import { RecommendationContextAvg7dDto } from "./RecommendationContextAvg7dDto";
import { RecommendationContextIncidentsByCategoryDto } from "./RecommendationContextIncidentsByCategoryDto";
import { RecommendationContextLatestDto } from "./RecommendationContextLatestDto";
import { RecommendationContextSeriesPointDto } from "./RecommendationContextSeriesPointDto";
import { RecommendationContextWindowDto } from "./RecommendationContextWindowDto";

export type RecommendationContextDto = {
  window: RecommendationContextWindowDto;
  latest: RecommendationContextLatestDto;
  avg7d: RecommendationContextAvg7dDto;
  series: RecommendationContextSeriesPointDto[];
  incidentsByCategory7d: RecommendationContextIncidentsByCategoryDto[];
};
