import { FiDownload } from "react-icons/fi";
import DropDownMenu from "./DropDownMenu";

export function SecondEventToolBar({ onSortType, dateFrom, dateTo, eventType }: any) {

    const handleDownloadPdf = () => {
        const baseUrl = "http://localhost:5790/api/v1/query/pdfReport";
        
        const dFrom = dateFrom ? new Date(dateFrom).toISOString() : "";
        const dTo = dateTo ? new Date(dateTo).toISOString() : "";

        const url = `${baseUrl}?dateFrom=${encodeURIComponent(dFrom)}&dateTo=${encodeURIComponent(dTo)}&eventType=${encodeURIComponent(eventType || 'all')}`;

        window.open(url, '_blank');
    };

    return (
        <div className="flex justify-end items-center mt-4! me-[10px]!">
            <div className="flex gap-[16px] items-center">
                <DropDownMenu OnSortTypeChange={(value: number) => onSortType(value)} sortName1="Source" sortName2="Date and Time" sortName3="Type" />
                <button 
                    onClick={handleDownloadPdf}
                    className="bg-[#007a55] text-white w-[200px] h-[40px] rounded-[10px]! font-semibold flex items-center justify-center gap-2 hover:bg-[#009166]"
                >
                    Download report <FiDownload size={20} />
                </button>
            </div>
        </div>
    );
}