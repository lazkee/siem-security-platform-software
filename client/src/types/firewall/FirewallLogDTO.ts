export interface FirewallLogDTO {
    id: number;
    sourceIp: string;
    destinationIp: string;
    port: number;
    action: "ALLOWED" | "BLOCKED";
    timestamp: string;
}