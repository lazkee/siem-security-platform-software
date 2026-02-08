import { useRef, useState } from "react";
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FiDownload } from "react-icons/fi";
import { StatisticsChartProps } from "../../types/props/statistics/StatisticsChartProps";

export default function StatisticsChart({
    eventData,
    alertData,
}: StatisticsChartProps) {
    /* =======================
       LOCAL UI STATE
       ======================= */
    const [showEvents, setShowEvents] = useState(true);
    const [showAlerts, setShowAlerts] = useState(true);

    /* =======================
       DATA NORMALIZATION
       ======================= */
    const combinedData = eventData.map((event, index) => ({
        hour: event.hour,
        events: event.count,
        alerts: alertData[index]?.count || 0,
    }));

    /* =======================
       PDF EXPORT
       ======================= */
    const printRef = useRef<HTMLDivElement | null>(null);

    const handleDownload = async () => {
        if (!printRef.current) return;

        const canvas = await html2canvas(printRef.current, {
            scale: 3, 
            backgroundColor: "#1f2123",
        });

        const imgData = canvas.toDataURL("image/png");
        const doc = new jsPDF({ unit: "mm", format: "a4" });
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;

        doc.setFillColor(31, 33, 35); 
        doc.rect(0, 0, pageWidth, 25, 'F');

        doc.setTextColor(156, 163, 175);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text("STATISTICS", margin, 15); 

        doc.setDrawColor(100, 100, 100); 
        doc.line(margin, 25, pageWidth - margin, 25);

        
        let cursorY = 40;

        doc.setTextColor(100, 100, 100);
        doc.setFontSize(14);
        doc.text("Events and Alerts Per Hour Report", margin, cursorY);
        cursorY += 8;

        doc.setTextColor(156, 163, 175); 
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Metric: Hourly Data Analysis (${showEvents ? "Events" : ""} ${showAlerts ? "Alerts" : ""})`, margin, cursorY);
        cursorY += 10;

        const imgProps = doc.getImageProperties(imgData);
        const pdfImgW = pageWidth - margin * 2;
        const pdfImgH = (imgProps.height * pdfImgW) / imgProps.width;
        
        doc.setDrawColor(51, 51, 51);
        doc.rect(margin - 0.5, cursorY - 0.5, pdfImgW + 1, pdfImgH + 1);
        doc.addImage(imgData, "PNG", margin, cursorY, pdfImgW, pdfImgH);
        
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        const dateStr = `${new Date().toLocaleString()}`;
        doc.text(dateStr, margin, doc.internal.pageSize.getHeight() - 10);

        const randomId = Math.floor(Math.random() * 1000);
        doc.save(`security-event-report-${randomId}.pdf`);
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1e1f22] border border-[#313338] rounded-[10px] p-3! text-white">
                    <p className="m-0! text-sm font-semibold">
                        Hour: {label}:00
                    </p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex justify-between gap-4 items-center mt-1!">
                            <span className="text-sm font-semibold" style={{ color: entry.color }}>
                                {entry.name}:
                            </span>
                            <span className="text-sm font-bold text-white">
                                {entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    /* =======================
       RENDER
       ======================= */
    return (
        <div>
            {/* HEADER */}
            <div className="flex justify-between items-center m-4!">
                <span className="text-white text-lg font-semibold">
                    Events per hour
                </span>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowEvents((v) => !v)}
                        className={`px-5! py-2! rounded-[10px]! text-white text-sm font-semibold transition-all duration-200 ${
                            showEvents ? "bg-[#007a55]" : "bg-[#313338]"
                        }`}
                    >
                        Events
                    </button>

                    <button
                        onClick={() => setShowAlerts((v) => !v)}
                        className={`px-5! py-2! rounded-[10px]! text-white text-sm font-semibold transition-all duration-200 ${
                            showAlerts ? "bg-[#007a55]" : "bg-[#313338]"
                        }`}
                    >
                        Alerts
                    </button>

                    <button
                        onClick={handleDownload}
                        className="px-4! py-2! rounded-[10px]! bg-[#007a55] transition-all duration-200"
                        title="Download chart"
                    >
                        <FiDownload size={18} />
                    </button>
                </div>
            </div>

            {/* INNER PANEL */}
            <div
                ref={printRef}
                className="bg-[#1f1f1f] border-2 border-[#333] rounded-[10px]! shadow-md overflow-hidden m-2!"
            >
                <div className="h-[350px] p-4!">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={combinedData} margin={{ bottom: 20, right: 30 }}>
                            <defs>
                                <linearGradient id="eventGradColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#007a55" stopOpacity={0.4} />
                                    <stop offset="75%" stopColor="#007a55" stopOpacity={0.05} />
                                </linearGradient>

                                <linearGradient id="alertGradColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4A9DAE" stopOpacity={0.4} />
                                    <stop offset="75%" stopColor="#4A9DAE" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>

                            <XAxis
                                dataKey="hour"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#ffffff", fontSize: 13, fontWeight: "bold" }}
                                tickMargin={10}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#ffffff", fontSize: 13, fontWeight: "bold" }}
                                tickMargin={10}
                            />

                            <Tooltip content={<CustomTooltip />} />

                            {showEvents && (
                                <Area
                                    type="monotone"
                                    dataKey="events"
                                    stroke="#007a55"
                                    fill="url(#eventGradColor)"
                                    strokeWidth={5}
                                    dot={false}
                                />
                            )}

                            {showAlerts && (
                                <Area
                                    type="monotone"
                                    dataKey="alerts"
                                    stroke="#4A9DAE"
                                    fill="url(#alertGradColor)"
                                    strokeWidth={5}
                                    dot={false}
                                />
                            )}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}