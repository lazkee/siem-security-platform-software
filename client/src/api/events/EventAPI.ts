import axios, { AxiosInstance } from "axios";
import { IEventAPI } from "./IEventAPI";
import { EventDTO } from "../../models/events/EventDTO";

export class EventAPI implements IEventAPI {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_GATEWAY_URL, // npr. http://localhost:4000/api/v1
      headers: { "Content-Type": "application/json" },
    });
  }

  async getAllEvents(token: string): Promise<EventDTO[]> {
    const response = await this.client.get<EventDTO[]>("/siem/query/search", {
      params: { q: "" }, // prazan query => Query service vrati sve evente
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }
}
