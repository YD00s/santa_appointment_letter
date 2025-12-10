// lib/score.ts
import type { SantaId } from './santas';

type ScoreMap = Record<SantaId, number>;

export const SCORE_WEIGHTS: Record<number, Record<number, Partial<ScoreMap>>> = {
  // Q0
  0: {
    0: { 1: 3, 6: 2, 2: 1 },
    1: { 5: 3, 8: 2 },
    2: { 3: 3, 7: 2, 6: 1 },
  },

  // Q1
  1: {
    0: { 1: 3, 6: 2, 7: 1 },
    1: { 5: 3, 4: 2 },
    2: { 2: 2, 3: 2, 8: 1 },
  },

  // Q2
  2: {
    0: { 1: 2, 2: 2, 6: 1 },
    1: { 5: 3, 7: 2 },
    2: { 3: 3, 8: 2 },
  },

  // Q3
  3: {
    0: { 1: 3, 6: 2 },
    1: { 5: 1, 7: 3 },
    2: { 3: 3, 8: 2 },
  },

  // Q4
  4: {
    0: { 1: 2, 6: 2, 7: 1 },
    1: { 5: 2, 4: 3 },
    2: { 8: 3, 2: 2 },
  },

  // Q5
  5: {
    0: { 1: 3, 6: 2, 7: 1 },
    1: { 5: 3, 7: 2 },
    2: { 2: 2, 3: 3 },
  },

  // Q6
  6: {
    0: { 6: 3, 1: 2 },
    1: { 5: 3, 7: 1 },
    2: { 2: 2, 3: 2, 8: 2 },
  },

  // Q7
  7: {
    0: { 1: 2, 6: 2, 7: 2 },
    1: { 5: 3, 4: 2 },
    2: { 2: 2, 3: 2, 8: 2 },
  },

  // Q8
  8: {
    0: { 4: 3, 5: 1 },
    1: { 8: 3, 6: 2, 1: 1 },
    2: { 2: 2, 3: 1, 7: 2 },
  },

  // Q9
  9: {
    0: { 1: 3, 7: 2 },
    1: { 5: 3, 4: 2 },
    2: { 6: 2, 8: 2 },
  },

  // Q10
  10: {
    0: { 1: 2, 2: 2 },
    1: { 5: 3, 4: 2 },
    2: { 3: 2, 8: 3 },
  },

  // Q11
  11: {
    0: { 1: 2, 3: 2 },
    1: { 5: 3, 4: 2 },
    2: { 6: 3, 2: 2 },
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
