export interface IMonitoringService {
    
  runChecks(): Promise<void>;
}