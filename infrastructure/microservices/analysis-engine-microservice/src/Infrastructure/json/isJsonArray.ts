import { JsonArray, JsonValue } from "../../Domain/types/JsonValue";

export function isJsonArray(v: JsonValue): v is JsonArray {
  return Array.isArray(v);
}