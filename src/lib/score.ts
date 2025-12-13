// lib/score.ts
import { SantaId } from './constants/santaData';

type ScoreMap = Record<SantaId, number>;

export const SCORE_WEIGHTS: Record<number, Record<number, Partial<ScoreMap>>> = {
  // Q1
  0: {
    0: { 1: 2, 6: 1, 2: 3 },
    1: { 5: 2, 8: 3, 3: 2, 7: 2 },
    2: { 3: 2, 7: 3, 6: 1 },
  },

  // Q2
  1: {
    0: { 1: 3, 6: 2, 7: 1, 2: 2 },
    1: { 3: 3, 4: 2, 7: 2 },
    2: { 3: 2, 8: 1, 7: 3 },
  },

  // Q3
  2: {
    0: { 1: 2, 2: 2, 6: 1 },
    1: { 3: 3, 7: 2, 8: 2 },
    2: { 4: 3, 5: 2 },
  },

  // Q4
  3: {
    0: { 1: 2, 2: 2, 5: 2 },
    1: { 3: 3, 4: 2, 7: 3 },
    2: { 6: 2, 8: 3 },
  },

  // Q5
  4: {
    0: { 1: 2, 6: 2, 7: 1 },
    1: { 2: 3, 3: 2, 8: 3 },
    2: { 5: 3, 4: 3 },
  },

  // Q6
  5: {
    0: { 1: 3, 6: 2, 7: 1, 3: 2 },
    1: { 2: 2, 5: 2, 7: 2 },
    2: { 3: 2, 4: 3, 8: 2 },
  },

  // Q7
  6: {
    0: { 6: 3, 7: 1, 4: 1, 1: 2 },
    1: { 5: 3, 4: 2 },
    2: { 2: 2, 3: 1, 8: 3 },
  },

  // Q8
  7: {
    0: { 1: 1, 3: 2, 6: 2, 8: 1 },
    1: { 5: 3, 4: 2 },
    2: { 2: 2, 8: 3, 7: 2, 6: 1 },
  },

  // Q9
  8: {
    0: { 7: 2, 8: 3, 2: 2 },
    1: { 3: 1, 6: 3, 1: 1 },
    2: { 4: 3, 5: 2 },
  },

  // Q10
  9: {
    0: { 1: 3, 3: 1, 7: 2 },
    1: { 2: 3, 8: 2, 6: 2, 4: 1 },
    2: { 4: 2, 5: 3, 6: 1 },
  },

  // Q11
  10: {
    0: { 1: 3, 2: 2, 7: 1 },
    1: { 3: 1, 6: 3, 7: 3, 8: 2, 4: 1 },
    2: { 5: 3, 4: 2, 3: 2, 6: 1 },
  },

  // Q12
  11: {
    0: { 1: 3, 2: 2, 3: 2, 7: 2 },
    1: { 5: 2, 6: 3, 4: 1, 2: 1, 8: 2 },
    2: { 4: 3, 5: 3, 2: 2 },
  },
};

/**
 * 답변을 기반으로 산타별 점수 계산 및 최종 산타 결정
 */
export function scoreAnswers(answers: Record<number, number>): {
  resultId: SantaId;
  santaScores: Record<SantaId, number>;
} {
  // 산타별 점수 초기화
  const santaScores: Record<SantaId, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  };

  // 각 질문의 답변에 따라 점수 누적
  Object.entries(answers).forEach(([questionId, answerIndex]) => {
    const qId = Number(questionId);
    const weights = SCORE_WEIGHTS[qId]?.[answerIndex];

    if (weights) {
      Object.entries(weights).forEach(([santaId, score]) => {
        santaScores[Number(santaId) as SantaId] += score;
      });
    }
  });

  // 최고 점수 산타 찾기
  let maxScore = -1;
  let resultId: SantaId = 1;

  (Object.keys(santaScores) as unknown as SantaId[]).forEach(santaId => {
    if (santaScores[santaId] > maxScore) {
      maxScore = santaScores[santaId];
      resultId = santaId;
    }
  });

  return {
    resultId,
    santaScores,
  };
}
