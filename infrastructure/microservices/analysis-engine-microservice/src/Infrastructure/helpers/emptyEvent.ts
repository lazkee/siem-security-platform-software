import { EventDTO } from "../../Domain/types/EventDTO";

export function emptyEvent(): EventDTO {
    return {
      type: "INFO",
      description: "__NORMALIZATION_FAILED__",
    };
}