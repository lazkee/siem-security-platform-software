import axios from "axios";
import { IInsiderThreatService } from "../Domain/services/IInsiderThreatService";
import { IUserRiskAnalysisService } from "../Domain/services/IUserRiskAnalysisService";
import { IThreatDetectionService } from "../Domain/services/IThreatDetectionService";
import { ILoggerService } from "../Domain/services/ILoggerService";
import { UserCacheService } from "../Services/UserCacheService";


export class ThreatAnalysisJob {
  private lastProcessedEventId: number = 0;
  private isRunning: boolean = false;
  private intervalId?: NodeJS.Timeout;
  private readonly intervalMinutes: number;

  constructor(
    private readonly eventCollectorUrl: string,
    private readonly threatService: IInsiderThreatService,
    private readonly riskService: IUserRiskAnalysisService,
    private readonly detectionService: IThreatDetectionService,
    private readonly userCacheService: UserCacheService,
    private readonly logger: ILoggerService,
    intervalMinutes: number = 15
  ) {
    this.intervalMinutes = intervalMinutes;
  }

  start(): void {
    this.logger.log(`Starting Threat Analysis Job - runs every ${this.intervalMinutes} minutes`);
    this.run();
    this.intervalId = setInterval(() => this.run(), this.intervalMinutes * 60 * 1000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.logger.log("Threat Analysis Job stopped");
    }
  }

  private async run(): Promise<void> {
    if (this.isRunning) {
      this.logger.log("[ThreatAnalysisJob] Previous analysis still running, skipping");
      return;
    }

    this.isRunning = true;
    this.logger.log(`[ThreatAnalysisJob] Starting analysis - last processed ID: ${this.lastProcessedEventId}`);

    try {
      const maxEventId = await this.getMaxEventId();
      
      if (maxEventId <= this.lastProcessedEventId) {
        this.logger.log("[ThreatAnalysisJob] No new events to process");
        return;
      }

      const newEvents = await this.getEventsInRange(
        this.lastProcessedEventId + 1,
        maxEventId
      );

      this.logger.log(`[ThreatAnalysisJob] Analyzing ${newEvents.length} new events (ID ${this.lastProcessedEventId + 1} to ${maxEventId})`);

      const eventsByUser = await this.groupEventsByPrivilegedUsers(newEvents);

      this.logger.log(`[ThreatAnalysisJob] Found events for ${Object.keys(eventsByUser).length} privileged users`);

      for (const [userId, events] of Object.entries(eventsByUser)) {
        await this.analyzeUserEvents(userId, events);
      }

      this.lastProcessedEventId = maxEventId;
      this.logger.log(`[ThreatAnalysisJob] Analysis completed - processed up to event ID: ${maxEventId}`);

    } catch (error: any) {
      this.logger.log(`[ThreatAnalysisJob] ERROR: ${error.message}`);
      if (error.stack) {
        this.logger.log(`[ThreatAnalysisJob] Stack: ${error.stack}`);
      }
    } finally {
      this.isRunning = false;
    }
  }

  private async getMaxEventId(): Promise<number> {
    try {
      const response = await axios.get(`${this.eventCollectorUrl}/events`, {
        timeout: 10000
      });
      
      const events = response.data;
      
      if (!Array.isArray(events) || events.length === 0) {
        return 0;
      }

      return Math.max(...events.map((e: any) => e.id));
    } catch (error: any) {
      this.logger.log(`[ThreatAnalysisJob] Failed to get max event ID: ${error.message}`);
      return this.lastProcessedEventId;
    }
  }

  private async getEventsInRange(fromId: number, toId: number): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.eventCollectorUrl}/events/from/${fromId}/to/${toId}`,
        { timeout: 30000 }
      );
      
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      this.logger.log(`[ThreatAnalysisJob] Failed to get events: ${error.message}`);
      return [];
    }
  }


  private async groupEventsByPrivilegedUsers(events: any[]): Promise<Record<string, any[]>> {
    const grouped: Record<string, any[]> = {};

    this.logger.log(`[ThreatAnalysisJob] Grouping ${events.length} events by privileged users`);

    const eventsWithUserId = events.filter(e => e.userId);
    this.logger.log(`[ThreatAnalysisJob] Events with userId: ${eventsWithUserId.length} / ${events.length}`);
    
    if (eventsWithUserId.length === 0) {
      this.logger.log(`[ThreatAnalysisJob]  WARNING: No events have userId field!`);
      this.logger.log(`[ThreatAnalysisJob]  Make sure Gateway enriches requests with userId`);
      return grouped;
    }

    for (const event of eventsWithUserId) {
      const userId = String(event.userId);
      
      const user = await this.userCacheService.getUserByUserId(userId);
      
      if (!user) {
        continue;
      }

      const isPrivileged = user.role === 0 || user.role === 1;
      
      if (!isPrivileged) {
        continue;
      }

      if (!grouped[userId]) {
        grouped[userId] = [];
        this.logger.log(`[ThreatAnalysisJob] ✓ Found privileged user: ${user.username} (userId: ${userId}, role: ${user.role})`);
      }
      grouped[userId].push(event);
    }

    this.logger.log(`[ThreatAnalysisJob] Grouped events for ${Object.keys(grouped).length} privileged users`);
    
    return grouped;
  }


  private async analyzeUserEvents(userId: string, events: any[]): Promise<void> {
    try {
      const userInfo = await this.userCacheService.getUserByUserId(userId);
      
      if (!userInfo) {
        this.logger.log(`[ThreatAnalysisJob] User ${userId} not found in cache`);
        return;
      }

      const eventIds = events.map(e => e.id);
      const username = userInfo.username;

      this.logger.log(`[ThreatAnalysisJob] Analyzing ${eventIds.length} events for user ${username} (ID: ${userId}, Role: ${userInfo.role})`);

      await this.detectMassDataRead(userId, username, eventIds);
      await this.detectOffHoursAccess(userId, username, eventIds);
      await this.detectPermissionChanges(userId, username, eventIds);
      await this.detectAuthCorrelations(userId, username, eventIds);

    } catch (error: any) {
      this.logger.log(`[ThreatAnalysisJob] Error analyzing events for user ${userId}: ${error.message}`);
    }
  }

  private async detectMassDataRead(
    userId: string,
    username: string,
    eventIds: number[]
  ): Promise<void> {
    const result = await this.detectionService.detectMassDataRead(userId, eventIds);
    
    if (result && result.isDetected) {
      const threat = await this.threatService.createThreat({
        userId,
        username,
        threatType: result.threatType,
        riskLevel: result.riskLevel,
        description: result.description,
        metadata: result.metadata || {},
        correlatedEventIds: result.correlatedEventIds,
        source: "ThreatAnalysisJob",
      });

      await this.riskService.updateUserRiskAfterThreat(userId, username, threat.id);
      this.logger.log(`[ThreatAnalysisJob] ✓ Created threat ${threat.id} for ${username}: ${result.threatType}`);
    }
  }

  private async detectOffHoursAccess(
    userId: string,
    username: string,
    eventIds: number[]
  ): Promise<void> {
    const result = await this.detectionService.detectOffHoursAccess(userId, eventIds);
    
    if (result && result.isDetected) {
      const threat = await this.threatService.createThreat({
        userId,
        username,
        threatType: result.threatType,
        riskLevel: result.riskLevel,
        description: result.description,
        metadata: result.metadata || {},
        correlatedEventIds: result.correlatedEventIds,
        source: "ThreatAnalysisJob",
      });

      await this.riskService.updateUserRiskAfterThreat(userId, username, threat.id);
      this.logger.log(`[ThreatAnalysisJob] ✓ Created threat ${threat.id} for ${username}: ${result.threatType}`);
    }
  }

  private async detectPermissionChanges(
    userId: string,
    username: string,
    eventIds: number[]
  ): Promise<void> {
    const result = await this.detectionService.detectPermissionChange(userId, eventIds);
    
    if (result && result.isDetected) {
      const threat = await this.threatService.createThreat({
        userId,
        username,
        threatType: result.threatType,
        riskLevel: result.riskLevel,
        description: result.description,
        metadata: result.metadata || {},
        correlatedEventIds: result.correlatedEventIds,
        source: "ThreatAnalysisJob",
      });

      await this.riskService.updateUserRiskAfterThreat(userId, username, threat.id);
      this.logger.log(`[ThreatAnalysisJob] ✓ Created threat ${threat.id} for ${username}: ${result.threatType}`);
    }
  }

  private async detectAuthCorrelations(
    userId: string,
    username: string,
    eventIds: number[]
  ): Promise<void> {
    const results = await this.detectionService.correlateWithAuthEvents(userId, eventIds);
    
    for (const result of results) {
      if (result.isDetected) {
        const threat = await this.threatService.createThreat({
          userId,
          username,
          threatType: result.threatType,
          riskLevel: result.riskLevel,
          description: result.description,
          metadata: result.metadata || {},
          correlatedEventIds: result.correlatedEventIds,
          source: "ThreatAnalysisJob",
        });

        await this.riskService.updateUserRiskAfterThreat(userId, username, threat.id);
        this.logger.log(`[ThreatAnalysisJob] ✓ Created threat ${threat.id} for ${username}: ${result.threatType}`);
      }
    }
  }
}
