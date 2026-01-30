import { DetectionResult } from "../types/DetectionResult";

export interface IThreatDetectionService {
  analyzeEvents(userId: string, eventIds: number[]): Promise<DetectionResult[]>;
  detectMassDataRead(userId: string, eventIds: number[]): Promise<DetectionResult | null>;
  detectPermissionChange(userId: string, eventIds: number[]): Promise<DetectionResult | null>;
  detectOffHoursAccess(userId: string, eventIds: number[]): Promise<DetectionResult | null>;
  correlateWithAuthEvents(userId: string, eventIds: number[]): Promise<DetectionResult[]>;
}