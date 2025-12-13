import { EventDTO } from "../../Domain/types/EventDTO";

export function parseEventDTO(raw: unknown): EventDTO | null {
  if (!raw || typeof raw !== "object") return null;

  const obj = raw as any;

  if (typeof obj.type !== "string" || typeof obj.description !== "string") {
    return null;
  }

  const type = obj.type.toUpperCase();
  const allowed: EventDTO["type"][] = ["INFO", "WARNING", "ERROR"];

  if (!allowed.includes(type)) return null;

  return {
    type,
    description: obj.description,
  };
}
