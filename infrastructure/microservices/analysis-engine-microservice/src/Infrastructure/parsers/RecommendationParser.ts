import { Recommendation } from "../../Domain/types/Recommendation";
import { RecommendationPriority } from "../../Domain/enums/RecommendationPriority";
import { RecommendationEffort } from "../../Domain/enums/RecommendationEffort";
import { RecommendationCategory } from "../../Domain/enums/RecommendationCategory";
import { RecommendationMetric } from "../../Domain/enums/RecommendationMetric";
import { JsonValue } from "../../Domain/types/JsonValue";
import { isJsonArray } from "../json/isJsonArray";
import { isJsonObject } from "../json/isJsonObject";

const PRIORITY_VALUES: readonly string[] = Object.values(RecommendationPriority);
const EFFORT_VALUES: readonly string[] = Object.values(RecommendationEffort);
const CATEGORY_VALUES: readonly string[] = Object.values(RecommendationCategory);
const METRIC_VALUES: readonly string[] = Object.values(RecommendationMetric);

export function parseRecommendations(raw: JsonValue): Recommendation[] {
  if (!isJsonArray(raw)) return [];

  const out: Recommendation[] = [];

  for (const item of raw) {
    const parsed = parseOne(item);
    if (parsed.ok) out.push(parsed.value);
  }

  return out;
}

function parseOne(
  raw: JsonValue
):
  | { readonly ok: true; readonly value: Recommendation }
  | { readonly ok: false } {
  if (!isJsonObject(raw)) return { ok: false };

  const idRaw = raw["id"];
  const titleRaw = raw["title"];
  const rationaleRaw = raw["rationale"];
  const priorityRaw = raw["priority"];
  const effortRaw = raw["effort"];
  const categoryRaw = raw["category"];
  const relatedMetricsRaw = raw["relatedMetrics"];
  const suggestedActionsRaw = raw["suggestedActions"];

  
  if (typeof idRaw !== "number" || !Number.isFinite(idRaw)) return { ok: false };
  const id = Math.trunc(idRaw);
  if (id < 1) return { ok: false };

  if (typeof titleRaw !== "string") return { ok: false };
  const title = titleRaw.trim();
  if (title.length < 8 || title.length > 120) return { ok: false };

  if (typeof rationaleRaw !== "string") return { ok: false };
  const rationale = rationaleRaw.trim();
  if (rationale.length < 30 || rationale.length > 900) return { ok: false };

  if (typeof priorityRaw !== "string") return { ok: false };
  if (typeof effortRaw !== "string") return { ok: false };
  if (typeof categoryRaw !== "string") return { ok: false };

  
  const priorityUpper = priorityRaw.trim().toUpperCase();
  const priority: RecommendationPriority = PRIORITY_VALUES.includes(priorityUpper)
    ? (priorityUpper as RecommendationPriority)
    : RecommendationPriority.MEDIUM;

  const effortUpper = effortRaw.trim().toUpperCase();
  const effort: RecommendationEffort = EFFORT_VALUES.includes(effortUpper)
    ? (effortUpper as RecommendationEffort)
    : RecommendationEffort.MEDIUM;

  const categoryUpper = categoryRaw.trim().toUpperCase();
  if (!CATEGORY_VALUES.includes(categoryUpper)) return { ok: false };
  const category: RecommendationCategory = categoryUpper as RecommendationCategory;

  
  const relatedMetrics: RecommendationMetric[] = [];
  if (isJsonArray(relatedMetricsRaw)) {
    for (const m of relatedMetricsRaw) {
      if (typeof m !== "string") continue;
      const metricUpper = m.trim().toUpperCase();
      if (METRIC_VALUES.includes(metricUpper)) {
        relatedMetrics.push(metricUpper as RecommendationMetric);
      }
    }
  }

  
  if (!isJsonArray(suggestedActionsRaw)) return { ok: false };

  const suggestedActions: string[] = [];
  for (const a of suggestedActionsRaw) {
    if (typeof a !== "string") continue;
    const t = a.trim();
    if (t.length >= 6 && t.length <= 160) suggestedActions.push(t);
  }
  if (suggestedActions.length < 1) return { ok: false };

  return {
    ok: true,
    value: {
      id,
      title,
      rationale,
      priority,
      effort,
      category,
      relatedMetrics,
      suggestedActions,
    },
  };
}
