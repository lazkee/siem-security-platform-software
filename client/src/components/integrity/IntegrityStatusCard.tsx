import { FiShield, FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import { IntegrityStatusCardProps } from "../../types/props/integrity/IntegrityStatusCardProps";

export default function IntegrityStatusCard({ status, onVerify, loading }: IntegrityStatusCardProps) {
    const isSecure = status?.isChainValid;

    return (
        <div className="flex flex-col md:flex-row items-center justify-between w-full p-6 bg-[#1f2123] border-2 border-[#282A28] rounded-lg shadow-sm mb-6 gap-6">

            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div
                    className={`p-4 rounded-xl flex-shrink-0 flex justify-center items-center ${isSecure ? "bg-[#007a55]/20 text-[#00ffa3]" : "bg-red-500/20 text-[#ff4d4d]"
                        }`}
                >
                    {isSecure ? <FiShield size={28} /> : <FiAlertTriangle size={28} />}
                </div>

                <div className="truncate">
                    <h3 className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
                        Blockchain Integrity
                    </h3>
                    <div className={`text-lg font-bold truncate ${isSecure ? "text-[#00ffa3]" : "text-[#ff4d4d]"}`}>
                        {loading ? "Verifying..." : isSecure ? "System Consistent" : "Integrity Breach Detected"}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap md:flex-nowrap items-center gap-6">

                <div className="text-right">
                    <label className="block text-xs text-gray-400 uppercase tracking-wider">Total Logs Checked</label>
                    <span className="text-white font-mono font-semibold">{status?.totalLogsChecked || 0}</span>
                </div>

                <div className="text-right border-l border-[#333] pl-6">
                    <label className="block text-xs text-gray-400 uppercase tracking-wider">Last Check</label>
                    <span className="text-white text-sm">
                        {status?.lastChecked ? new Date(status.lastChecked).toLocaleString("en-GB") : "Never Checked"}
                    </span>
                </div>

                <button
                    onClick={onVerify}
                    disabled={loading}
                    className="bg-[#007a55] hover:bg-[#00a76d] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
                >
                    <FiRefreshCw className={loading ? "animate-spin" : ""} />
                    Run Audit
                </button>
            </div>
        </div>
    );
}