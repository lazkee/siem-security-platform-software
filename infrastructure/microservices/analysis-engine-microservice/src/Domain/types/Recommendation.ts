import { RecommendationPriority } from "../enums/RecommendationPriority";
import { RecommendationEffort } from "../enums/RecommendationEffort";
import { RecommendationCategory } from "../enums/RecommendationCategory";
import { RecommendationMetric } from "../enums/RecommendationMetric";

export interface Recommendation {
  id: number;
  title: string;
  rationale: string;
  priority: RecommendationPriority;
  effort: RecommendationEffort;
  category: RecommendationCategory;
  relatedMetrics: RecommendationMetric[];
  suggestedActions: string[];
}