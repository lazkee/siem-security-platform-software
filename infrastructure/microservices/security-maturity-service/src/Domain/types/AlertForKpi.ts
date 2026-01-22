export type AlertForKpi = {
  id: number;
  createdAt: Date;
  resolvedAt: Date | null;
  oldestCorrelatedEventAt: Date | null;
  category: string | null;
  isFalseAlarm: boolean;
};
