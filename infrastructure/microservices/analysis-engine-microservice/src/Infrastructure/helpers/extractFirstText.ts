import { GeminiResponse } from "../../Domain/types/gemini/GeminiResponse";
import { Result } from "../../Domain/types/Result";

export function extractFirstText(data: GeminiResponse): Result<string> {
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== "string") return { ok: false, error: "text_not_string" };

    const trimmed = text.trim();
    if (trimmed.length === 0) return { ok: false, error: "text_empty" };

    return { ok: true, value: trimmed };
}