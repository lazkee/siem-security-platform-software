import { ValidationResult } from "../../Domain/types/ValidationResult";
import { CreateAlertDTO } from "../../Domain/DTOs/CreateAlertDTO";
import { AlertSeverity } from "../../Domain/enums/AlertSeverity";
import { AlertStatus } from "../../Domain/enums/AlertStatus";

export function validateAlertId(id: number): ValidationResult {
  if (!Number.isInteger(id) || id <= 0) {
    return { success: false, message: "Alert ID must be a positive integer!" };
  }
  return { success: true };
}

export function validateCreateAlertDTO(data: CreateAlertDTO): ValidationResult {
  if (!data.title || typeof data.title !== "string" || data.title.trim().length === 0) {
    return { success: false, message: "Invalid input: 'title' must be a non-empty string!" };
  }

  if (data.title.length > 255) {
    return { success: false, message: "Title exceeds maximum allowed length (255 chars)!" };
  }

  if (!data.description || typeof data.description !== "string" || data.description.trim().length === 0) {
    return { success: false, message: "Invalid input: 'description' must be a non-empty string!" };
  }

  if (!data.severity || !Object.values(AlertSeverity).includes(data.severity)) {
    return { success: false, message: "Invalid severity value!" };
  }

  if (!Array.isArray(data.correlatedEvents)) {
    return { success: false, message: "Invalid input: 'correlatedEvents' must be an array!" };
  }

  if (!data.source || typeof data.source !== "string" || data.source.trim().length === 0) {
    return { success: false, message: "Invalid input: 'source' must be a non-empty string!" };
  }

  return { success: true };
}

export function validateAlertStatus(status: string): ValidationResult {
  if (!status || !Object.values(AlertStatus).includes(status as AlertStatus)) {
    return { success: false, message: "Invalid status value!" };
  }
  return { success: true };
}

export function validateAlertSeverity(severity: string): ValidationResult {
  if (!severity || !Object.values(AlertSeverity).includes(severity as AlertSeverity)) {
    return { success: false, message: "Invalid severity value!" };
  }
  return { success: true };
}