import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { DistributionDTO } from "../../models/query/DistributionDTO"
import React from "react";

type EventDistributionProps = {
    data: DistributionDTO;
}

export default function EventDistribution({data}: EventDistributionProps){
    const chartData = [
        {name: 'Notifications', value: data.notifications, color: 'green'},
        {name: 'Warnings', value: data.warnings, color: 'orange'},
        {name: 'Errors', value: data.errors, color: 'red'},
    ];

    const containerStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        padding: "10px"
    };

    const headerStyle: React.CSSProperties = {
        display: "flex",
        marginBottom: "8px"
    };

    const chartContainerStyle: React.CSSProperties = {
        width: "100%",
        height: "350px",
        backgroundColor: "#2b2d31",
        borderRadius: "12px",
        padding: "15px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    };

    const legendContainerStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginTop: "20px",
        width: "75%",
        maxWidth: "300px"
    };

    const legendItemStlye: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 12px",
        backgroundColor: "#313338",
        borderRadius: "8px"
    };

    const legendLableStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    };

    const legendDotStyle = (color: string): React.CSSProperties => ({
        width: "16px",
        height: "16px",
        borderRadius: "4px",
        backgroundColor: color
    });

    const legendTextStyle: React.CSSProperties = {
        fontSize: "14px",
        color: "#ffffff",
        fontWeight: 600
    };

    const legendValueStyle: React.CSSProperties = {
        fontSize: "10px",
        color: "#c5c5c5",
        fontWeight: 700
    }

    return(
        <div style={containerStyle}>
            <div style={chartContainerStyle}>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            dataKey="value">
                                {chartData.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div style={legendContainerStyle}>
                    {chartData.map((item, index) => (
                        <div key={index} style={legendItemStlye}>
                            <div style={legendLableStyle}>
                                <div style={legendDotStyle(item.color)} />
                                <span style={legendTextStyle}>{item.name}</span>
                            </div>
                            <span style={legendValueStyle}>{item.value}%</span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}