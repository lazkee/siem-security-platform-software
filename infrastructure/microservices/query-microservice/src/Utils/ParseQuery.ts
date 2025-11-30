export function parseQueryString(q: string) {
    const filters: Record<string, string> = {};

    q.split("|").forEach(part => {
        const [key, value] = part.split("=");
        if (key && value) {
            filters[key.trim()] = value.trim();
        }
    });

    return filters;
}
 