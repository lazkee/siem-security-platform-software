import { AlertQueryDTO } from "../Domain/DTOs/AlertQueryDTO";

export function alertQueryDTOToQuery(alertQueryDTO: AlertQueryDTO) : string{
    const filters: string[] = [];

    
    if (alertQueryDTO.severity) {
        filters.push(`severity=${alertQueryDTO.severity}`);
    }

    if (alertQueryDTO.status) {
        filters.push(`status=${alertQueryDTO.status}`);
    }

    if (alertQueryDTO.source) {
        filters.push(`source=${alertQueryDTO.source}`);
    }

    const filterPart = filters.join("|");

    
    const page = alertQueryDTO.page ?? 1;
    const limit = alertQueryDTO.limit ?? 50;

    
    if (filterPart.length > 0) {
        return `${filterPart}_p${page}_l${limit}`;
    }

    return `p${page}_l${limit}`;
}