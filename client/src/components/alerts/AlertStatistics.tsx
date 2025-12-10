import React from "react";
import { AlertDTO } from "../../models/alerts/AlertDTO";
import { AlertStatus } from "../../enums/AlertStatus";
import { AlertSeverity } from "../../enums/AlertSeverity";

interface AlertStatisticsProps {
  alerts: AlertDTO[];
  lastAlertTime: string;
}

export const AlertStatistics: React.FC<AlertStatisticsProps> = ({ alerts, lastAlertTime }) => {
  const totalAlerts = alerts.length;
  const criticalAlerts = alerts.filter(a => a.severity === AlertSeverity.CRITICAL).length;
  const activeAlerts = alerts.filter(a => a.status === AlertStatus.ACTIVE).length;
  const resolvedAlerts = alerts.filter(a => a.status === AlertStatus.RESOLVED).length;

  const cardStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)"
  };

  const statStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: 700,
    color: "#60cdff"
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#a6a6a6",
    marginTop: "4px"
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "24px" }}>
      {/* Total Alerts */}
      <div style={cardStyle}>
        <div style={statStyle}>{totalAlerts}</div>
        <div style={labelStyle}>Total Alerts</div>
      </div>

      {/* Critical */}
      <div style={cardStyle}>
        <div style={{ ...statStyle, color: "#ff4b4b" }}>{criticalAlerts}</div>
        <div style={labelStyle}>Critical</div>
      </div>

      {/* Active */}
      <div style={cardStyle}>
        <div style={{ ...statStyle, color: "#ffa500" }}>{activeAlerts}</div>
        <div style={labelStyle}>Active</div>
      </div>

      {/* Resolved */}
      <div style={cardStyle}>
        <div style={{ ...statStyle, color: "#4ade80" }}>{resolvedAlerts}</div>
        <div style={labelStyle}>Resolved</div>
      </div>

      {/* Last Alert */}
      <div style={cardStyle}>
        <div style={{ ...statStyle, fontSize: "20px" }}>{lastAlertTime}</div>
        <div style={labelStyle}>Last Alert</div>
      </div>
    </div>
  );
};