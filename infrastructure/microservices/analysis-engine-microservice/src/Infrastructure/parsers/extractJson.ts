export function extractJson(raw: string): string | null {
  if (!raw) return null;

  let str = raw
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const arrayStart = str.indexOf("[");
  const arrayEnd = str.lastIndexOf("]");
  if (arrayStart !== -1 && arrayEnd > arrayStart) {
    return str.slice(arrayStart, arrayEnd + 1);
  }

  const objStart = str.indexOf("{");
  const objEnd = str.lastIndexOf("}");
  if (objStart !== -1 && objEnd > objStart) {
    return str.slice(objStart, objEnd + 1);
  }

  return null;
}
