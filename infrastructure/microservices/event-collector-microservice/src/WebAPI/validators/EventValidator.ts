import { EventDTO } from "../../Domain/DTOs/EventDTO";
import { EventType } from "../../Domain/enums/EventType";
import { ValidationResult } from "../../Domain/types/ValidationResult";

export function validateEventData(data: EventDTO): ValidationResult {
  if (data.userId !== undefined && !Number.isInteger(data.userId)) {
    return { success: false, message: "Invalid userId - must be a number" };
  }

  if (data.userRole !== undefined && typeof data.userRole !== "string") {
    return { success: false, message: "Invalid userRole - must be a string" };
  }

  if (data.userRole !== undefined && data.userRole.length > 100) {
    return { success: false, message: "userRole must be <= 100 characters" };
  }

  if (!data.source || data.source.trim().length === 0) {
    return { success: false, message: "Source is required" };
  }

  if (data.source.length > 255) {
    return { success: false, message: "Source must be <= 255 characters" };
  }

  if (!data.type || !Object.values(EventType).includes(data.type)) {
    return { success: false, message: "Invalid event type" };
  }

  if (!data.description || data.description.trim().length === 0) {
    return { success: false, message: "Description is required" };
  }

  if (data.description.length > 255) {
    return {
      success: false,
      message: "Description must be <= 255 characters",
    };
  }

  if (data.timestamp !== undefined) {
    const ts = new Date(data.timestamp);
    if (Number.isNaN(ts.getTime())) {
      return { success: false, message: "Invalid timestamp format" };
    }
  }

  return { success: true };
}
