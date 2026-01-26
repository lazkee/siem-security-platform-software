import { In, Repository } from "typeorm";
import { AxiosInstance } from "axios";
import { ICorrelationService } from "../Domain/services/ICorrelationService";
import { ILLMChatAPIService } from "../Domain/services/ILLMChatAPIService";
import { Correlation } from "../Domain/models/Correlation";
import { CorrelationEventMap } from "../Domain/models/CorrelationEventMap";
import { CorrelationDTO } from "../Domain/types/CorrelationDTO";
import { QueryEventDTO } from "../Domain/types/QueryEventDTO";
import { createAxiosClient } from "../Infrastructure/helpers/axiosClient";
import { extractNumericEventIds } from "../Infrastructure/helpers/extractNumericEventIds";
import { parseQueryEvents } from "../Infrastructure/parsers/QueryEventParser";
import { ILoggerService } from "../Domain/services/ILoggerService";
import { JsonValue } from "../Domain/types/JsonValue";

export class CorrelationService implements ICorrelationService {
  private readonly alertClient: AxiosInstance;
  private readonly queryClient: AxiosInstance;

  private readonly confidenceThreshold =
    Number(process.env.CORRELATION_CONFIDENCE_THRESHOLD ?? 0.51);

  private readonly queryEventsPath =
    process.env.QUERY_EVENTS_PATH ?? "/query/oldEvents/1";

  public constructor(
    private readonly correlationRepo: Repository<Correlation>,
    private readonly correlationEventMap: Repository<CorrelationEventMap>,
    private readonly llmChatApiService: ILLMChatAPIService,
    private readonly loggerService: ILoggerService
  ) {
    this.queryClient = createAxiosClient(process.env.QUERY_SERVICE_API ?? "");
    this.alertClient = createAxiosClient(process.env.ALERT_SERVICE_API ?? "");
  }

  public async findCorrelations(): Promise<void> {
    await this.loggerService.info("[CorrelationService] Finding correlations");

    // 1) Fetch events 
    const eventsJsonRes = await this.fetchEvents();
    if (!eventsJsonRes.ok) {
      await this.loggerService.error("[CorrelationService] Failed to fetch events", {
        error: eventsJsonRes.error,
      });
      return;
    }

    const eventsJson = eventsJsonRes.value;

    // 2) Parse + sanitize into stable DTO 
    const eventsDto = parseQueryEvents(eventsJson);

    if (eventsDto.length === 0) {
      await this.loggerService.warn("[CorrelationService] Query returned 0 parsable events");
      return;
    }

    // 3) Ask LLM 
    const candidates = await this.llmChatApiService.sendCorrelationPrompt(
      JSON.stringify(eventsDto, null, 2)
    );

    if (candidates.length === 0) {
      await this.loggerService.info("[CorrelationService] No correlation candidates returned");
      return;
    }

    // 4) Policy + persist
    const inputIdsArray = extractNumericEventIds(eventsJson);
    const inputEventIds = new Set<number>(inputIdsArray);

    for (const candidate of candidates) {
      if (!this.passesPolicy(candidate, inputEventIds)) continue;
      await this.processCandidate(candidate, eventsDto);
    }
  }

  private async fetchEvents(): Promise<
    { readonly ok: true; readonly value: JsonValue } | { readonly ok: false; readonly error: string }
  > {
    try {
      const res = await this.queryClient.get(this.queryEventsPath);
      return { ok: true, value: res.data as JsonValue };
    } catch (e) {
      return { ok: false, error: "query_service_fetch_failed" };
    }
  }

  private async processCandidate(candidate: CorrelationDTO, events: QueryEventDTO[]): Promise<void> {
    try {
      const correlationId = await this.saveCorrelation(candidate);

      const firstId = candidate.correlatedEventIds[0];
      const ipAddress = this.resolveIp(events, firstId);

      const enriched: CorrelationDTO = {
        ...candidate,
        id: correlationId,
        ipAddress,
      };

      await this.sendCorrelationAlertSafe(enriched);

      await this.loggerService.info("[CorrelationService] Correlation stored", {
        correlationId,
      });
    } catch (e) {
      console.log(e);
      await this.loggerService.error("[CorrelationService] Failed to process candidate", {
        error: "process_candidate_failed",
      });
    }
  }

  private resolveIp(events: QueryEventDTO[], eventId: number | undefined): string {
    if (typeof eventId !== "number") return "unknown";
    const match = events.find((e) => e.id === eventId);
    const ip = match?.ipAddress;
    return typeof ip === "string" && ip.trim().length > 0 ? ip : "unknown";
  }

  // ------------------------------------------------------------------
  // POLICY VALIDATION
  // ------------------------------------------------------------------
  private passesPolicy(candidate: CorrelationDTO, inputEventIds: Set<number>): boolean {
    if (!candidate.correlationDetected) return false;
    if (candidate.confidence < this.confidenceThreshold) return false;
    if (candidate.correlatedEventIds.length < 2) return false;

    if (
      inputEventIds.size > 0 &&
      candidate.correlatedEventIds.some((id) => !inputEventIds.has(id))
    ) {
      return false;
    }

    return true;
  }

  // ------------------------------------------------------------------
  // OUTBOUND INTEGRATIONS
  // ------------------------------------------------------------------
  private async sendCorrelationAlertSafe(correlation: CorrelationDTO): Promise<void> {
    try {
      await this.alertClient.post("/alerts/correlation", {
        correlationId: correlation.id,
        description: correlation.description,
        severity: correlation.severity,
        correlatedEventIds: correlation.correlatedEventIds,
      });
    } catch (e) {
      await this.loggerService.warn("[CorrelationService] Failed to send correlation alert", {
        correlationId: correlation.id,
      });
    }
  }

  private async saveCorrelation(dto: CorrelationDTO): Promise<number> {
    const correlation = this.correlationRepo.create({
      description: dto.description,
      timestamp: dto.timestamp,
      isAlert: dto.correlationDetected,
    });

    const saved = await this.correlationRepo.save(correlation);

    const maps = dto.correlatedEventIds.map((eventId) =>
      this.correlationEventMap.create({
        correlation_id: saved.id,
        event_id: eventId,
      })
    );

    await this.correlationEventMap.save(maps);

    return saved.id;
  }

  public async deleteCorrelationsByEventIds(eventIds: number[]): Promise<number> {
    if (eventIds.length === 0) return 0;

    try {
      const maps = await this.correlationEventMap.find({
        where: { event_id: In(eventIds) },
      });

      const ids = [...new Set(maps.map((m) => m.correlation_id))];
      if (ids.length === 0) return 0;

      await this.correlationRepo.manager.transaction(async (manager) => {
        await manager.delete(CorrelationEventMap, { correlation_id: In(ids) });
        await manager.delete(Correlation, { id: In(ids) });
      });

      return ids.length;
    } catch (e) {
      await this.loggerService.error("[CorrelationService] deleteCorrelationsByEventIds failed", {
        error: "delete_failed",
      });
      return 0;
    }
  }
}
