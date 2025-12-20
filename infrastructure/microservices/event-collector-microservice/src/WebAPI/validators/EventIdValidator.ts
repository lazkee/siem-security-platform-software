import { ValidationResult } from "../../Domain/types/ValidationResult";

export function validateEventId(id: number): ValidationResult {
  if (!Number.isInteger(id) || id <= 0) {
    return { success: false, message: "Invalid event id" };
  }
  return { success: true };
}

export function validateEventsIdRange(fromId: number, toId: number): ValidationResult {
  if (Number.isNaN(fromId)) {
    return { success: false, message: "Invalid starting id" };
  }

  if (Number.isNaN(toId)) {
    return { success: false, message: "Invalid ending id" };
  }

  if (fromId > toId) {
    return { success: false, message: "From id should be lesser than to id value" };
  }
  return { success: true };
};

export function validateEventIdArray(ids: unknown): ValidationResult {
  if (!Array.isArray(ids)) {
    return { success: false, message: "Body must be an array" };
  }

  if (ids.length === 0) {
    return { success: false, message: "Array cannot be empty" };
  }

  if (ids.some(id => !Number.isInteger(id) || id <= 0)) {
    return { success: false, message: "All ids must be positive integers" };
  }

  return { success: true };
}