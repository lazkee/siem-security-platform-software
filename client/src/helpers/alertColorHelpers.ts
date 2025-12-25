import { AlertSeverity } from "../enums/AlertSeverity";
import { AlertStatus } from "../enums/AlertStatus";

export const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
        case AlertSeverity.CRITICAL: return "#ff4b4b";
        case AlertSeverity.HIGH: return "#ffa500";
        case AlertSeverity.MEDIUM: return "#ffd700";
        case AlertSeverity.LOW: return "#4ade80";
        default: return "#60a5fa";
    }
};

export const getStatusColor = (status: AlertStatus) => {
    switch (status) {
        case AlertStatus.ACTIVE: return "#ffa500";
        case AlertStatus.INVESTIGATING: return "#60a5fa";
        case AlertStatus.RESOLVED: return "#4ade80";
        case AlertStatus.DISMISSED: return "#a6a6a6";
        case AlertStatus.ESCALATED: return "#ff4b4b";
        default: return "#60a5fa";
    }
};
