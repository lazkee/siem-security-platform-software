import { StorageLogResponseDTO } from "../../models/storage/StorageLogResponseDTO";
import { ArchiveStatsDTO } from "../../models/storage/ArchiveStatsDTO";
import { ArchiveVolumeDTO } from "../../models/storage/ArchiveVolumeDTO";
import { LargestArchiveDTO } from "../../models/storage/LargestArchiveDTO";
import { TopArchiveDTO } from "../../models/storage/TopArchiveDTO";
import { IStorageAPI } from "./IStorageAPI";
import axios, { AxiosInstance } from "axios";

export class StorageAPI implements IStorageAPI {
    private readonly client: AxiosInstance;

    constructor(){
        this.client = axios.create({
            baseURL: import.meta.env.VITE_GATEWAY_URL,
            headers: {
                "Content-Type": "application/json"
            },
        });
    }

    async getAllArchives(token: string): Promise<StorageLogResponseDTO[]> {
        const response = await this.client.get<StorageLogResponseDTO[]>("/storageLog", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }

    async searchArchives(token: string, query: string): Promise<StorageLogResponseDTO[]> {
        const response = await this.client.get<StorageLogResponseDTO[]>("/storageLog/search", {
            params: {q: query},
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }

    async sortArchives(token: string, by: "date" | "size" | "name", order: "asc" | "desc"): Promise<StorageLogResponseDTO[]> {
        const response = await this.client.get<StorageLogResponseDTO[]>("/storageLog/sort", {
            params: {by, order},
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }

    async getStats(token: string): Promise<ArchiveStatsDTO> {
        const response = await this.client.get<ArchiveStatsDTO>("/storageLog/stats", {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }

    async downloadArchive(token: string, id: number): Promise<ArrayBuffer> {
        const response = await this.client.get(`/storageLog/file/${id}`, {
            responseType: "blob",
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }


    //STATISTICS METODA
    async getTopArchives(token: string, type: "events" | "alerts", limit: number): Promise<TopArchiveDTO[]> {
        const response = await this.client.get<TopArchiveDTO[]>("/storageLog/top", {
            params: {type, limit},
            headers: {Authorization: `Bearer ${token}`}
        });
        return response.data;
    }

    //STATISTICS METODA
    async getArchiveVolume(token: string, period: "daily" | "monthly" | "yearly"): Promise<ArchiveVolumeDTO[]>{
       const response = await this.client.get<ArchiveVolumeDTO[]>("/storageLog/volume", {
            params: {period},
            headers: {Authorization: `Bearer ${token}`}
       });

       return response.data;
    }

    async getLargestArchive(token: string): Promise<LargestArchiveDTO> {
        const response = await this.client.get(`/storageLog/largest`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
}