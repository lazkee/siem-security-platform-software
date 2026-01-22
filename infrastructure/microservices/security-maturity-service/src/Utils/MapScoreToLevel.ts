import { MaturityLevel } from "../Domain/enums/MaturityLevel";

export function mapScoreToLevel(score: number): MaturityLevel {
  if (score <= 20) return MaturityLevel.INITIAL;
  if (score <= 40) return MaturityLevel.MANAGED;
  if (score <= 60) return MaturityLevel.DEFINED;
  if (score <= 80) return MaturityLevel.QUANTITATIVELY_MANAGED;
  return MaturityLevel.OPTIMIZING;
}
