import React from "react";
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
