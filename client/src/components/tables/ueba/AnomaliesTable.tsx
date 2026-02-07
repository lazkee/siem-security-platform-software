import { useState } from "react";
import { AnomalyResultDTO } from "../../../types/ueba/AnomalyResultDTO";
import AnomalyTableRow from "./AnomalyTableRow";

interface AnomaliesTableProps {
  anomalies: AnomalyResultDTO[];
}

export default function AnomaliesTable({ anomalies }: AnomaliesTableProps) {
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyResultDTO | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSelectAnomaly = (anomaly: AnomalyResultDTO) => {
    setSelectedAnomaly(anomaly);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setSelectedAnomaly(null);
  };

  return (
    <div className="bg-[#1f1f1f] rounded-[14px] mt-4! overflow-hidden shadow-md border border-[#333]">
      <table className="w-full border-collapse font-sans text-[14px]!">
        <thead className="bg-[#2a2a2a]">
          <tr>
            <th className="px-4! py-3! text-center text-[#d0d0d0] font-semibold text-[13px] border-b border-[#3a3a3a] uppercase tracking-[0.5px]">
              Title
            </th>
            <th className="px-4! py-3! text-center text-[#d0d0d0] font-semibold text-[13px] border-b border-[#3a3a3a] uppercase tracking-[0.5px]">
              User/Role
            </th>
            <th className="px-4! py-3! text-center text-[#d0d0d0] font-semibold text-[13px] border-b border-[#3a3a3a] uppercase tracking-[0.5px]">
              Alerts
            </th>
            <th className="px-4! py-3! text-center text-[#d0d0d0] font-semibold text-[13px] border-b border-[#3a3a3a] uppercase tracking-[0.5px]">
              Detected
            </th>
            <th className="px-4! py-3! text-center text-[#d0d0d0] font-semibold text-[13px] border-b border-[#3a3a3a] uppercase tracking-[0.5px]">
            </th>
          </tr>
        </thead>

        <tbody>
          {anomalies.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-10 py-10 text-center border-b border-[#2d2d2d] text-[#a6a6a6]"
              >
                No anomalies found
              </td>
            </tr>
          ) : (
            anomalies.map((anomaly, index) => (
              <AnomalyTableRow
                key={anomaly.id || index}
                anomaly={anomaly}
                index={index}
                onSelect={handleSelectAnomaly}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
