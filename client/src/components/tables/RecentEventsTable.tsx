import { EventRow } from "../../types/events/EventRow";

export default function RecentEventsTable({ events }: { events: EventRow[] }) {

    const badgeClasses: Record<string, string> = {
        INFO: "bg-[rgba(59,130,246,0.15)] text-[#60a5fa] border border-[rgba(59,130,246,0.3)]",
        WARNING: "bg-[rgba(234,179,8,0.15)] text-[#facc15] border border-[rgba(234,179,8,0.3)]",
        ERROR: "bg-[rgba(239,68,68,0.15)] text-[#f87171] border border-[rgba(239,68,68,0.3)]",
    };

    return (
        <div className="bg-[#1f1f1f] rounded-[14px] overflow-hidden shadow-lg border border-[#333] m-2.5! mt-3!">
            <table className="w-full border-collapse font-sans text-sm">
                <thead className="bg-[#2a2a2a]">
                    <tr>
                        <th className="px-4! py-3! text-left text-[#d0d0d0] font-semibold text-sm border-b border-[#3a3a3a]">Source</th>
                        <th className="px-4! text-left text-[#d0d0d0] font-semibold text-sm border-b border-[#3a3a3a]">Time</th>
                        <th className="px-4! text-left text-[#d0d0d0] font-semibold text-sm border-b border-[#3a3a3a]">Type</th>
                    </tr>
                </thead>

                <tbody>
                    {events.map((e, index) => (
                        <tr key={index}>
                            <td className="px-4! py-3! border-b border-[#2d2d2d] text-[#dcdcdc] font-mono text-[15px]">{e.source}</td>
                            <td className="px-4! py-3! border-b border-[#2d2d2d] text-[#dcdcdc]">{e.time}</td>
                            <td className="px-4! py-3! border-b border-[#2d2d2d] text-[#dcdcdc]">
                                <span className={`px-2.5! py-1! rounded-[10px] text-[12px] font-semibold ${badgeClasses[e.type]}`}>
                                    {e.type}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
