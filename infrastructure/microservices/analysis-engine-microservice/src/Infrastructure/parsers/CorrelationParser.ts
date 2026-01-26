import { CorrelationDTO } from "../../Domain/types/CorrelationDTO";
import { JsonValue } from "../../Domain/types/JsonValue";
import { isJsonArray } from "../json/isJsonArray";
import { isJsonObject } from "../json/isJsonObject";

const ALLOWED_SEVERITY = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

export function parseCorrelationCandidates(raw: JsonValue): CorrelationDTO[] {
  const items: JsonValue[] =
    isJsonArray(raw) ? [...raw] :
    isJsonObject(raw) ? [raw] :
    [];

  const out: CorrelationDTO[] = [];

  for (const item of items) {
    const parsed = parseCorrelationDTO(item);
    if (parsed.ok) out.push(parsed.value);
  }

  return out;
}

function parseCorrelationDTO(
  raw: JsonValue
): { readonly ok: true; readonly value: CorrelationDTO } | { readonly ok: false } {
  if (!isJsonObject(raw)) return { ok: false };

  const correlationDetected = raw["correlationDetected"];
  const confidence = raw["confidence"];
  const description = raw["description"];
  const correlatedEventIds = raw["correlatedEventIds"];
  const severityRaw = raw["severity"];

  if (typeof correlationDetected !== "boolean") return { ok: false };
  if (typeof confidence !== "number" || confidence < 0 || confidence > 1) return { ok: false };
  if (typeof description !== "string" || description.trim().length === 0) return { ok: false };
  if (!isJsonArray(correlatedEventIds)) return { ok: false };

  const ids = correlatedEventIds
    .map((x) => (typeof x === "number" ? x : Number.NaN))
    .filter((n) => Number.isFinite(n))
    .map((n) => Math.trunc(n))
    .filter((n) => n >= 0);

  const sev = typeof severityRaw === "string" ? severityRaw.toUpperCase() : "LOW";
  const severity: CorrelationDTO["severity"] =
    (ALLOWED_SEVERITY as readonly string[]).includes(sev)
      ? (sev as CorrelationDTO["severity"])
      : "LOW";

  return {
    ok: true,
    value: {
      id: 0,
      correlationDetected,
      description,
      timestamp: new Date(),
      confidence,
      severity,
      correlatedEventIds: ids,
    },
  };
}
