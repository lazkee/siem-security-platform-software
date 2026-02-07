import { IoClose } from "react-icons/io5";
import { FiAlertTriangle } from "react-icons/fi";
import { IntegrityBreachPanelProps } from "../../types/props/integrity/IntegrityBreachPanelProps";

export default function IntegrityBreachPanel({ compromisedLogs, onClose }: IntegrityBreachPanelProps) {
    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[1000]"
            onClick={onClose}
        >
            <div 
                className="bg-[#1a1a1a] rounded-2xl w-[95%] max-w-[800px] max-h-[85vh] overflow-hidden border border-[#ff4d4d]/30 shadow-[0_0_50px_rgba(255,77,77,0.15)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-[#333] bg-[#251a1a]">
                    <div className="flex items-center gap-2 text-[#ff4d4d]">
                        <FiAlertTriangle size={20} />
                        <h2 className="m-0 text-lg font-bold uppercase tracking-tight">Security Breach Report</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="bg-transparent border-none cursor-pointer text-gray-400 hover:text-white text-2xl transition-colors p-0 flex items-center"
                    >
                        <IoClose />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
                    <p className="text-gray-400 text-sm mb-6">
                        Sledeći unosi u bazi podataka se ne poklapaju sa kriptografskim hash lancem. 
                        Ovo ukazuje na direktnu manipulaciju bazom podataka.
                    </p>

                    <div className="space-y-4">
                        {compromisedLogs && compromisedLogs.length > 0 ? (
                            compromisedLogs.map((log, index) => (
                                <div 
                                    key={index} 
                                    className="bg-[#222] border border-[#333] rounded-xl p-4 flex justify-between items-center hover:border-[#ff4d4d]/50 transition-all"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${log.isMissing ? "bg-orange-500/20 text-orange-500" : "bg-red-500/20 text-red-500"}`}>
                                                {log.isMissing ? "Deleted Entry" : "Data Tampered"}
                                            </span>
                                            <span className="text-white font-mono font-bold text-sm">Log ID: #{log.id || 'N/A'}</span>
                                        </div>
                                        <div className="text-gray-400 text-[13px] italic line-clamp-1 pr-4">
                                            "{log.description || "Historical data damaged or modified"}"
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-[10px] text-gray-500 uppercase font-semibold">Incident Detected</div>
                                        <div className="text-white text-xs font-mono">
                                            {new Date().toLocaleString("en-GB")}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500 italic">
                                No specific logs identified. Check system sync.
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-[#1f1f1f] border-t border-[#333] flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-[#313338] text-white rounded-lg font-bold text-[13px] hover:bg-[#404249] transition-all border border-white/5"
                    >
                        Dismiss Warning
                    </button>
                </div>
            </div>
        </div>
    );
}