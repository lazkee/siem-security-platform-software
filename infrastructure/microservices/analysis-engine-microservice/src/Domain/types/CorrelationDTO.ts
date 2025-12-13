export interface CorrelationDTO {
    id: number;
    correlationDetected: boolean;
    description: string;
    timestamp: Date;
    confidence: number;
    severity: "CRITICAL"|"HIGH" | "MEDIUM" | "LOW";
    correlatedEventIds: number[];
}