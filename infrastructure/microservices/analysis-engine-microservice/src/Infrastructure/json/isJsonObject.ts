import { JsonObject, JsonValue } from "../../Domain/types/JsonValue";

export function isJsonObject(v: JsonValue): v is JsonObject {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}