import { AnomalyResultDTO } from "../../Domain/types/recommendationContext/AnomalyResultDTO";

export function parseAnomalyResults(raw: unknown): AnomalyResultDTO[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => ({
      title: typeof item.title === "string" ? item.title : "Unknown Anomaly",
      description: typeof item.description === "string" ? item.description : "",
      correlatedAlerts: Array.isArray(item.correlatedAlerts)
        ? item.correlatedAlerts.filter((id): id is number => typeof id === "number")
        : [],
      userId: typeof item.userId === "string" ? item.userId : null,
      userRole: typeof item.userRole === "string" ? item.userRole : null,
      createdAt: item.createdAt ? new Date(String(item.createdAt)) : new Date(),
    }));
}
