export interface IFirewallService {
    checkTestConnection(ipAddress: string, port: number): Promise<boolean>;     // For SysAdmin to check IP+port availability on UI
    checkAndLogAccess(ipAddress: string, port: number): Promise<boolean>;       // Checking real IP+port request
}
