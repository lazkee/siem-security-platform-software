import axios from "axios";
import { ChatMessage } from "../../Domain/types/ChatMessage";
import { GeminiResponse } from "../../Domain/types/gemini/GeminiResponse";
import { JsonObject, JsonValue } from "../../Domain/types/JsonValue";
import { Result } from "../../Domain/types/Result";
import { ILoggerService } from "../../Domain/services/ILoggerService";
import { extractFirstText } from "./extractFirstText";
import { safeJsonParse } from "./safeJsonParse";
import { extractJson } from "../parsers/extractJson";
import { sleep } from "./sleep";

export async function sendChatCompletion(
    apiUrl: string,
    apiKey: string,
    modelId: string,
    messages: ChatMessage[],
    loggerService: ILoggerService,
    timeoutMs = 60000,
    maxRetries = 3,
    schema?: JsonObject
  ): Promise<Result<JsonValue>> {
    const url = `${apiUrl}/models/${modelId}:generateContent`;

    const generationConfig: {
      readonly temperature: number;
      readonly responseMimeType?: string;
      readonly responseSchema?: JsonObject;
    } = schema
        ? { temperature: 0.0, responseMimeType: "application/json", responseSchema: schema }
        : { temperature: 0.0 };

    const payload: {
      readonly contents: ReadonlyArray<{
        readonly role: string;
        readonly parts: ReadonlyArray<{ readonly text: string }>;
      }>;
      readonly generationConfig: typeof generationConfig;
    } = {
      contents: messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      })),
      generationConfig,
    };

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const res = await axios.post<GeminiResponse>(url, payload, {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          timeout: timeoutMs,
        });

        const textRes = extractFirstText(res.data);
        if (!textRes.ok) {
          await loggerService.warn("[LLM] Missing text part in response", {
            attempt,
            modelId,
            error: textRes.error,
          });
          return { ok: false, error: "llm_missing_text" };
        }

        const text = textRes.value;

        // Schema mode: the provider should return JSON in `text`, but we still must guard.
        if (schema) {
          const parsed = safeJsonParse(text);
          if (!parsed.ok) {
            await loggerService.warn("[LLM] JSON.parse failed (schema mode)", {
              attempt,
              modelId,
              error: parsed.error,
            });
            return { ok: false, error: "schema_json_parse_failed" };
          }
          return parsed;
        }

        // Fallback mode: extract JSON from mixed text.
        const extracted = extractJson(text);
        if (!extracted.ok) {
          await loggerService.warn("[LLM] JSON extraction failed (fallback mode)", {
            attempt,
            modelId,
            error: extracted.error,
          });
          return { ok: false, error: extracted.error };
        }

        const parsed = safeJsonParse(extracted.value);
        if (!parsed.ok) {
          await loggerService.warn("[LLM] JSON.parse failed (fallback mode)", {
            attempt,
            modelId,
            error: parsed.error,
          });
          return { ok: false, error: "fallback_json_parse_failed" };
        }

        return parsed;
      } catch (e) {
        const status =
          axios.isAxiosError(e) ? e.response?.status : undefined;

        const message =
          e instanceof Error ? e.message : "unknown_error";

        const data =
          axios.isAxiosError(e) ? e.response?.data : undefined;

        await loggerService.warn("[LLM] Request failed", {
          attempt,
          modelId,
          
          message,
          data
        });

        if (attempt < maxRetries) await sleep(400 * attempt);
      }
    }

    await loggerService.error("[LLM] All retries exhausted", { modelId });
    return { ok: false, error: "retries_exhausted" };
}