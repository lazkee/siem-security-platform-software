import { JsonValue } from "../../Domain/types/JsonValue";
import { QueryEventDTO } from "../../Domain/types/QueryEventDTO";
import { Result } from "../../Domain/types/Result";
import { parseQueryEvents } from "../parsers/QueryEventParser";

export function safeParseEvents(raw: JsonValue): Result<QueryEventDTO[]> {
    try {
      const events = parseQueryEvents(raw);
      return { ok: true, value: events };
    } catch {
      // parseQueryEvents ideally never throws, but we still comply with "never throw"
      return { ok: false, error: "parse_query_events_failed" };
    }
  }