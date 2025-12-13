import { AlertDTO } from "../DTOs/AlertDTO";
import { AlertQueryDTO } from "../DTOs/AlertQueryDTO";
import { ArchiveDTO } from "../DTOs/ArchiveDTO";
import { ArchiveStatsDTO } from "../DTOs/ArchiveStatsDTO";
import { EventDTO } from "../DTOs/EventDTO";
import { LoginUserDTO } from "../DTOs/LoginUserDTO";
import { PaginatedAlertsDTO } from "../DTOs/PaginatedAlertsDTO";
import { RegistrationUserDTO } from "../DTOs/RegistrationUserDTO";
import { UserDTO } from "../DTOs/UserDTO";
import { AuthResponseType } from "../types/AuthResponse";

export interface IGatewayService {
  // Auth
  login(data: LoginUserDTO): Promise<AuthResponseType>;
  register(data: RegistrationUserDTO): Promise<AuthResponseType>;
  validateToken(
    token: string
  ): Promise<{
    valid: boolean;
    payload?: any;
    isSysAdmin?: boolean;
    error?: string;
  }>;

  // Users
  getAllUsers(): Promise<UserDTO[]>;
  getUserById(id: number): Promise<UserDTO>;

  // Alerts
  getAllAlerts(): Promise<AlertDTO[]>;
  getAlertById(id: number): Promise<AlertDTO>;
  searchAlerts(query: AlertQueryDTO): Promise<PaginatedAlertsDTO>;
  resolveAlert(
    id: number,
    resolvedBy: string,
    status: string
  ): Promise<AlertDTO>;
  updateAlertStatus(id: number, status: string): Promise<AlertDTO>;

  // Query
  searchEvents(query: string): Promise<EventDTO[]>;
  getOldEvents(hours: number): Promise<EventDTO[]>;
  getLastThreeEvents(): Promise<EventDTO[]>;
  getAllEvents(): Promise<EventDTO[]>;
  getEventsCount(): Promise<number>;
  

  // Storage 
  getAllArchives(): Promise<ArchiveDTO[]>;
  runArchiveProcess(): Promise<ArchiveDTO>;
  searchArchives(query: string): Promise<ArchiveDTO[]>;
  sortArchives(by: "date" | "size" | "name", order: "asc" | "desc"): Promise<ArchiveDTO[]>;
  getArchiveStats(): Promise<ArchiveStatsDTO>;
  downloadArchive(id: string): Promise<ArrayBuffer>;
}
