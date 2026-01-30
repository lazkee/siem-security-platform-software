import { JsonValue } from "../../Domain/types/JsonValue";
import { Result } from "../../Domain/types/Result";

export function safeJsonParse(text: string): Result<JsonValue> {
    try {
      const parsed = JSON.parse(text) as JsonValue;
      return { ok: true, value: parsed };
    } catch {
      return { ok: false, error: "json_parse_failed" };
    }
  }