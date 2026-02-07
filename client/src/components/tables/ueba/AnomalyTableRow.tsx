import { AnomalyResultDTO } from "../../../types/ueba/AnomalyResultDTO";
import { MdKeyboardArrowRight } from "react-icons/md";

interface AnomalyTableRowProps {
  anomaly: AnomalyResultDTO;
  index: number;
  onSelect: (anomaly: AnomalyResultDTO) => void;
}

export default function AnomalyTableRow({ anomaly, index, onSelect }: AnomalyTableRowProps) {
  const rowBg = index % 2 === 0 ? "bg-[#1a1a1a]" : "bg-[#222222]";

  return (
    <tr className={`${rowBg} hover:bg-[#2d2d2d] transition-colors cursor-pointer`}>
      <td className="px-4! py-3! text-center border-b border-[#2d2d2d]">
        <span className="text-white font-medium text-[13px]">{anomaly.title}</span>
      </td>

      <td className="px-4! py-3! text-center border-b border-[#2d2d2d]">
        <span className="text-[#b0b0b0] text-[12px]">
          {anomaly.userId ? `User ${anomaly.userId}` : anomaly.userRole || "N/A"}
        </span>
      </td>

      <td className="px-4! py-3! text-center border-b border-[#2d2d2d]">
        <span className="text-[#60cdff] text-[13px] font-semibold">
          {anomaly.correlatedAlerts.length}
        </span>
      </td>

      <td className="px-4! py-3! text-center border-b border-[#2d2d2d]">
        {anomaly.createdAt ? (
          <span className="text-[#b0b0b0] text-[12px]">
            {new Date(anomaly.createdAt).toLocaleDateString()} {new Date(anomaly.createdAt).toLocaleTimeString()}
          </span>
        ) : (
          <span className="text-[#666] text-[12px]">-</span>
        )}
      </td>

      <td className="px-4! py-3! text-center border-b border-[#2d2d2d]">
        <button
          onClick={() => onSelect(anomaly)}
          className="text-[#60cdff] hover:text-[#80ddff] transition-colors"
        >
          <MdKeyboardArrowRight size={20} />
        </button>
      </td>
    </tr>
  );
}
