import React from "react";
import { PiWarningOctagonFill, PiInfoBold } from "react-icons/pi";
import { BiMessageRounded } from "react-icons/bi";

interface AlertRow {
  id: string;
  time: string;
  isAlert: boolean;
}


//pomerice se styles u css fajl na kraju
export default function RecentAlertsTable({ alerts }: { alerts: AlertRow[] }) {
  const containerStyle: React.CSSProperties = {
    background: "#1f1f1f",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
    marginTop: "12px",
    border: "1px solid #333",
    margin: "10px",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: "Segoe UI, sans-serif",
    fontSize: "14px",
  };

  const theadStyle: React.CSSProperties = {
    background: "#2a2a2a",
  };

  const thStyle: React.CSSProperties = {
    padding: "12px 16px",
    textAlign: "left",
    color: "#d0d0d0",
    fontWeight: 600,
    fontSize: "14px",
    borderBottom: "1px solid #3a3a3a",
  };

  const tdStyle: React.CSSProperties = {
    padding: "12px 16px",
    borderBottom: "1px solid #2d2d2d",
    color: "#dcdcdc",
  };

  const eventIdStyle: React.CSSProperties = {
    ...tdStyle,
    fontFamily: "Consolas, 'Courier New', monospace",
    fontSize: "13px",
    color: "#b5b5b5",
  };

  const badgeBase: React.CSSProperties = {
    padding: "5px 10px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: 600,
  };

  const yesBadge: React.CSSProperties = {
    ...badgeBase,
    background: "rgba(239, 68, 68, 0.15)",
    color: "#f87171",
    border: "1px solid rgba(239, 68, 68, 0.3)",
  };

  const noBadge: React.CSSProperties = {
    ...badgeBase,
    background: "rgba(59, 130, 246, 0.15)",
    color: "#60a5fa",
    border: "1px solid rgba(59, 130, 246, 0.3)",
  };

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thStyle}></th>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Time</th>
            <th style={thStyle}>IS ALERT</th>
            <th style={thStyle}>Details</th>
          </tr>
        </thead>

        <tbody>
          {alerts.map((a, index) => (
            <tr key={index}>
              <td style={tdStyle}>
                {a.isAlert ? (
                  <PiWarningOctagonFill color="#f87171" size={20} />
                ) : (
                  <BiMessageRounded size={20} />
                )}
              </td>

              <td style={eventIdStyle}>{a.id}</td>
              <td style={tdStyle}>{a.time}</td>

              <td style={tdStyle}>
                <span style={a.isAlert ? yesBadge : noBadge}>
                  {a.isAlert ? "YES" : "NO"}
                </span>
              </td>

              <td style={{ ...tdStyle, textAlign: "center" }}>
                <PiInfoBold size={18} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
