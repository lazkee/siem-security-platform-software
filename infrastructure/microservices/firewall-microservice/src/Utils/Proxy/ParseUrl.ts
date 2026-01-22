export function parseUrl(urlString: string): { ip: string; port: number } {
    const urlObj = new URL(urlString);
    return {
        ip: urlObj.hostname,
        port: Number(urlObj.port)
    };
}
