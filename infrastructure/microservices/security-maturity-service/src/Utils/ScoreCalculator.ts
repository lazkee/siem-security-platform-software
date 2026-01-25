import { ScoreInput } from "../Domain/types/ScoreInput";
import { NOT_FOUND, isNotFound } from "../Domain/constants/Sentinels";

function limitValue(value: number, min = 0, max = 1): number {
  return Math.min(Math.max(value, min), max);
}

export function calculateScore(input: ScoreInput): number {
  const { mttdMinutes, mttrMinutes, falseAlarmRate, totalAlerts } = input;

  if (totalAlerts === NOT_FOUND || totalAlerts <= 0) {
    return NOT_FOUND;
  }

  const normalizedMTTD = isNotFound(mttdMinutes)
    ? 0.5
    : limitValue(1 - mttdMinutes / 120);

  const normalizedMTTR = isNotFound(mttrMinutes)
    ? 0.5
    : limitValue(1 - mttrMinutes / 240);

  const normalizedFalseAlarm = isNotFound(falseAlarmRate)
    ? 0.5
    : limitValue(1 - falseAlarmRate);

  const normalizedVolume = limitValue(Math.log10(totalAlerts + 1) / 2);

  const score =
    normalizedMTTD * 30 +
    normalizedMTTR * 30 +
    normalizedFalseAlarm * 25 +
    normalizedVolume * 15;

  return Math.round(score);
}
