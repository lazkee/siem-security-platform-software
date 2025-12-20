export function SortArchives<T extends {
    fileName: string;
    fileSize: number;
    createdAt: Date;
}>(
    archives: T[],
    by: "date" | "size" | "name",
    order: "asc" | "desc"
): T[] {
    const factor = order === "asc" ? 1: 1;

    return [...archives].sort((a, b) => {
        let valA: number | string;
        let valB: number | string;

          switch (by) {
                case "date":
                    valA = new Date(a.createdAt).getTime();
                    valB = new Date(b.createdAt).getTime();
                    break;

                case "size":
                    valA = a.fileSize;
                    valB = b.fileSize;
                    break;

                case "name":
                    valA = a.fileName;
                    valB = b.fileName;
                    break;
            }

            if (valA < valB) return -1 * factor;
            if (valA > valB) return 1 * factor;
            return 0;
    });
}