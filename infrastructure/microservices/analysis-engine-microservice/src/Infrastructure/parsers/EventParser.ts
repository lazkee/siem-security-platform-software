import { EventDTO } from "../../Domain/types/EventDTO";
import { Result } from "../../Domain/types/Result";
import { JsonValue } from "../../Domain/types/JsonValue";
import { isJsonObject } from "../json/isJsonObject";

export function parseEventDTO(raw: JsonValue): Result<EventDTO> {
  if (!isJsonObject(raw)) return { ok: false, error: "not_object" };

  const typeVal = raw["type"];
  const descVal = raw["description"];

  if (typeof typeVal !== "string") return { ok: false, error: "type_not_string" };
  if (typeof descVal !== "string" || descVal.trim().length === 0)
    return { ok: false, error: "description_invalid" };

  const type = typeVal.toUpperCase();
  const allowed: EventDTO["type"][] = ["INFO", "WARNING", "ERROR"];

  if (!allowed.includes(type as EventDTO["type"]))
    return { ok: false, error: "type_not_allowed" };

  return {
    ok: true,
    value: {
      type: type as EventDTO["type"],
      description: descVal,
    },
  };
}
