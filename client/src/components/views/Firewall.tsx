import { useEffect, useState } from "react";

import FirewallModeSwitcher from "../firewall/FirewallModeSwitcher";
import FirewallRuleManager from "../firewall/FirewallRuleManager";
import FirewallRulesTable from "../firewall/FirewallRulesTable";
import FirewallLogsTable from "../firewall/FirewallLogsTable";
import FirewallConnectionTester from "../firewall/FirewallConnectionTester";
import { IFirewallAPI } from "../../api/firewall/IFirewallAPI";
import { FirewallModeDTO } from "../../types/firewall/FirewallModeDTO";
import { FirewallRuleDTO } from "../../types/firewall/FirewallRuleDTO";
import { FirewallLogDTO } from "../../types/firewall/FirewallLogDTO";

interface FirewallViewProps {
    firewallApi: IFirewallAPI;
}

export default function Firewall({ firewallApi }: FirewallViewProps) {
    const [mode, setMode] = useState<FirewallModeDTO>({ mode: "WHITELIST" });
    const [rules, setRules] = useState<FirewallRuleDTO[]>([]);
    const [logs, setLogs] = useState<FirewallLogDTO[]>([]);

    // Load initial data
    const loadInitialData = async () => {
        try {
            const [fMode, fRules, fLogs] = await Promise.all([
                firewallApi.getMode(),
                firewallApi.getAllRules(),
                firewallApi.getAllLogs(),
            ]);
            setMode(fMode);
            setRules(fRules);
            setLogs(fLogs);
        } catch (err) {
            console.error("Failed to load firewall data", err);
        };
    }

    useEffect(() => {
        void loadInitialData();
    }, []);

    // Handlers for subcomponents
    const handleModeSave = async (newMode: "WHITELIST" | "BLACKLIST") => {
        try {
            const updated = await firewallApi.setMode(newMode);
            setMode({ mode: updated.mode });
        } catch (err) {
            console.error("Failed to update mode", err);
        }
    };

    const handleAddRule = async (ip: string, port: number) => {
        try {
            const newRule = await firewallApi.addRule(ip, port);
            setRules((prev) => [...prev, newRule]);
        } catch (err) {
            console.error("Failed to add rule", err);
            throw err;      // Propagate error for component to show
        }
    };

    const handleDeleteRule = async (id: number) => {
        try {
            await firewallApi.deleteRule(id);
            setRules((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error("Failed to delete rule", err);
        }
    };

    const handleTestConnection = async (ip: string, port: number) => {
        return await firewallApi.testConnection(ip, port);
    };

    return (
        <div className="flex flex-col gap-8 p-6">
            {/* Row 1: Mode + Add Rule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                <div className="h-full">
                    <FirewallModeSwitcher
                        mode={mode}
                        onSave={handleModeSave}
                    />
                </div>

                <div className="h-full">
                    <FirewallRuleManager
                        addRule={handleAddRule}
                    />
                </div>
            </div>

            {/* Row 2: Test Connection + Rules */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                <div className="h-full">
                    <FirewallConnectionTester
                        testConnection={handleTestConnection}
                    />
                </div>

                <div className="h-full">
                    <FirewallRulesTable
                        rules={rules}
                        deleteRule={handleDeleteRule}
                    />
                </div>
            </div>

            {/* Row 3: Logs - full width */}
            <div className="w-full">
                <FirewallLogsTable logs={logs} />
            </div>
        </div>
    );
}