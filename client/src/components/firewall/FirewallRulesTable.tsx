import { useState } from "react";
import { FirewallRuleDTO } from "../../types/firewall/FirewallRuleDTO";

interface FirewallRulesTableProps {
    rules: FirewallRuleDTO[];
    deleteRule: (id: number) => Promise<void>;
}

export default function FirewallRulesTable({ rules, deleteRule }: FirewallRulesTableProps) {
    const [loadingIds, setLoadingIds] = useState<number[]>([]);

    const handleDelete = async (id: number) => {
        setLoadingIds((prev) => [...prev, id]);
        try {
            await deleteRule(id);
        } catch (err) {
            console.error("Failed to delete rule", err);
        } finally {
            setLoadingIds((prev) => prev.filter((lid) => lid !== id));
        }
    };

    return (
        <div className="bg-[#1f1f1f] rounded-[14px] shadow-md border border-[#333] w-full h-full flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#333]">
                <h3 className="text-[#d0d0d0] font-semibold text-[16px]">
                    Firewall Rules
                </h3>
            </div>

            {/* Table */}
            <div className="overflow-y-auto h-[300px]">
                <table className="w-full border-collapse text-[14px]">
                    <thead className="bg-[#2a2a2a] sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-2 text-left text-[#bdbdbd] font-semibold border-b border-[#333]">
                                IP Address
                            </th>
                            <th className="px-4 py-2 text-left text-[#bdbdbd] font-semibold border-b border-[#333]">
                                Port
                            </th>
                            <th className="px-4 py-2 border-b border-[#333]"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {rules.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-4 py-10 text-center text-[#a6a6a6]"
                                >
                                    No rules found
                                </td>
                            </tr>
                        ) : (
                            rules.map((rule) => {
                                const isLoading = loadingIds.includes(rule.id);

                                return (
                                    <tr
                                        key={rule.id}
                                        className="hover:bg-[#2d2d2d] transition-colors border-b border-[#2a2a2a]"
                                    >
                                        <td className="px-4 py-2 text-[#d0d0d0]">
                                            {rule.ipAddress}
                                        </td>

                                        <td className="px-4 py-2 text-[#d0d0d0]">
                                            {rule.port}
                                        </td>

                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleDelete(rule.id)}
                                                disabled={isLoading}
                                                className={`w-full h-[32px] rounded-[10px] font-semibold text-white transition-colors ${isLoading
                                                    ? "bg-[#313338] cursor-not-allowed"
                                                    : "bg-[#313338] hover:bg-[#404249]"
                                                    }`}
                                            >
                                                {isLoading ? "Deleting..." : "Delete"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}