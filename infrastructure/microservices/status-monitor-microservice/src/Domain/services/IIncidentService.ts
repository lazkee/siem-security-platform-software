export interface IIncidentService {
  evaluate(serviceName: string): Promise<void>;
}

