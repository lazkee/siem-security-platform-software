import { microserviceUrls } from "../../Domain/constants/MicroserviceUrls";

export function getMicroserviceUrl(path: string): string {
    const serviceKey = path.replace(/^\/+/, "").split("/")[0];  // Extract service key from URL path (e.g. "/analysis-engine/process" -> "analysis-engine")
    return microserviceUrls[serviceKey] || "";
}