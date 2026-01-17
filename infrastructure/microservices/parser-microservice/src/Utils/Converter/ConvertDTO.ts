import { ParserEventDTO } from "../../Domain/DTOs/ParserEventDTO";

export function toDTO(parserEvent: any): ParserEventDTO {
  return {
    parser_id: parserEvent.parserId,
    event_id: parserEvent.eventId,
    text_before_parsing: parserEvent.textBeforeParsing,
    ipAddress: parserEvent.ipAddress,
  };
}