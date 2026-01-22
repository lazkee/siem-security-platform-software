import axios, { AxiosInstance } from "axios";

export function createAxiosClient(baseUrl: string, timeout = 5000): AxiosInstance {
    if (!baseUrl) throw new Error("Base URL must be provided");
    return axios.create({
        baseURL: baseUrl,
        headers: { "Content-Type": "application/json" },
        timeout,
    });
}
