import { Result } from "../../Domain/types/Result";

export function extractJson(raw: string): Result<string> {
  const input = typeof raw === "string" ? raw.trim() : "";

  if (input.length === 0) return { ok: false, error: "empty_input" };

  const cleaned = input
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const arrayStart = cleaned.indexOf("[");
  const arrayEnd = cleaned.lastIndexOf("]");
  if (arrayStart !== -1 && arrayEnd > arrayStart) {
    return { ok: true, value: cleaned.slice(arrayStart, arrayEnd + 1) };
  }

  const objStart = cleaned.indexOf("{");
  const objEnd = cleaned.lastIndexOf("}");
  if (objStart !== -1 && objEnd > objStart) {
    return { ok: true, value: cleaned.slice(objStart, objEnd + 1) };
  }

  return { ok: false, error: "no_json_found" };
}
