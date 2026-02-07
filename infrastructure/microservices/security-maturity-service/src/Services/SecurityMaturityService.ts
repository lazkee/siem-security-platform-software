import { ISecurityMaturityService } from "../Domain/services/ISecurityMaturityService";
import { ScoreInput } from "../Domain/types/ScoreInput";
import { SMScore } from "../Domain/types/SMScore";
import { mapScoreToLevel } from "../Infrastructure/utils/MapScoreToLevel";
import { calculateScore } from "../Infrastructure/utils/ScoreCalculator";

export class SecurityMaturityService implements ISecurityMaturityService {
  async calculateCurrentMaturity(input: ScoreInput): Promise<SMScore> {
    const score = calculateScore(input);
    const level = mapScoreToLevel(score);

    return {
      scoreValue: score,
      maturityLevel: level,
    };
  }
}
