import { JsonValue } from "../../Domain/types/JsonValue";
import { QueryEventDTO } from "../../Domain/types/QueryEventDTO";
import { isJsonArray } from "../json/isJsonArray";
import { isJsonObject } from "../json/isJsonObject";

function toNonEmptyString(v: JsonValue): string {
  return typeof v === "string" ? v : "";
}

function toFiniteInt(v: JsonValue): number {
  if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === "string") {
    const n = Number(v);
    if (Number.isFinite(n)) return Math.trunc(n);
  }
  return 0;
}

export function parseQueryEvents(raw: JsonValue): QueryEventDTO[] {
  if (!isJsonArray(raw)) return [];

  const out: QueryEventDTO[] = [];

  for (const item of raw) {
    if (!isJsonObject(item)) continue;

    const id = toFiniteInt(item["id"]);
    if (id <= 0) continue;

    const source = toNonEmptyString(item["source"]);
    const type = toNonEmptyString(item["type"]);
    const description = toNonEmptyString(item["description"]);

    const tsVal = item["timestamp"];
    const timestamp =
      typeof tsVal === "string"
        ? tsVal
        : tsVal instanceof Date
          ? tsVal.toISOString()
          : "";

    const ipVal = item["ipAddress"];
    const ipAddress = typeof ipVal === "string" ? ipVal : "";

    out.push({
      id,
      source,
      type,
      description,
      timestamp,
      ipAddress,
    });
  }

  return out;
}
