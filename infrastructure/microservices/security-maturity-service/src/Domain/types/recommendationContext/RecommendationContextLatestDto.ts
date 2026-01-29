import { MaturityLevel } from "../../enums/MaturityLevel";

export type RecommendationContextLatestDto = {
  mttd_minutes: number;
  mttr_minutes: number;
  false_alarm_rate: number;
  score_value: number;
  maturity_level: MaturityLevel;
};