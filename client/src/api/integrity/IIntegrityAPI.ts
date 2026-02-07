export interface IIntegrityAPI {
  verifyLogs(token: string): Promise<any>;
  getCompromisedLogs(token: string): Promise<any[]>;
}