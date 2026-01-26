// src/Services/LLMChatAPIService.ts

import axios, { AxiosError } from "axios";
import dotenv from "dotenv";
import { ILLMChatAPIService } from "../Domain/services/ILLMChatAPIService";
import { ILoggerService } from "../Domain/services/ILoggerService";
import { ChatMessage } from "../Domain/types/ChatMessage";
import { EventDTO } from "../Domain/types/EventDTO";
import { CorrelationDTO } from "../Domain/types/CorrelationDTO";
import { Result } from "../Domain/types/Result";
import { JsonObject, JsonValue } from "../Domain/types/JsonValue";
import { extractJson } from "../Infrastructure/parsers/extractJson";
import { parseEventDTO } from "../Infrastructure/parsers/EventParser";
import { parseCorrelationCandidates } from "../Infrastructure/parsers/CorrelationParser";
import { EventResponseSchema } from "../Infrastructure/schemas/EventResponse.schema";
import { CorrelationResponseSchema } from "../Infrastructure/schemas/CorrelationResponse.schema";
import { NORMALIZATION_PROMPT } from "../Infrastructure/prompts/normalization.prompt";
import { CORRELATION_PROMPT } from "../Infrastructure/prompts/correlation.prompt";

dotenv.config();

// Minimal, typed view of Gemini response we actually use (no any/unknown).
type GeminiPart = { readonly text?: string };
type GeminiContent = { readonly parts?: readonly GeminiPart[] };
type GeminiCandidate = { readonly content?: GeminiContent };
type GeminiResponse = { readonly candidates?: readonly GeminiCandidate[] };

export class LLMChatAPIService implements ILLMChatAPIService {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly normalizationModelId: string;
  private readonly correlationModelId: string;

  private readonly timeoutMs = 60000;
  private readonly maxRetries = 3;

  public constructor(private readonly loggerService: ILoggerService) {
    this.apiUrl = (process.env.LLM_API_URL ?? "").replace(/\/+$/, "");
    this.apiKey = process.env.GEMINI_API_KEY ?? "";
    this.normalizationModelId = process.env.GEMINI_NORMALIZATION_MODEL_ID ?? "";
    this.correlationModelId = process.env.GEMINI_CORRELATION_MODEL_ID ?? "";

    void this.loggerService.info("[LLM] Service initialized", {
      apiUrl: this.apiUrl,
      normalizationModelId: this.normalizationModelId,
      correlationModelId: this.correlationModelId,
    });
  }

  // =========================================================
  // NORMALIZATION (EventDTO)
  // =========================================================
  public async sendNormalizationPrompt(rawLog: string): Promise<EventDTO> {
    const input = typeof rawLog === "string" ? rawLog.trim() : "";
    if (input.length === 0) {
      await this.loggerService.warn("[LLM] Normalization skipped: empty input");
      return this.emptyEvent();
    }

    const messages: ChatMessage[] = [
      {
        role: "user",
        content: `${NORMALIZATION_PROMPT}${input}`.trim(),
      },
    ];

    const raw = await this.sendChatCompletion(
      this.normalizationModelId,
      messages,
      EventResponseSchema as JsonObject
    );

    if (!raw.ok) {
      await this.loggerService.warn("[LLM] Normalization failed: LLM request/parse error", {
        error: raw.error,
        modelId: this.normalizationModelId,
      });
      return this.emptyEvent();
    }

    const parsed = parseEventDTO(raw.value);
    if (!parsed.ok) {
      await this.loggerService.warn("[LLM] Normalization failed schema validation", {
        error: parsed.error,
        modelId: this.normalizationModelId,
        raw: raw.value,
      });
      return this.emptyEvent();
    }

    return parsed.value;
  }

  // =========================================================
  // CORRELATION (CorrelationDTO[])
  // =========================================================
  public async sendCorrelationPrompt(rawMessage: string): Promise<CorrelationDTO[]> {
    const input = typeof rawMessage === "string" ? rawMessage.trim() : "";
    if (input.length === 0) {
      await this.loggerService.warn("[LLM] Correlation skipped: empty input");
      return [];
    }

    const messages: ChatMessage[] = [
      {
        role: "user",
        content: `${CORRELATION_PROMPT}${input}`.trim(),
      },
    ];

    const raw = await this.sendChatCompletion(
      this.correlationModelId,
      messages,
      CorrelationResponseSchema as JsonObject
    );

    if (!raw.ok) {
      await this.loggerService.warn("[LLM] Correlation failed: LLM request/parse error", {
        error: raw.error,
        modelId: this.correlationModelId,
      });
      return [];
    }

    return parseCorrelationCandidates(raw.value);
  }

  // =========================================================
  // LLM CALL (Gemini)
  // =========================================================
  private async sendChatCompletion(
    modelId: string,
    messages: ChatMessage[],
    schema?: JsonObject
  ): Promise<Result<JsonValue>> {
    const url = `${this.apiUrl}/models/${modelId}:generateContent`;

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

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const res = await axios.post<GeminiResponse>(url, payload, {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": this.apiKey,
          },
          timeout: this.timeoutMs,
        });

        const textRes = this.extractFirstText(res.data);
        if (!textRes.ok) {
          await this.loggerService.warn("[LLM] Missing text part in response", {
            attempt,
            modelId,
            error: textRes.error,
          });
          return { ok: false, error: "llm_missing_text" };
        }

        const text = textRes.value;

        // Schema mode: the provider should return JSON in `text`, but we still must guard.
        if (schema) {
          const parsed = this.safeJsonParse(text);
          if (!parsed.ok) {
            await this.loggerService.warn("[LLM] JSON.parse failed (schema mode)", {
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
          await this.loggerService.warn("[LLM] JSON extraction failed (fallback mode)", {
            attempt,
            modelId,
            error: extracted.error,
          });
          return { ok: false, error: extracted.error };
        }

        const parsed = this.safeJsonParse(extracted.value);
        if (!parsed.ok) {
          await this.loggerService.warn("[LLM] JSON.parse failed (fallback mode)", {
            attempt,
            modelId,
            error: parsed.error,
          });
          return { ok: false, error: "fallback_json_parse_failed" };
        }

        return parsed;
      } catch (e) {
        const status =
          axios.isAxiosError(e) && typeof e.response?.status === "number"
            ? e.response.status
            : 0;

        const message =
          e instanceof Error
            ? e.message
            : "non-Error thrown";

        await this.loggerService.warn("[LLM] Request failed", {
          attempt,
          modelId,
          status,
          message,
        });

        if (attempt < this.maxRetries) await this.sleep(400 * attempt);
      }
    }

    await this.loggerService.error("[LLM] All retries exhausted", { modelId });
    return { ok: false, error: "retries_exhausted" };
  }

  private extractFirstText(data: GeminiResponse): Result<string> {
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== "string") return { ok: false, error: "text_not_string" };

    const trimmed = text.trim();
    if (trimmed.length === 0) return { ok: false, error: "text_empty" };

    return { ok: true, value: trimmed };
  }

  private safeJsonParse(text: string): Result<JsonValue> {
    try {
      const parsed = JSON.parse(text) as JsonValue;
      return { ok: true, value: parsed };
    } catch {
      return { ok: false, error: "json_parse_failed" };
    }
  }

  // =========================================================
  // FALLBACKS
  // =========================================================
  private emptyEvent(): EventDTO {
    return {
      type: "INFO",
      description: "__NORMALIZATION_FAILED__",
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
