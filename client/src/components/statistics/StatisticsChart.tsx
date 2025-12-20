import React, { useRef, useState } from "react";
import { AlertStatisticsDTO } from "../../models/query/AlertStatisticsDTO";
import { EventStatisticsDTO } from "../../models/query/EventStatisticsDTO"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type StatisticsChartProps = {
    eventData: EventStatisticsDTO[];
    alertData: AlertStatisticsDTO[];
}

export default function StatisticsChart({eventData, alertData}: StatisticsChartProps) {
    const [showEvents, setShowEvents] = useState(true);
    const [showAlerts, setShowAlerts] = useState(true);

    const combinedData = eventData.map((event, index) => ({
        date: event.date,
        events: event.count,
        alerts: alertData[index]?.count || 0,
    }));

    const containerStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        padding: "16px"
    };

    const headerStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px"
    };

    const chartContainerStyle: React.CSSProperties = {
        width: "100%",
        height: "400px",
        backgroundColor: "#2b2d31",
        borderRadius: "12px",
        padding: "20px"
    };

    const printRef = useRef<HTMLDivElement | null>(null);

    const handleDownload = async () => {
        try{
            if(!printRef.current){
                return;
            }

            const bg = window.getComputedStyle(printRef.current).backgroundColor || "#ffffff";
            const canvas = await html2canvas(printRef.current, {scale: 2, backgroundColor: bg});
            const imgData = canvas.toDataURL("image/png");

            // graf
            const doc = new jsPDF({unit: "mm", format: "a4", compress: true});
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 10;
            let cursorY = margin;

            doc.setFontSize(14);
            doc.text("Events per day", margin, cursorY + 6);
            cursorY += 10;

            const imgProps = (doc as any).getImageProperties(imgData);
            const pdfImgW = pageWidth - margin * 2;
            const pdfImgH = (imgProps.height * pdfImgW) / imgProps.width;

            if(cursorY + pdfImgH > pageHeight - margin){
                doc.addPage();
                cursorY = margin;
            }
            doc.addImage(imgData, "PNG", margin, cursorY, pdfImgW, pdfImgH);
            cursorY += pdfImgH + 6;

            // data
            doc.setFontSize(10);
            doc.text("Data (date - events / alerts):", margin, cursorY + 4);
            cursorY += 6;

            doc.setFontSize(9);
            const lineHeight = 5;
            const dataToPrint = combinedData;

            for(const row of dataToPrint){
                if(cursorY + lineHeight > pageHeight - margin){
                    doc.addPage();
                    cursorY = margin;
                }

                const line = `${row.date} - events: ${row.events} / alerts: ${row.alerts}`;
                doc.text(line, margin + 4, cursorY + 4);
                cursorY += lineHeight;
            }

            doc.save("statistics-chart.pdf");
        } catch(err){
            console.error("PDF generation failed", err);
        }
    }

    return(
        <div style={containerStyle}>
            <div style={headerStyle}>
                <span style={{color: "#c5c5c5", fontSize: "14px", fontWeight: 600}}>
                    Events per day
                </span>

                <div style={{display: "flex", gap: 8}}>
                    <button
                        onClick={() => setShowEvents(!showEvents)}
                        style={{
                            padding: "6px 10px",
                            borderRadius: 8,
                            border: "none",
                            background: showEvents ? "#0078d4" : "#313338",
                            color: "#ffffff",
                            cursor: "pointer"
                        }}> Events</button>
    
                    <button
                        onClick={() => setShowAlerts(!showAlerts)}
                        style={{
                            padding: "6px 10px",
                            borderRadius: 8,
                            border: "none",
                            background: showAlerts ? "#0078d4" : "#313338",
                            color: "#ffffff",
                            cursor: "pointer"
                        }}> Alerts</button>

                    <button
                        onClick={handleDownload}
                        style={{
                            padding: "6px 10px",
                            borderRadius: 8,
                            border: "none",
                            background: "#0078d4",
                            color: "#ffffff",
                            cursor: "pointer" 
                        }}
                        title="Download chart as pdf">
                        Download PDF
                    </button>
                </div>
            </div>

            <div ref={printRef} style={chartContainerStyle}>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart
                        data={combinedData}>

                            <CartesianGrid strokeDasharray="3 3" stroke="#313338"/>
                            <XAxis dataKey="date" stroke="#c5c5c5" style={{fontSize: "12px"}} axisLine={false}/>
                            <YAxis stroke="#c5c5c5" style={{fontSize: "12px"}} axisLine={false}/>

                            {showEvents && (
                                <Line
                                    type="monotone"
                                    dataKey="events"
                                    stroke="#8b0000"
                                />
                            )}
                            {showAlerts && (
                                <Line
                                    type="monotone"
                                    dataKey="alerts"
                                    stroke="#6e008a"
                                />
                            )}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}