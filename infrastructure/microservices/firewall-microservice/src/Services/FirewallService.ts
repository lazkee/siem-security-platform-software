import { IFirewallLogRepository } from "../Domain/services/IFirewallLogRepository";
import { IFirewallModeRepository } from "../Domain/services/IFirewallModeRepository";
import { IFirewallRuleRepository } from "../Domain/services/IFirewallRuleRepository";
import { IFirewallService } from "../Domain/services/IFirewallService";

export class FirewallService implements IFirewallService {
    constructor(
        private readonly ruleRepo: IFirewallRuleRepository,
        private readonly modeRepo: IFirewallModeRepository,
        private readonly logRepo: IFirewallLogRepository
    ) { }

    async checkTestConnection(ipAddress: string, port: number): Promise<boolean> {
        const mode = await this.modeRepo.getCurrent();
        const rule = await this.ruleRepo.getByIpAndPort(ipAddress, port);

        if (mode === "WHITELIST")
            return rule.id !== -1;      // WHITELIST: Only IP+Port in the rules table are allowed
        else
            return rule.id === -1;      // BLACKLIST: All IPs are allowed except ones in the rules table
    }

    async checkAndLogAccess(ipAddress: string, port: number): Promise<boolean> {
        const allowed = await this.checkTestConnection(ipAddress, port);

        await this.logRepo.add(
            ipAddress,
            port,
            allowed ? "ALLOWED" : "BLOCKED",
            await this.modeRepo.getCurrent()
        );

        return allowed;
    }
}
