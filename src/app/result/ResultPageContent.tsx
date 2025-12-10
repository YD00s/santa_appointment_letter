'use client';

import { useSanta } from '@/contexts/SantaContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResultPageContent() {
  const router = useRouter();
  const { result } = useSanta();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 결과가 없으면 질문 페이지로 리다이렉트
  useEffect(() => {
    if (!result) {
      router.push('/questions');
    }
  }, [result, router]);

  if (!result) return null;

  // 눈송이
  const snowflakes = Array.from({ length: 50 }).map((_, i) => ({
    left: (i * 17.3) % 100, // 의사 랜덤 (일관성 유지)
    size: (i % 3) + 5, // 2~4px
    duration: (i % 10) + 10, // 10~19초
    delay: i % 4, // 0~4초
  }));

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#1a2847] px-6 py-24 text-center">
      {mounted && (
        <div className="pointer-events-none absolute inset-0">
          {snowflakes.map((flake, i) => (
            <div
              key={i}
              className="animate-snowfall absolute rounded-full bg-blue-50"
              style={{
                left: `${flake.left}%`,
                top: '-10px',
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                animationDuration: `${flake.duration}s`,
                animationDelay: `${flake.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* 결과 카드 */}
      <div className="relative w-full max-w-lg">
        <div className="rounded-2xl bg-white/95 p-8 shadow-xl backdrop-blur-sm">
          {/* 산타 이름 */}
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-sm text-gray-500">당신은...</h1>
            <h2 className="mb-4 text-3xl font-bold text-gray-900">{result.title}</h2>
          </div>

          {/* 산타 이미지 영역 */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-200 shadow-lg">
              <div className="text-7xl">🎅</div>
            </div>
          </div>

          {/* 구분선 */}
          <div className="mb-6 border-t border-gray-200"></div>

          {/* 자세한 설명 */}
          <div className="text-center">
            <p className="text-[15px] leading-relaxed whitespace-pre-line text-gray-700">
              {result.description}
            </p>
          </div>
        </div>

        {/* 버튼 */}
        <a
          href="/send"
          className="mt-6 block w-full rounded-xl bg-red-600 py-4 text-center text-lg font-medium text-white shadow-lg transition-colors hover:bg-red-700"
        >
          친구에게 임명장 발급하기
        </a>
      </div>

      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(20px);
            opacity: 0;
          }
        }

        .animate-snowfall {
          animation: snowfall linear infinite;
        }
      `}</style>
    </main>
  );
}
