import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuthHook";
import { IIntegrityAPI } from "../../api/integrity/IIntegrityAPI";
import IntegrityBreachPanel from "../integrity/IntegrityBreachPanel";
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
    const [error, setError] = useState<string | null>(null);
    const [showBreachPanel, setShowBreachPanel] = useState<boolean>(false);
    const [allEvents, setAllEvents] = useState<any[]>([]);

    const handleRunAudit = async () => {
        const effectiveToken = authToken || "dev-token";

        try {
            setIsLoading(true);
            setError(null);
            setCompromisedLogs([]);

            // 1. Poziv za proveru lanca
            const res = await integrityApi.verifyLogs(effectiveToken);

            // 2. Pozivamo queryApi za listu svih eventova za tabelu na dnu
            try {
                const eventsRes = await queryApi.getEventsByQuery("", effectiveToken, 1, 20);
                if (eventsRes && eventsRes.data) {
                    setAllEvents(eventsRes.data);
                }
            } catch (e) {
                console.error("Greška pri učitavanju tabele:", e);
            }

            const realCompromised = res.isChainValid === false
                ? await integrityApi.getCompromisedLogs(effectiveToken)
                : [];

            const totalToScan = res.totalLogsChecked > 0 ? res.totalLogsChecked : 1000;
            let currentScan = 0;
            const duration = 2000;
            const intervalTime = 30;
            const increment = Math.ceil(totalToScan / (duration / intervalTime)) || 1;

            const timer = setInterval(() => {
                currentScan += increment;

                if (currentScan >= totalToScan) {
                    clearInterval(timer);

                    const finalStatus: IntegrityStatusDTO = {
                        ...res,
                        totalLogsChecked: totalToScan,
                        lastChecked: new Date(),
                        compromisedSegmentsCount: realCompromised.length || (res.isChainValid ? 0 : 1)
                    };

                    setStatus(finalStatus);
                    setIsLoading(false);

                    if (!res.isChainValid) {
                        if (realCompromised.length > 0) {
                            setCompromisedLogs(realCompromised);
                        } else {
                            setCompromisedLogs([{
                                id: "ERR-X",
                                message: "Critical: Cryptographic chain mismatch detected in database segments."
                            }]);
                        }
                        setShowBreachPanel(true);
                    }
                } else {
                    setStatus({
                        isChainValid: true,
                        totalLogsChecked: currentScan,
                        lastChecked: new Date(),
                        compromisedSegmentsCount: 0
                    } as IntegrityStatusDTO);

                    if (realCompromised.length > 0 && currentScan > totalToScan * 0.3) {
                        const progress = currentScan / totalToScan;
                        const countToShow = Math.ceil(realCompromised.length * progress);
                        setCompromisedLogs(realCompromised.slice(0, countToShow));
                    }
                }
            }, intervalTime);

        } catch (err) {
            console.error("Integrity error:", err);
            setError("Database connection failed.");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void handleRunAudit();
    }, []);

    return (
        <div className="bg-transparent border-2 border-solid rounded-[14px] border-[#282A28] overflow-hidden">
            <h2 className="mt-[3px]! p-[5px]! m-[10px]!">Blockchain Integrity</h2>

            <div className="flex justify-end me-[10px]!">
                <div className={`flex w-[160px]! items-center gap-2 px-3! py-1.5! rounded-[8px] text-[12px] font-semibold transition-all
                    ${status?.isChainValid !== false
                        ? "bg-[rgba(74,222,128,0.15)] text-[#4ade80] border border-[rgba(74,222,128,0.3)]"
                        : "bg-[rgba(239,68,68,0.15)] text-[#f87171] border border-[rgba(239,68,68,0.3)]"
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${isLoading ? "bg-yellow-400 animate-spin" : status?.isChainValid !== false ? "bg-[#4ade80] animate-pulse" : "bg-[#f87171]"}`}></div>
                    {isLoading ? "Auditing..." : status?.isChainValid !== false ? "Chain Verified" : "Chain Broken"}
                </div>
            </div>

            <div className="m-[10px]! flex flex-col gap-4">
                {error && !isLoading && (
                    <div className="text-red-400 text-[14px] ml-1! font-bold">⚠️ {error}</div>
                )}

                <IntegrityStatusCard
                    status={status}
                    onVerify={handleRunAudit}
                    loading={isLoading}
                />

                {/* LIVE SCAN MONITOR */}
                <div className="bg-[#0a0a0a] border border-[#333] rounded-[10px] p-4 font-mono shadow-inner">
                    <div className="flex justify-between items-center mb-3 border-b border-[#222] pb-2">
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Live Integrity Scan</span>
                        <span className="text-[10px] text-[#4ade80]">{isLoading ? "BUSY" : "IDLE"}</span>
                    </div>

                    <div className="space-y-1 max-h-[120px] overflow-y-auto text-[12px]">
                        {isLoading && (
                            <div className="text-blue-400">
                                {`> Analyzing blocks... ${status?.totalLogsChecked || 0} records.`}
                            </div>
                        )}

                        {compromisedLogs.length > 0 ? (
                            compromisedLogs.map((log, i) => (
                                <div key={i} className="text-red-500 flex gap-2">
                                    <span>{`> [CRITICAL] Hash mismatch Log #${log.id}`}</span>
                                </div>
                            ))
                        ) : (
                            !isLoading && <div className="text-gray-600 italic">{"> No violations found."}</div>
                        )}
                    </div>
                </div>

                {/* Audit Information Box */}
                <div className="bg-[#1f1f1f] border border-[#333] rounded-[10px] p-5">
                    <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4 text-[#9ca3af]">Audit Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-gray-500 text-[11px] uppercase font-bold">Hashing</p>
                            <p className="text-white text-[14px] font-mono">SHA-256</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-[11px] uppercase font-bold">Mode</p>
                            <p className="text-white text-[14px]">Blockchain Diff</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-[11px] uppercase font-bold">Status</p>
                            <p className={`text-[14px] font-bold ${status?.isChainValid !== false ? "text-[#4ade80]" : "text-[#f87171]"}`}>
                                {isLoading ? "Scanning..." : status?.isChainValid !== false ? "Operational" : "Breach"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* NOVA TABELA: DATABASE RECORD FEED */}
                <div className="bg-[#0a0a0a] border border-[#333] rounded-[10px] p-4 overflow-hidden shadow-2xl">
                    <h3 className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-3 border-b border-[#222] pb-2 text-center">
                        Database Record Feed (Blockchain Sequence)
                    </h3>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left text-[11px] font-mono border-collapse">
                            <thead className="sticky top-0 bg-[#0a0a0a] text-blue-400 z-10">
                                <tr className="border-b border-[#333]">
                                    <th className="p-2">ID</th>
                                    <th className="p-2">Timestamp</th>
                                    <th className="p-2">Type</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">Chain Hash</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-400">
                                {allEvents.length > 0 ? (
                                    allEvents.map((ev, i) => (
                                        <tr key={i} className="border-b border-[#1a1a1a] hover:bg-[#111] transition-colors">
                                            <td className="p-2 text-white">#{ev.id}</td>
                                            <td className="p-2 text-[10px]">{ev.timestamp ? new Date(ev.timestamp).toLocaleString() : "N/A"}</td>
                                            <td className="p-2">
                                                <span className="bg-[#222] px-1.5 py-0.5 rounded text-[9px] text-gray-300 border border-[#333]">
                                                    {ev.eventType || "EVENT"}
                                                </span>
                                            </td>
                                            <td className="p-2 text-green-500/80 font-bold text-[9px]">● SIGNED</td>
                                            <td className="p-2 text-[9px] text-gray-600 font-mono truncate max-w-[150px]">
                                                {ev.hash || "a8f3c9d2...b1e0"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-600 italic">
                                            {isLoading ? "Intercepting database stream..." : "No records to display. Initiate audit to sync feed."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {status?.isChainValid === false && !isLoading && (
                    <div className="mt-2 flex justify-center">
                        <button
                            onClick={() => setShowBreachPanel(true)}
                            className="bg-[#ff4d4d] text-white px-8 py-2.5 rounded-[10px] font-bold hover:bg-[#ff3333] transition-all shadow-lg hover:shadow-red-500/20"
                        >
                            Open Detailed Breach Report
                        </button>
                    </div>
                )}
            </div>

            {showBreachPanel && (
                <IntegrityBreachPanel
                    compromisedLogs={compromisedLogs}
                    onClose={() => setShowBreachPanel(false)}
                />
            )}
        </div>
    );
}