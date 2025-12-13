import { CorrelationDTO } from "../../Domain/types/CorrelationDTO";

const ALLOWED_SEVERITY = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

export function parseCorrelationCandidates(raw: unknown): CorrelationDTO[] {
  if (!raw) return [];

  const arr: unknown[] = Array.isArray(raw)
    ? raw
    : typeof raw === "object"
    ? [raw]
    : [];

  const out: CorrelationDTO[] = [];

  for (const item of arr) {
    const dto = parseCorrelationDTO(item);
    if (dto) out.push(dto);
  }

  return out;
}

function parseCorrelationDTO(raw: unknown): CorrelationDTO | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as any;

  if (typeof obj.correlationDetected !== "boolean") return null;
  if (typeof obj.confidence !== "number" || obj.confidence < 0 || obj.confidence > 1) return null;
  if (typeof obj.description !== "string" || obj.description.trim().length === 0) return null;
  if (!Array.isArray(obj.correlatedEventIds)) return null;

  const correlatedEventIds = obj.correlatedEventIds
    .map((x: any) => Number(x))
    .filter((n: number) => Number.isFinite(n))
    .map((n: number) => Math.trunc(n));

  const sev = typeof obj.severity === "string" ? obj.severity.toUpperCase() : "LOW";
  const severity: CorrelationDTO["severity"] =
    (ALLOWED_SEVERITY as readonly string[]).includes(sev)
      ? (sev as CorrelationDTO["severity"])
      : "LOW";

  return {
    id: 0,
    correlationDetected: obj.correlationDetected,
    description: obj.description,
    timestamp: new Date(),
    confidence: obj.confidence,
    severity,
    correlatedEventIds,
  };
}
