import React from 'react';
import { TopArchiveDTO } from "../../models/storage/TopArchiveDTO";

type TopArchivesProps = {
    data: TopArchiveDTO[];
    type: "events" | "alerts";
    onTypeChange: (type: "events" | "alerts") => void;
};

export default function TopArchives( {data, type, onTypeChange}: TopArchivesProps) {
    const containerStyle: React.CSSProperties = {
        background: "#1f1f1f",
        border: "2px solid #333",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
        overflow: "hidden",
        margin:"5px"
    };

    const switchContainerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: "center",
        margin: '15px'
    };

    const switchButtonStyle = (isActive: boolean): React.CSSProperties => ({
        padding: '8px 20px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: isActive ? "#007a55" : '#313338',
        color: '#ffffff',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 600,
        transition: 'all 0.2s ease'
    });

    const tableStyle: React.CSSProperties = {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "14px"
    };

    const thStyle: React.CSSProperties = {
        textAlign: "center",
        padding: "14px 16px",
        borderBottom: "1px solid #3a3a3a",
        color: "#d0d0d0",
        fontSize: "13px",
        textTransform: "uppercase",
        letterSpacing: "0.5px"
    };

    const tdStyle: React.CSSProperties = {
        padding: "20px",
        textAlign: "center",
        color: "#a6a6a6"
    };

    const theadStyle: React.CSSProperties = {
        background: "#2a2a2a"
    };

    const emptyStateStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '32px',
        color: '#c5c5c5',
        fontSize: '14px'
    };
    
    

    return(
        <div>
            <div style={switchContainerStyle}>
                <span style={{color: "#ffffff", fontSize: "18px", fontWeight: 600}}>
                    Top 5 Archives
                </span>

                <div style={{display: "flex", gap: 8}}>
                    <button
                        style={switchButtonStyle(type === "events")}
                        onClick={() => onTypeChange("events")}>
                            Events
                    </button>
                    <button
                        style={switchButtonStyle(type === "alerts")}
                        onClick={() => onTypeChange("alerts")}>
                            Alerts
                    </button>
                </div>
            </div>
            <div style={containerStyle}>
                {data.length > 0 ? (
                    <table style={tableStyle}>
                        <thead style={theadStyle}>
                            <tr>
                                <th style={{ ...thStyle, width: '10%'}}>ID</th>
                                <th style={{ ...thStyle, width: '60%'}}>File name</th>
                                <th style={{ ...thStyle, width: '30%', textAlign: 'right'}}>
                                    {type === "events" ? "Event count" : "Alert count"}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((archive, index) => (
                                <tr key={archive.id}>
                                    <td style={tdStyle}>{index + 1}</td>
                                    <td style={tdStyle}>{archive.fileName}</td>
                                    <td style={{...tdStyle, textAlign: 'right', fontWeight: 600}}>
                                        {archive.count}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={emptyStateStyle}>
                        No archives found
                    </div>
                )}
            </div>
        </div>  
    );
}
