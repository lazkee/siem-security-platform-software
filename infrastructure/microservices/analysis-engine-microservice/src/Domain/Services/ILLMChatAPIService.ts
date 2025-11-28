export type ChatRole = "system" | "user";

export interface ChatMessage {
  role: ChatRole ;
  content: string;
}

export interface ILLMChatAPIService {
  sendPromptToLLM(message: ChatMessage): Promise<string>;
}