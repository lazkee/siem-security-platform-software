export function normalizeIpAddress(ip: string): string {
    if (ip === "::1")               // IPv6 localhost
        return "127.0.0.1";

    if (ip.startsWith("::ffff:"))   // IPv6 mapping of IPv4
        return ip.replace("::ffff:", "");

    return ip;
}