import { useState } from "react";

interface FirewallRuleManagerProps {
    addRule: (ipAddress: string, port: number) => Promise<void>;
}

export default function FirewallRuleManager({ addRule }: FirewallRuleManagerProps) {
    const [ipAddress, setIpAddress] = useState("");
    const [port, setPort] = useState<number | "">("");
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

    const handleAdd = async () => {
        if (!ipAddress || port === "") {
            setMessage({ text: "Please enter valid IP and port.", isError: true });
            return;
        }

        setIsSaving(true);
        setMessage(null);

        try {
            await addRule(ipAddress, Number(port));
            setMessage({ text: "Rule added successfully!", isError: false });
            setIpAddress("");
            setPort("");
        } catch (err) {
            console.error("Failed to add rule", err);
            setMessage({ text: "Failed to add rule.", isError: true });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-[#1f1f1f] rounded-[14px] px-5 py-4 shadow-md border border-[#333] w-full h-full flex flex-col">
            <h3 className="text-[#d0d0d0] font-semibold text-[16px] mb-4">
                Add Firewall Rule
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
                    onClick={handleAdd}
                    disabled={isSaving}
                    className={`mt-auto w-full h-[40px] rounded-[10px] font-semibold text-white transition-colors ${isSaving
                        ? "bg-[#313338] cursor-not-allowed"
                        : "bg-[#007a55] hover:bg-[#009166]"
                        }`}
                >
                    {isSaving ? "Adding..." : "Add Rule"}
                </button>

                {message && (
                    <div
                        className={`pt-2 text-sm ${message.isError
                            ? "text-red-400"
                            : "text-green-400"
                            }`}
                    >
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );

}