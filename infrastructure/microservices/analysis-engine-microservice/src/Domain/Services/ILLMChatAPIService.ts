import { CorrelationDTO } from "../types/CorrelationDTO";
import { EventDTO } from "../types/EventDTO";

export interface ILLMChatAPIService {
  sendNormalizationPrompt(rawMessage: string): Promise<EventDTO>;
  sendCorrelationPrompt(rawMessage: string): Promise<CorrelationDTO[]>;
}
