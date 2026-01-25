export type AlertPayloadDto = {
  id: number;
  createdAt: string;
  resolvedAt?: string;
  oldestCorrelatedEventAt: string;        
  category: string;                       
  isFalseAlarm: boolean;
};