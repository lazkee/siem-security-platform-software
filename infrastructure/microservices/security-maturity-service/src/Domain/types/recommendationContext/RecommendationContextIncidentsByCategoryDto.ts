import { AlertCategory } from "../../enums/AlertCategory";

export type RecommendationContextIncidentsByCategoryDto = {
  category: AlertCategory;
  count: number;
};