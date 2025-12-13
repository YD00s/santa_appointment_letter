'use client';

import Button from '@/components/Button/Button';
import Divider from '@/components/Divider';
import Spinner from '@/components/Spinner';
import { usePageOwner } from '@/hooks/usePageOwner';
import { getSantaById } from '@/lib/constants/santaData';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResultPageContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = params.userId as string;

  const { ownerInfo, isLoading: ownerLoading } = usePageOwner(userId);

  const [santaId, setSantaId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 방법 1: santaId가 직접 전달된 경우 (권장)
    const directSantaId = searchParams.get('santaId');
    if (directSantaId) {
      const id = parseInt(directSantaId, 10);
      if (!isNaN(id) && id >= 1 && id <= 8) {
        setSantaId(id);
        return;
      }
    }

    console.error('santaId 또는 data 파라미터 없음');
    // router.push(`/mypage/${userId}/questions`);
  }, [searchParams, router, userId]);

  if (!santaId || ownerLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size={50} />
      </div>
    );
  }

  const santa = getSantaById(santaId);
  const ownerName = ownerInfo?.name || '산타';

  // 눈송이
  const snowflakes = Array.from({ length: 50 }).map((_, i) => ({
    left: (i * 17.3) % 100,
    size: (i % 3) + 5,
    duration: (i % 10) + 10,
    delay: i % 4,
  }));

  const handleGoToSend = () => {
    router.push(`/mypage/${userId}/send?santaId=${santaId}`);
  };

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
      <div className="relative flex w-full max-w-lg flex-col gap-10">
        <div className="flex flex-col gap-10 rounded-2xl bg-white/95 p-8 shadow-xl backdrop-blur-sm">
          {/* 산타 이름 */}
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-sm text-gray-500">당신은...</h1>
            <h2 className="mb-4 text-3xl font-bold text-gray-900">{santa.title}</h2>
          </div>

          {/* 산타 이미지 */}
          <div className="mb-8 flex justify-center">
            <div className="relative h-48 w-48">
              <Image src={santa.image} alt={santa.title} fill className="object-contain" />
            </div>
          </div>

          <Divider />

          <div className="text-start">
            <p className="leading-relaxed whitespace-pre-line">{santa.description}</p>
          </div>
        </div>

        {/* 버튼 */}
        <Button label={`${ownerName}에게 임명장 발급하기`} size="full" onClick={handleGoToSend} />
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
