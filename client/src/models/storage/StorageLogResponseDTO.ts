export interface StorageLogResponseDTO {
    storageLogId: number;
    fileName: string;
    recordCount: number;
    fileSize: number;
    createdAt: string;
    archiveType: string;
}