export interface ILLMChatAPIService {
  sendNormalizationPrompt(rawMessage: string): Promise<string | JSON>;
  sendCorrelationPrompt(rawMessage: string): Promise<string | JSON>;
}
