import { Result } from "../../Domain/types/Result";

export function parseDateMs(raw: string): Result<number> {
    const d = new Date(raw);
    const ms = d.getTime();
    if (Number.isNaN(ms)) return { ok: false, error: "invalid_timestamp" };
    return { ok: true, value: ms };
  }