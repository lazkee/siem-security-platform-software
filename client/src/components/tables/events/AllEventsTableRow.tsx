import { useState } from "react";
import React from "react";
import { EventTableRowProps } from "../../../types/props/events/EventTableRowProps";
import { badgeClasses } from "../../../constants/badgeClasses";
import { PiInfoBold } from "react-icons/pi";
import EventDetailsPanel from "../../events/EventDetailsPanel";

export default function EventTableRow({ e,index, parserApi,onSelect }: EventTableRowProps) {
    const [openDialog, setOpenDialog] = useState(false);
  
    return (
        <React.Fragment>
            <tr className="transition-colors duration-200 cursor-pointer hover:bg-[#2a2a2a]">
                <td className="px-4! py-3! text-center border-b border-[#2d2d2d] text-[#dcdcdc] font-mono text-[14px]">{e.source}</td>
                <td className="px-4! py-3! text-center border-b border-[#2d2d2d] text-[#dcdcdc] font-mono text-[14px]">{new Date(e.time).toLocaleString("en-GB")}</td>
                <td className="px-4! py-3! text-center border-b border-[#2d2d2d] text-[#dcdcdc] font-mono text-[14px]">
                    <span className={`px-2.5! py-1! rounded-[10px] text-[14px] font-semibold ${badgeClasses[e.type]}`}>
                        {e.type}
                    </span>
                </td>
                <td className="px-4! py-3! border-b border-[#2d2d2d] text-[#dcdcdc] text-center">
                    <button
                        onClick={() =>onSelect()}
                        className="bg-transparent border! border-blue-400 text-blue-400 px-3! py-1.5! rounded-[6px]! cursor-pointer text-[12px]! font-semibold transition-all duration-200"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#60a5fa22";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                        }}
                    >
                        <PiInfoBold size={14} className="mr-1 align-middle" />
                        Details
                    </button>
                </td>
            </tr>
            {/* Expanded details row 
            <ExpandedRow expanded={rotateArrow === index} e={e} parserApi={parserApi} />*/}
        
        </React.Fragment>
    );
}