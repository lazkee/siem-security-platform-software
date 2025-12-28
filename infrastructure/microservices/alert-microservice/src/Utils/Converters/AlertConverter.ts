import { Alert } from "../../Domain/models/Alert";
import { AlertDTO } from "../../Domain/DTOs/AlertDTO";

export function toAlertDTO(alert: Alert): AlertDTO {
  return {
    id: alert.id,
    title: alert.title,
    description: alert.description,
    severity: alert.severity,
    status: alert.status,
    correlatedEvents: alert.correlatedEvents,
    source: alert.source,
    createdAt: alert.createdAt,
    resolvedAt: alert.resolvedAt,
    resolvedBy: alert.resolvedBy
  };
}

export function createEmptyAlertDTO(): AlertDTO {
  return {
    id: -1,
    title: "",
    description: "",
    severity: "LOW" as any,
    status: "ACTIVE" as any,
    correlatedEvents: [],
    source: "",
    createdAt: new Date(),
    resolvedAt: null,
    resolvedBy: null
  };
}