import React from "react";
import { ArchiveVolumeDTO } from "../../models/storage/ArchiveVolumeDTO";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type ArchiveVolumeProps = {
    data: ArchiveVolumeDTO[];
    period: "daily" | "monthly" | "yearly";
    onPeriodChange: (period: "daily" | "monthly" | "yearly") => void;
};

export default function ArchiveVolume({ data, period, onPeriodChange }: ArchiveVolumeProps){
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
        padding: '16px'
    };
    
    const switchContainerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: "center"
    };

    const switchButtonStyle = (isActive: boolean): React.CSSProperties => ({
        padding: '8px 20px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: isActive ? '#007a55' : '#313338',
        color: '#ffffff',
        cursor: 'pointer',
        fontWeight: 600,
        transition: 'all 0.2s ease'
    });

    const chartContainerStyle: React.CSSProperties = {
        width: '100%',
        height: '350px',
        borderRadius: '12px',
        padding: '20px'
    };

    const emptyStateStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '32px',
        color: '#c5c5c5',
        fontSize: '14px'
    };
    
    const CustomTooltip = ({active, payload}: any) => {
        if(active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: '#1e1f22',
                    border: '1px solid #313338',
                    borderRadius: '8px',
                    padding: '12px',
                    color: '#ffffff'
                }}>
                    <p style={{margin: 0, fontSize: '14px', fontWeight: 600}}>
                        {payload[0].payload.label}
                    </p>
                    <p style={{margin: '4px 0 0 0', fontSize: '14px', fontWeight: '#4A9DAE'}}>
                        {payload[0].value} MB
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={containerStyle}>
                <div style={switchContainerStyle}>
                    <span style={{color: "#ffffff", fontSize: "18px", fontWeight: 600}}>
                        Daily Archive Volume (in MB)
                    </span>

                    <div style={{display: "flex", gap: 8}}>
                        <button
                            style={switchButtonStyle(period === "daily")}
                            onClick={() => onPeriodChange("daily")}>
                                Daily
                        </button>
                        <button
                            style={switchButtonStyle(period === "monthly")}
                            onClick={() => onPeriodChange("monthly")}>
                                Monthly
                        </button>
                        <button
                            style={switchButtonStyle(period === "yearly")}
                            onClick={() => onPeriodChange("yearly")}>
                                Yearly
                        </button>
                    </div>
            </div>

            {data.length > 0 ? (
                <div style={chartContainerStyle}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0}}>

                            <XAxis dataKey="label" style={{fontSize: "13px", fontWeight: "bold"}} axisLine={false} tickLine={false} tick={{fill: "#ffffff"}} tickMargin={10} />
                            <YAxis style={{fontSize: "13px", fontWeight: "bold"}} axisLine={false} tickLine={false} tickCount={5} tick={{fill: "#ffffff"}} tickMargin={10} />
                            
                            <Tooltip content={<CustomTooltip/>} cursor={{fill: 'rgba(34, 210, 99, 0.1)'}}/>
                            <Bar
                                dataKey="size"
                                fill="#007a55"
                                radius={[8, 8, 0, 0]}
                                maxBarSize={80}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div style={emptyStateStyle}>
                    No archive volume data available
                </div>
            )}
        </div>
    );
}