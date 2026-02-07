import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuthHook";
import { IIntegrityAPI } from "../../api/integrity/IIntegrityAPI";
import { IntegrityStatusDTO } from "../../models/integrity/IntegrityStatusDTO";
import IntegrityStatusCard from "../integrity/IntegrityStatusCard";

interface IntegrityProps {
    integrityApi: IIntegrityAPI;
    queryApi: any;
}

export default function Integrity({ integrityApi, queryApi }: IntegrityProps) {
    const { token: authToken } = useAuth();

    const [status, setStatus] = useState<IntegrityStatusDTO | null>(null);
    const [compromisedLogs, setCompromisedLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [allEvents, setAllEvents] = useState<any[]>([]);
    const [showOnlyErrors, setShowOnlyErrors] = useState<boolean>(false);

    const handleRunAudit = async () => {
        if (!authToken) return;

        try {
            setIsLoading(true);
            setCompromisedLogs([]);
            setAllEvents([]);

            const rawRes: any = await integrityApi.verifyLogs(authToken);
            const res = rawRes.response || rawRes; 

            try {
                const eventsRes = await queryApi.getEventsByQuery("", authToken, 1, 2000);
                if (eventsRes && eventsRes.data) {
                    const sortedData = [...eventsRes.data].sort((a, b) => Number(b.id) - Number(a.id));
                    setAllEvents(sortedData);
                }
            } catch (e) {
                console.error("Greška pri učitavanju tabele:", e);
            }

            setStatus({
                isChainValid: res.isChainValid,
                totalLogsChecked: res.totalLogsChecked || 0,
                lastChecked: new Date(),
                compromisedSegmentsCount: res.isChainValid ? 0 : (res.compromisedSegmentsCount || 0)
            });

            if (res.isChainValid === false) {
                const realCompromisedRaw: any = await integrityApi.getCompromisedLogs(authToken);
                const logs = Array.isArray(realCompromisedRaw) 
                    ? realCompromisedRaw 
                    : (realCompromisedRaw.response || []);
                setCompromisedLogs(logs);
            }

        } catch (err) {
            console.error("Audit neuspešan:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (authToken) {
            void handleRunAudit();
        }
    }, [authToken]); 

    const isRowCompromised = (ev: any) => {
        return compromisedLogs.some(log => {
            const badId = log?.event?.id || log?.id || log;
            return String(badId) === String(ev.id);
        });
    };

    const displayedEvents = [...allEvents]
        .sort((a, b) => {
            const aComp = isRowCompromised(a);
            const bComp = isRowCompromised(b);
            
            if (aComp && !bComp) return -1;
            if (!aComp && bComp) return 1;
            
            return Number(b.id) - Number(a.id);
        })
        .filter(ev => showOnlyErrors ? isRowCompromised(ev) : true);

    return (
        <div className="bg-transparent border-2 border-solid rounded-[14px] border-[#282A28] overflow-hidden p-4 font-sans text-white">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold tracking-tight">Blockchain Integrity Control</h2>
                
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm transition-all
                    ${status?.isChainValid !== false ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
                    <div className={`w-2 h-2 rounded-full ${isLoading ? "bg-yellow-400 animate-pulse" : status?.isChainValid !== false ? "bg-green-500" : "bg-red-500"}`}></div>
                    {isLoading ? "Running Audit..." : status?.isChainValid !== false ? "System Secure" : "Integrity Breach"}
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <IntegrityStatusCard status={status} onVerify={handleRunAudit} loading={isLoading} />

                <div className="bg-[#0a0a0a] border border-[#222] rounded-xl shadow-2xl overflow-hidden">
                    <div className="bg-[#111] p-3 border-b border-[#222] flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">Live Database Feed</span>
                            <button 
                                onClick={() => setShowOnlyErrors(!showOnlyErrors)}
                                className={`text-[9px] px-3 py-1 rounded border font-bold transition-all ${showOnlyErrors ? 'bg-red-500 border-red-600 text-white' : 'bg-transparent border-gray-600 text-gray-400 hover:border-white'}`}
                            >
                                {showOnlyErrors ? "Showing Only Breaches" : "Filter Breaches"}
                            </button>
                        </div>
                        <span className="text-[10px] text-blue-400 font-mono italic">Syncing {allEvents.length} records...</span>
                    </div>

                    <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left text-[12px] font-mono border-collapse">
                            <thead className="sticky top-0 bg-[#111] text-gray-300 z-50 border-b border-[#333]">
                                <tr>
                                    <th className="p-4 w-24 text-blue-400">ID</th>
                                    <th className="p-4">Timestamp</th>
                                    <th className="p-4 text-center">Type</th>
                                    <th className="p-4 text-center">Integrity</th>
                                    <th className="p-4">Digital Signature</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1a1a1a]">
                                {displayedEvents.map((ev, i) => {
                                    const compromised = isRowCompromised(ev);
                                    return (
                                        <tr key={ev.id || i} className={`transition-all duration-300 ${compromised ? "bg-red-900/40 hover:bg-red-900/50" : "hover:bg-white/5"}`}>
                                            <td className={`p-4 font-bold ${compromised ? "text-red-400 text-base" : "text-white"}`}>
                                                #{ev.id} {compromised && "⚠️"}
                                            </td>
                                            <td className="p-4 text-gray-400 text-[11px]">
                                                {ev.timestamp ? new Date(ev.timestamp).toLocaleString('sr-RS') : "---"}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${compromised ? "border-red-500/50 text-red-400" : "border-gray-700 text-gray-400"}`}>
                                                    {ev.eventType || "LOG"}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center font-black text-[10px]">
                                                {compromised ? (
                                                    <span className="text-red-500 animate-pulse tracking-tighter">● CORRUPTED</span>
                                                ) : (
                                                    <span className="text-green-500 opacity-60">● VERIFIED</span>
                                                )}
                                            </td>
                                            <td className={`p-4 text-[10px] font-mono truncate max-w-[200px] ${compromised ? "text-red-300" : "text-gray-600"}`}>
                                                {ev.hash || "0x00000000000"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        
                        {displayedEvents.length === 0 && !isLoading && (
                            <div className="p-20 text-center text-gray-600 font-mono text-sm uppercase tracking-widest">
                                No database records found in current range.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}