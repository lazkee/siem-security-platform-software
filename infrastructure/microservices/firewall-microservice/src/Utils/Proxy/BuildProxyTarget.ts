export function buildProxyTarget(path: string): string {
    return `${process.env.GATEWAY_URL}/${path}`;
}