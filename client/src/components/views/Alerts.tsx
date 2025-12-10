/*import React from "react";
import RecentAlertsTable from "../tables/RecentAlertsTable";

interface AlertRow {
  id: string;
  time: string;
  isAlert: boolean;
}

export default function Alerts() {
  const eventDivStyle: React.CSSProperties = {
    border: "2px solid #d0d0d0",
    backgroundColor: "transparent",
    borderRadius: "14px",
    borderColor: "#d0d0d0",
  };

  //test
  const alerts: AlertRow[] = [
    { id: "12345", time: "01:23:33   22/11/2025", isAlert: true },
    { id: "77777", time: "11:11:11   11/11/2025", isAlert: false },
    { id: "99999", time: "05:55:55   20/10/2025", isAlert: true },
  ];

  return (
    <div style={eventDivStyle}>
      <h3 style={{ padding: "10px", margin: "10px" }}>Alerts</h3>

      <div style={{ margin: "10px" }}>
        <RecentAlertsTable alerts={alerts} />
      </div>
    </div>
  );
}
*/
import React, { useState } from "react";
import { AlertAPI } from "../../api/alerts/AlertAPI";
import { useAlerts } from "../../hooks/useAlerts";
import { AlertStatistics } from "../alerts/AlertStatistics";
import { AlertFilters } from "../alerts/AlertFilters";
import RecentAlertsTable from "../tables/RecentAlertsTable";
import { AlertQueryDTO } from "../../models/alerts/AlertQueryDTO";

const alertAPI = new AlertAPI();

export default function Alerts() {
  const { alerts, isLoading, searchAlerts } = useAlerts(alertAPI);
  const [] = useState<number | null>(null);

  const handleSearch = (query: AlertQueryDTO) => {
    searchAlerts(query);
  };

  const lastAlert = alerts.length > 0 ? alerts[0] : null;
  const lastAlertTime = lastAlert 
    ? new Date(lastAlert.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : "--:--";

  const containerStyle: React.CSSProperties = {
    border: "2px solid #d0d0d0",
    backgroundColor: "transparent",
    borderRadius: "14px",
    padding: "24px"
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: "24px", color: "#fff" }}>Alert Dashboard</h2>

      {/* Statistics */}
      <AlertStatistics alerts={alerts} lastAlertTime={lastAlertTime} />

      {/* Filters */}
      <AlertFilters onSearch={handleSearch} />

      {/* Loading State */}
      {isLoading && (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div className="spinner"></div>
        </div>
      )}

      {/* Alerts Table */}
      {!isLoading && (
        <RecentAlertsTable 
          alerts={alerts.map(a => ({
            id: a.id.toString(),
            time: new Date(a.createdAt).toLocaleString(),
            isAlert: a.severity === "CRITICAL" || a.severity === "HIGH"
          }))} 
        />
      )}
    </div>
  );
}