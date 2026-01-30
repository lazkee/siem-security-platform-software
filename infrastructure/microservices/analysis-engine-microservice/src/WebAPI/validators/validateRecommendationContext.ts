import { RecommendationContextDto } from "../../Domain/types/recommendationContext/RecommendationContext";
import { Result } from "../../Domain/types/Result";
import { JsonValue } from "../../Domain/types/JsonValue";
import { isJsonArray } from "../../Infrastructure/json/isJsonArray";
import { isJsonObject } from "../../Infrastructure/json/isJsonObject";
import { CorrelationCategory } from "../../Domain/enums/CorrelationCategory";

const CORRELATION_CATEGORY_VALUES: readonly string[] = Object.values(CorrelationCategory);

export function validateRecommendationContextDto(raw: JsonValue): Result<RecommendationContextDto> {
  if (!isJsonObject(raw)) {
    return { ok: false, error: "Body must be a JSON object (RecommendationContextDto)." };
  }

  const windowRaw = raw["window"];
  const latestRaw = raw["latest"];
  const avg7dRaw = raw["avg7d"];
  const seriesRaw = raw["series"];
  const incidentsRaw = raw["incidentsByCategory7d"];

  // window
  if (!isJsonObject(windowRaw)) {
    return { ok: false, error: '"window" must be an object.' };
  }

  const fromUtcRaw = windowRaw["fromUtc"];
  const toUtcRaw = windowRaw["toUtc"];

  if (typeof fromUtcRaw !== "string" || fromUtcRaw.trim().length === 0) {
    return { ok: false, error: '"window.fromUtc" must be a non-empty string.' };
  }
  if (typeof toUtcRaw !== "string" || toUtcRaw.trim().length === 0) {
    return { ok: false, error: '"window.toUtc" must be a non-empty string.' };
  }

  // latest
  if (!isJsonObject(latestRaw)) {
    return { ok: false, error: '"latest" must be an object.' };
  }

  const latestMttdRaw = latestRaw["mttd_minutes"];
  const latestMttrRaw = latestRaw["mttr_minutes"];
  const latestFarRaw = latestRaw["false_alarm_rate"];
  const latestScoreRaw = latestRaw["score_value"];
  const latestMaturityRaw = latestRaw["maturity_level"];

  if (!isFiniteNumber(latestMttdRaw)) return { ok: false, error: '"latest.mttd_minutes" must be a finite number.' };
  if (!isFiniteNumber(latestMttrRaw)) return { ok: false, error: '"latest.mttr_minutes" must be a finite number.' };
  if (!isFiniteNumber(latestFarRaw)) return { ok: false, error: '"latest.false_alarm_rate" must be a finite number.' };
  if (!isFiniteNumber(latestScoreRaw)) return { ok: false, error: '"latest.score_value" must be a finite number.' };

  if (typeof latestMaturityRaw !== "string" || latestMaturityRaw.trim().length === 0) {
    return { ok: false, error: '"latest.maturity_level" must be a non-empty string.' };
  }

  // re-bind validated latest primitives
  const latestMttdMinutes: number = latestMttdRaw;
  const latestMttrMinutes: number = latestMttrRaw;
  const latestFalseAlarmRate: number = latestFarRaw;
  const latestScoreValue: number = latestScoreRaw;
  const latestMaturityLevel: string = latestMaturityRaw.trim();

  // avg7d
  if (!isJsonObject(avg7dRaw)) {
    return { ok: false, error: '"avg7d" must be an object.' };
  }

  const avgMttdRaw = avg7dRaw["mttd_minutes"];
  const avgMttrRaw = avg7dRaw["mttr_minutes"];
  const avgFarRaw = avg7dRaw["false_alarm_rate"];
  const avgTotalRaw = avg7dRaw["total_alerts"];

  if (!isFiniteNumber(avgMttdRaw)) return { ok: false, error: '"avg7d.mttd_minutes" must be a finite number.' };
  if (!isFiniteNumber(avgMttrRaw)) return { ok: false, error: '"avg7d.mttr_minutes" must be a finite number.' };
  if (!isFiniteNumber(avgFarRaw)) return { ok: false, error: '"avg7d.false_alarm_rate" must be a finite number.' };
  if (!isFiniteNumber(avgTotalRaw)) return { ok: false, error: '"avg7d.total_alerts" must be a finite number.' };

  // re-bind validated avg7d primitives
  const avgMttdMinutes: number = avgMttdRaw;
  const avgMttrMinutes: number = avgMttrRaw;
  const avgFalseAlarmRate: number = avgFarRaw;
  const avgTotalAlerts: number = avgTotalRaw;

  // series
  if (!isJsonArray(seriesRaw)) {
    return { ok: false, error: '"series" must be an array.' };
  }

  const series: RecommendationContextDto["series"] = [];

  for (let i = 0; i < seriesRaw.length; i++) {
    const p = seriesRaw[i];
    if (!isJsonObject(p)) return { ok: false, error: `"series[${i}]" must be an object.` };

    const pFromUtc = p["fromUtc"];
    const pMttd = p["mttd"];
    const pMttr = p["mttr"];
    const pFar = p["far"];
    const pScore = p["score"];
    const pTotal = p["total"];

    if (typeof pFromUtc !== "string" || pFromUtc.trim().length === 0) {
      return { ok: false, error: `"series[${i}].fromUtc" must be a non-empty string.` };
    }
    if (!isFiniteNumber(pMttd)) return { ok: false, error: `"series[${i}].mttd" must be a finite number.` };
    if (!isFiniteNumber(pMttr)) return { ok: false, error: `"series[${i}].mttr" must be a finite number.` };
    if (!isFiniteNumber(pFar)) return { ok: false, error: `"series[${i}].far" must be a finite number.` };
    if (!isFiniteNumber(pScore)) return { ok: false, error: `"series[${i}].score" must be a finite number.` };
    if (!isFiniteNumber(pTotal)) return { ok: false, error: `"series[${i}].total" must be a finite number.` };

    series.push({
      fromUtc: pFromUtc.trim(),
      mttd: pMttd,
      mttr: pMttr,
      far: pFar,
      score: pScore,
      total: pTotal,
    });
  }

  // incidentsByCategory7d
  if (!isJsonArray(incidentsRaw)) {
    return { ok: false, error: '"incidentsByCategory7d" must be an array.' };
  }

  const incidentsByCategory7d: RecommendationContextDto["incidentsByCategory7d"] = [];

  for (let i = 0; i < incidentsRaw.length; i++) {
    const item = incidentsRaw[i];
    if (!isJsonObject(item)) return { ok: false, error: `"incidentsByCategory7d[${i}]" must be an object.` };

    const categoryRaw = item["category"];
    const countRaw = item["count"];

    if (typeof categoryRaw !== "string") {
      return { ok: false, error: `"incidentsByCategory7d[${i}].category" must be a string.` };
    }

    const cat = categoryRaw.trim().toUpperCase();
    if (!CORRELATION_CATEGORY_VALUES.includes(cat)) {
      return { ok: false, error: `"incidentsByCategory7d[${i}].category" must be a valid CorrelationCategory.` };
    }

    if (!isFiniteNumber(countRaw)) {
      return { ok: false, error: `"incidentsByCategory7d[${i}].count" must be a finite number.` };
    }

    incidentsByCategory7d.push({
      category: cat as CorrelationCategory,
      count: countRaw,
    });
  }

  const context: RecommendationContextDto = {
    window: {
      fromUtc: fromUtcRaw.trim(),
      toUtc: toUtcRaw.trim(),
    },
    latest: {
      mttd_minutes: latestMttdMinutes,
      mttr_minutes: latestMttrMinutes,
      false_alarm_rate: latestFalseAlarmRate,
      score_value: latestScoreValue,
      maturity_level: latestMaturityLevel as RecommendationContextDto["latest"]["maturity_level"],
    },
    avg7d: {
      mttd_minutes: avgMttdMinutes,
      mttr_minutes: avgMttrMinutes,
      false_alarm_rate: avgFalseAlarmRate,
      total_alerts: avgTotalAlerts,
    },
    series,
    incidentsByCategory7d,
  };

  return { ok: true, value: context };
}

function isFiniteNumber(v: JsonValue): v is number {
  return typeof v === "number" && Number.isFinite(v);
}
