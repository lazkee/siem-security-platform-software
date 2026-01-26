import { AlertCategory } from "../enums/AlertCategory";
export type AlertForKpi = {
  id: number;
  createdAt: Date;
  resolvedAt?: Date;
  oldestCorrelatedEventAt: Date;
  category: AlertCategory;
  isFalseAlarm: boolean;
  isValid?: boolean;
};