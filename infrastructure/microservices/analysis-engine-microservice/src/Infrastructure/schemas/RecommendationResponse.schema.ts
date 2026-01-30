import { RecommendationPriority } from "../../Domain/enums/RecommendationPriority";
import { RecommendationEffort } from "../../Domain/enums/RecommendationEffort";
import { RecommendationCategory } from "../../Domain/enums/RecommendationCategory";
import { RecommendationMetric } from "../../Domain/enums/RecommendationMetric";

const priorityValues: string[] = Object.values(RecommendationPriority);
const effortValues: string[] = Object.values(RecommendationEffort);
const categoryValues: string[] = Object.values(RecommendationCategory);
const metricValues: string[] = Object.values(RecommendationMetric);

export const RecommendationResponseSchema = {
  type: "array",
  description: "Security recommendations generated from RecommendationContextDto.",
  items: {
    type: "object",
    required: ["id", "title", "rationale", "priority", "effort", "category", "relatedMetrics", "suggestedActions"],
    properties: {
      id: { type: "number" },
      title: { type: "string" },
      rationale: { type: "string" },
      priority: { type: "string", enum: priorityValues },
      effort: { type: "string", enum: effortValues },
      category: { type: "string", enum: categoryValues },
      relatedMetrics: {
        type: "array",
        items: { type: "string", enum: metricValues }
      },
      suggestedActions: {
        type: "array",
        items: { type: "string" }
      }
    }
  }
} as const;
