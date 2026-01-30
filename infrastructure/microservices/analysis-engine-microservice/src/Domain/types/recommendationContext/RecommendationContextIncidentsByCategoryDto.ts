import { CorrelationCategory } from "../../enums/CorrelationCategory";

export type RecommendationContextIncidentsByCategoryDto = {
  category: CorrelationCategory;
  count: number;
};