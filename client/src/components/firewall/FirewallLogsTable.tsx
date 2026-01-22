import { FirewallLogDTO } from "../../types/firewall/FirewallLogDTO";

interface FirewallLogsTableProps {
    logs: FirewallLogDTO[];
}

export default function FirewallLogsTable({ logs }: FirewallLogsTableProps) {
    return (
        <div className="bg-[#1f1f1f] rounded-[14px] shadow-md border border-[#333] w-full flex flex-col h-full">
            <div className="px-4 py-3 border-b border-[#333]">
                <h3 className="text-[#d0d0d0] font-semibold text-[16px]">
                    Firewall Logs
                </h3>
            </div>

            <div className="overflow-y-auto h-[360px]">
                <table className="w-full border-collapse text-[14px]">
                    <thead className="bg-[#2a2a2a] sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-2 text-left text-[#bdbdbd] font-semibold border-b border-[#333]">
                                IP Address
                            </th>
                            <th className="px-4 py-2 text-left text-[#bdbdbd] font-semibold border-b border-[#333]">
                                Port
                            </th>
                            <th className="px-4 py-2 text-left text-[#bdbdbd] font-semibold border-b border-[#333]">
                                Decision
                            </th>
                            <th className="px-4 py-2 text-left text-[#bdbdbd] font-semibold border-b border-[#333]">
                                Mode
                            </th>
                            <th className="px-4 py-2 text-left text-[#bdbdbd] font-semibold border-b border-[#333]">
                                Timestamp
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {logs.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-10 text-center text-[#a6a6a6]"
                                >
                                    No logs found
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr
                                    key={log.id}
                                    className="hover:bg-[#2d2d2d] transition-colors border-b border-[#2a2a2a]"
                                >
                                    <td className="px-4 py-2 text-[#d0d0d0]">
                                        {log.ipAddress}
                                    </td>

                                    <td className="px-4 py-2 text-[#d0d0d0]">
                                        {log.port}
                                    </td>

                                    <td className="px-4 py-2">
                                        <span
                                            className={`px-2 py-1 rounded-[8px] text-[12px] font-semibold ${log.decision === "ALLOWED"
                                                ? "bg-[rgba(74,222,128,0.15)] text-[#4ade80]"
                                                : "bg-[rgba(239,68,68,0.15)] text-[#f87171]"
                                                }`}
                                        >
                                            {log.decision}
                                        </span>
                                    </td>

                                    <td className="px-4 py-2">
                                        <span className="px-2 py-1 rounded-[8px] text-[12px] font-semibold bg-[#313338] text-[#d0d0d0]">
                                            {log.mode}
                                        </span>
                                    </td>

                                    <td className="px-4 py-2 text-[#b0b0b0] whitespace-nowrap">
                                        {log.createdAt
                                            ? new Date(log.createdAt).toLocaleString()
                                            : "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}