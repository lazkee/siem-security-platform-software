import { FiShield, FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import { IntegrityStatusCardProps } from "../../types/props/integrity/IntegrityStatusCardProps";

export default function IntegrityStatusCard({ status, onVerify, loading }: IntegrityStatusCardProps) {
    const isSecure = status?.isChainValid;

    return (
        <div className="flex flex-row items-center justify-between p-5 bg-[#1f1f1f] rounded-2xl border border-[#333] shadow-lg w-full mb-6">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isSecure ? "bg-[#007a55]/20 text-[#00ffa3]" : "bg-red-500/20 text-[#ff4d4d]"}`}>
                    {isSecure ? <FiShield size={28} /> : <FiAlertTriangle size={28} />}
                </div>
                <div>
                    <h3 className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold m-0">
                        Blockchain Integrity
                    </h3>
                    <div className={`text-xl font-bold ${isSecure ? "text-[#00ffa3]" : "text-[#ff4d4d]"}`}>
                        {loading ? "Verifying..." : isSecure ? "System Consistent" : "Integrity Breach Detected"}
                    </div>
                </div>
            </div>

            <div className="flex gap-8 items-center">
                <div className="text-right">
                    <label className="block text-[11px] text-gray-400 uppercase tracking-wider">Total Logs Checked</label>
                    <span className="text-white font-mono font-semibold">{status?.totalLogsChecked || 0}</span>
                </div>
                
                <div className="text-right border-l border-[#333] pl-8">
                    <label className="block text-[11px] text-gray-400 uppercase tracking-wider">Last Check</label>
                    <span className="text-white text-[13px]">
                        {status?.lastChecked ? new Date(status.lastChecked).toLocaleString("en-GB") : "Never Checked"}
                    </span>
                </div>

                <button
                    onClick={onVerify}
                    disabled={loading}
                    className="ml-4 bg-[#313338] hover:bg-[#404249] text-white px-5 py-2 rounded-[10px] font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
                >
                    <FiRefreshCw className={loading ? "animate-spin" : ""} />
                    Run Audit
                </button>
            </div>
        </div>
    );
}