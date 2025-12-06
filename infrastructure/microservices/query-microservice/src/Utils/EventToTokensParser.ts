export function tokenize(text: string): string[] 
{
    return text
        .toLowerCase()
        .split(/\W+/)
        .filter(Boolean);
}