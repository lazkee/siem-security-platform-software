import { useState, useEffect } from "react";
import { FirewallModeDTO } from "../../types/firewall/FirewallModeDTO";

interface FirewallModeSwitcherProps {
    mode: FirewallModeDTO;
    onSave: (newMode: "WHITELIST" | "BLACKLIST") => Promise<void>;
}

export default function FirewallModeSwitcher({ mode, onSave }: FirewallModeSwitcherProps) {
    const [selectedMode, setSelectedMode] = useState<"WHITELIST" | "BLACKLIST">(mode.mode);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setSelectedMode(mode.mode); // Update local state if mode changes from parent
    }, [mode]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(selectedMode);
        } catch (err) {
            console.error("Failed to save firewall mode", err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-[#1f1f1f] rounded-[14px] px-5 py-4 shadow-md border border-[#333] w-full h-full flex flex-col">
            <h3 className="text-[#d0d0d0] font-semibold text-[16px] mb-4">
                Firewall Mode
            </h3>

            <div className="flex flex-col gap-4 flex-1">
                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-[#d0d0d0]">
                        <input
                            type="radio"
                            name="firewallMode"
                            value="WHITELIST"
                            checked={selectedMode === "WHITELIST"}
                            onChange={() => setSelectedMode("WHITELIST")}
                            className="accent-[#4ade80]"
                        />
                        Whitelist
                    </label>

                    <label className="flex items-center gap-2 text-[#d0d0d0]">
                        <input
                            type="radio"
                            name="firewallMode"
                            value="BLACKLIST"
                            checked={selectedMode === "BLACKLIST"}
                            onChange={() => setSelectedMode("BLACKLIST")}
                            className="accent-[#f87171]"
                        />
                        Blacklist
                    </label>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`mt-auto w-full h-[40px] rounded-[10px] font-semibold text-white transition-colors ${isSaving
                            ? "bg-[#313338] cursor-not-allowed"
                            : "bg-[#007a55] hover:bg-[#009166]"
                        }`}
                >
                    {isSaving ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );

}