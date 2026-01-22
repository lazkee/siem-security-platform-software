import { useState } from "react";
import { FirewallTestDTO } from "../../types/firewall/FirewallTestDTO";

interface FirewallConnectionTesterProps {
    testConnection: (ipAddress: string, port: number) => Promise<FirewallTestDTO>;
}

export default function FirewallConnectionTester({ testConnection }: FirewallConnectionTesterProps) {
    const [ipAddress, setIpAddress] = useState("");
    const [port, setPort] = useState<number | "">("");
    const [isTesting, setIsTesting] = useState(false);
    const [result, setResult] = useState<FirewallTestDTO | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleTest = async () => {
        if (!ipAddress || port === "") {
            setError("Please enter valid IP and port.");
            setResult(null);
            return;
        }

        setIsTesting(true);
        setError(null);
        setResult(null);

        try {
            const res = await testConnection(ipAddress, Number(port));
            setResult(res);
        } catch (err) {
            console.error("Connection test failed", err);
            setError("Connection test failed.");
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <div className="bg-[#1f1f1f] rounded-[14px] px-5 py-4 shadow-md border border-[#333] w-full h-full flex flex-col">
            <h3 className="text-[#d0d0d0] font-semibold text-[16px] mb-4">
                Test Connection
            </h3>

            <div className="flex flex-col gap-4 flex-1">
                <input
                    type="text"
                    placeholder="IP Address"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    className="px-4 py-3 rounded-[10px] bg-[#2a2a2a] border border-[#333] text-[#d0d0d0]
                       focus:outline-none focus:border-[#555]"
                />

                <input
                    type="number"
                    placeholder="Port"
                    value={port}
                    onChange={(e) =>
                        setPort(e.target.value ? Number(e.target.value) : "")
                    }
                    className="px-4 py-3 rounded-[10px] bg-[#2a2a2a] border border-[#333] text-[#d0d0d0]
                       focus:outline-none focus:border-[#555]"
                />

                <button
                    onClick={handleTest}
                    disabled={isTesting}
                    className={`mt-auto w-full h-[40px] rounded-[10px] font-semibold text-white transition-colors ${isTesting
                        ? "bg-[#313338] cursor-not-allowed"
                        : "bg-[#007a55] hover:bg-[#009166]"
                        }`}
                >
                    {isTesting ? "Testing..." : "Test"}
                </button>

                {result && (
                    <div
                        className={`pt-2 text-sm font-semibold ${result.allowed ? "text-green-400" : "text-red-400"
                            }`}
                    >
                        {result.allowed ? "Allowed" : "Blocked"}
                    </div>
                )}

                {error && (
                    <div className="pt-2 text-sm text-red-400">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}