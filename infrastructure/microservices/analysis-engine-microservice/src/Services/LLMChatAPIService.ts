import axios from "axios";
import dotenv from "dotenv";
import { ILLMChatAPIService } from "../Domain/Services/ILLMChatAPIService";
import { ChatMessage } from "../Domain/types/ChatMessage";


export class LLMChatAPIService implements ILLMChatAPIService {

    private readonly apiUrl: string;
    private readonly gemmaModelId: string;
    private readonly deepseekModelId: string;

    constructor() {
        this.apiUrl = process.env.LLM_API_URL ?? "";
        this.gemmaModelId = process.env.GEMMA_MODEL_ID ?? "";
        this.deepseekModelId = process.env.DEEPSEEK_MODEL_ID ?? "";

        if (!this.apiUrl) {
            throw new Error("LLM_API_URL (or API_URL) not defined in environment variables");
        }
        if (!this.gemmaModelId) {
            throw new Error("GEMMA_MODEL_ID not defined in environment variables");
        }
        if (!this.deepseekModelId) {
            throw new Error("DEEPSEEK_MODEL_ID not defined in environment variables");
        }
    }

    

    async sendNormalizationPrompt(rawMessage: string): Promise<string | JSON> {
        const messages: ChatMessage[] = [
            {
                role: "system",
                content: `You are an SIEM analyzer that transforms raw logs into Event JSON objects.
                        Instructions:
                        1. Output a single JSON object matching the Event entity:
                        {
                            "type": "INFO" | "ERROR" | "WARNING",
                            "description": string
                        }
                        2. Ensure 'type' matches one of the EventType enum values.
                        3. 'description' should summarize the content concisely.
                        4. Output only the JSON, no explanations or extra text.`
            },
            {
                role: "user",
                content: `TASK: Create an Event JSON\nInput: ${rawMessage}`
            }
        ];

        return this.sendChatCompletion(this.gemmaModelId, messages);
    }

    async sendCorrelationPrompt(rawMessage: string): Promise<string | JSON> {
        const messages: ChatMessage[] = [
            {
                role: "system",
                content: `You are a Senior Security Analyst specializing in SIEM correlation analysis.
                        Respond with a single JSON object describing correlations between the provided events.
                        JSON shape:
                        {
                          "correlation_detected": boolean,
                          "confidence": number,   // 0-1
                          "summary": string,
                          "related_indicators": string[] // indicators, IPs, hosts, users, or rules involved
                        }
                        Output only JSON. No extra text.`
            },
            {
                role: "user",
                content: `TASK: Detect correlations between events\nInput: ${rawMessage}`
            }
        ];

        return this.sendChatCompletion(this.deepseekModelId, messages);
    }

    private async sendChatCompletion(modelId: string, messages: ChatMessage[]): Promise<string | JSON> {
        try {
            const res = await axios.post(
                this.apiUrl,
                {
                    model: modelId,
                    messages,
                    temperature: 0.1,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer lm-studio",
                    },
                }
            );

            const responseText = res.data?.choices?.[0]?.message?.content ?? "No response from the model.";

            // if LLM returns not onlu JSON, clean the response
           const cleaned = responseText
                .replace(/<think>[\s\S]*?<\/think>/gi, "")
                .replace(/```(?:json)?\s*([\s\S]*?)```/gi, "$1")
                .replace(/```/g, "")
                .trim();


            try {
                return JSON.parse(cleaned);
            } catch {
                return cleaned;
            }

        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const apiMsg = error.response?.data?.error?.message ?? error.response?.data?.message;
                throw new Error(`LLM error: ${apiMsg ?? error.message}`);
            }
            throw new Error(`Unexpected error: ${error.message}`);
        }
    }
}
