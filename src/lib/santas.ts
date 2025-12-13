// lib/santas.ts
import { SANTA_DATA, SantaId } from './constants/santaData';
import { scoreAnswers } from './score';

/**
 * 최종 산타 결과 반환
 */
export function getSantaResult(answers: Record<number, number>) {
  const { resultId, santaScores } = scoreAnswers(answers);

  // resultId가 1~8 범위인지 확인
  const santaId: SantaId = (resultId >= 1 && resultId <= 8 ? resultId : 1) as SantaId;
  const details = SANTA_DATA[santaId];

  return {
    santaId,
    ...details,
    santaScores,
  };
}
