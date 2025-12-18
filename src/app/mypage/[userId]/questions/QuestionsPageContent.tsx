'use client';

import Button from '@/components/Button/Button';
import { QUESTIONS } from '@/lib/questions';
import { getSantaResult } from '@/lib/santas';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import QuestionCard from './components/QuestionCard';

export default function QuestionsPageContent() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = QUESTIONS[currentIndex];
  const isLastQuestion = currentIndex === QUESTIONS.length - 1;
  const isFirstQuestion = currentIndex === 0;
  const hasAnswered = answers[currentIndex] !== undefined;

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstQuestion) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const result = getSantaResult(answers);
    // 결과를 query parameter로 전달
    router.push(`/mypage/${userId}/result?santaId=${result.santaId}`);
  };

  return (
    <main className="flex h-163 flex-col">
      {/* 진행률 표시 */}
      <div className="bg-white/10 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-6 py-4">
          <div className="mb-2 flex items-center justify-between text-sm text-white/80">
            <span>
              질문 {currentIndex + 1} / {QUESTIONS.length}
            </span>
            <span>{Math.round(((currentIndex + 1) / QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/20">
            <div
              className="h-2 rounded-full bg-red-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 질문 영역 */}
      <div className="flex flex-1 items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          <QuestionCard
            number={currentIndex}
            title={currentQuestion.title}
            items={currentQuestion.items}
            selected={answers[currentIndex]}
            onSelect={v => setAnswers({ ...answers, [currentIndex]: v })}
          />
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="bg-white/10 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-6 py-4">
          <div className="flex gap-3">
            <Button
              onClick={handlePrev}
              disabled={isFirstQuestion}
              variant="secondary"
              size="lg"
              label="이전"
            />

            <Button
              onClick={handleNext}
              disabled={!hasAnswered}
              size="lg"
              label={isLastQuestion ? '결과 확인하기' : '다음'}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
