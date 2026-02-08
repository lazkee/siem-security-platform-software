import { useRef } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FiDownload } from "react-icons/fi";
import { EventDistributionProps } from "../../types/props/statistics/EventDistributionProps";

export default function EventDistribution({ data }: EventDistributionProps) {
  /* =======================
     DATA
     ======================= */
  const chartData = [
    { name: "Notifications", value: data.notifications, color: "#00d492" },
    { name: "Warnings", value: data.warnings, color: "#00bc7d" },
    { name: "Errors", value: data.errors, color: "#007a55" },
  ];

  /* =======================
     PDF EXPORT
     ======================= */
  const printRef = useRef<HTMLDivElement | null>(null);

  const handleDownload = async () => {
    if (!printRef.current) return;

    // Povećavamo scale na 3 za bolji kvalitet slike u PDF-u
    const canvas = await html2canvas(printRef.current, {
        scale: 3, 
        backgroundColor: "#1f2123",
    });

    const imgData = canvas.toDataURL("image/png");
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    // --- HEADER ---
    doc.setFillColor(31, 33, 35); 
    doc.rect(0, 0, pageWidth, 25, 'F');

    // LIJEVO: STATISTICS
    doc.setTextColor(156, 163, 175);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("STATISTICS", margin, 15); 

    // Linija ispod headera
    doc.setDrawColor(100, 100, 100); 
    doc.line(margin, 25, pageWidth - margin, 25);

    // --- CONTENT ---
    let cursorY = 40;

    // Naslov izvještaja
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(14);
    doc.text("Event Distribution Analysis", margin, cursorY);
    cursorY += 8;

    // Metric info (Siva boja)
    doc.setTextColor(156, 163, 175); 
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Metric: Severity Level Distribution (Notifications, Warnings, Errors)", margin, cursorY);
    cursorY += 10;

    // --- SLIKA (PIE CHART + LEGENDA) ---
    const imgProps = doc.getImageProperties(imgData);
    const pdfImgW = pageWidth - margin * 2;
    const pdfImgH = (imgProps.height * pdfImgW) / imgProps.width;
    
    // Okvir oko screenshot-a
    doc.setDrawColor(51, 51, 51);
    doc.rect(margin - 0.5, cursorY - 0.5, pdfImgW + 1, pdfImgH + 1);
    doc.addImage(imgData, "PNG", margin, cursorY, pdfImgW, pdfImgH);
    
    // --- FOOTER ---
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    const dateStr = `${new Date().toLocaleString()}`;
    doc.text(dateStr, margin, doc.internal.pageSize.getHeight() - 10);

    const randomId = Math.floor(Math.random() * 1000);
    doc.save(`event-distribution-report-${randomId}.pdf`);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1e1f22] border border-[#313338] rounded-[10px] p-3! text-white">
          <p className="m-0! text-sm font-semibold">
            {payload[0].name}
          </p>
          <p className="mt-1! text-sm text-[#4A9DAE]">
            {payload[0].value}%
          </p>
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
      {/* HEADER  */}
      <div className="flex justify-between items-center m-4!">
        <span className="text-white text-lg font-semibold">
          Event distribution
        </span>

        <button
          onClick={handleDownload}
          className="px-4! py-2! rounded-[10px]! bg-[#007a55] transition-all duration-200"
          title="Download chart"
        >
          <FiDownload size={18} />
        </button>
      </div>

      {/* INNER PANEL  */}
      <div ref={printRef}>
        <div className="flex h-[350px] items-center gap-10 p-6 pr-10!">
          {/* PIE */}
          <div className="h-full w-[55%]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip/>} />
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  labelLine={false}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* LEGEND */}
          <div className="flex w-[45%]! max-w-[380px]! flex-col gap-4">
            {chartData.map((item, index) => (
              <div
                key={index}
                className="flex items-center! justify-between! bg-[#313338] rounded-[14px] px-5! py-3!"
                style={{ lineHeight: "1.2" }}
              >
                <div className="flex items-center! gap-3">
                  <div
                    className="h-4 w-4 rounded-md"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <span className="text-base font-semibold text-white">
                      {item.name}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-semibold text-[#c5c5c5] ml-2!">
                    {item.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
