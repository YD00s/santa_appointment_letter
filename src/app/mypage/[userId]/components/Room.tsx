'use client';

import CertificateBadge from '@/app/mypage/[userId]/components/CertificateBadge';
import IconButton from '@/components/IconButton/IconButton';
import { Certificate } from '@/types/Certificate';
import { RoomImages } from '@/types/RoomAssets';
import Image from 'next/image';
import { useState } from 'react';

interface RoomProps {
  images: RoomImages;
  certificates: any[];
  onSelectCertificate: (cert: Certificate) => void;
}

const CERTIFICATES_PAGE = 12;

export default function Room({ images, certificates, onSelectCertificate }: RoomProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(certificates.length / CERTIFICATES_PAGE);

  const startIndex = currentPage * CERTIFICATES_PAGE;
  const endIndex = startIndex + CERTIFICATES_PAGE;
  const currentCertificates = certificates.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages - 1 || totalPages === 0;

  return (
    <div className="relative h-200 w-full flex-1 overflow-hidden">
      <div className="-z-10 flex h-full flex-col">
        {/* 벽 */}
        <div
          className="flex-1 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${images.wall})` }}
        />
        {/* 바닥 */}
        <div className="h-75 w-full bg-top" style={{ backgroundImage: `url(${images.floor})` }} />
      </div>
      {/* 오브젝트 */}
      <div className="absolute bottom-48 left-1/2 -translate-x-1/2">
        <div className="relative h-140 w-70">
          <Image
            src={images.object}
            alt="오브젝트"
            fill
            unoptimized
            className="pointer-events-none h-auto w-full"
          />
          <span className="absolute bottom-6 left-1/2 min-w-12 -translate-x-1/2 rounded-full bg-white/50 text-center text-sm font-medium backdrop-blur-xs">
            {currentPage + 1} / {totalPages}
          </span>
          {currentCertificates.map((cert, index) => {
            const row = Math.floor(index / 3); // 0, 1, 2, 3 ...
            const col = index % 3; // 0 = 왼쪽, 1 = 가운데, 2 = 오른쪽

            const topPxBase = 205 + row * 70;
            const leftPx = 60 + col * 70;
            const topPxAdjusted = topPxBase + (col === 1 ? 10 : 0);

            const topPercent = (topPxAdjusted / 600) * 100;
            const leftPercent = (leftPx / 300) * 100;

            return (
              <div
                key={cert.id}
                className="absolute cursor-pointer rounded-full shadow-md transition-transform hover:scale-110"
                style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                onClick={() => onSelectCertificate(cert)}
              >
                <CertificateBadge santaId={cert.santaId} />
              </div>
            );
          })}

          {/* 페이지네이션 컨트롤 */}
          {certificates.length > 0 && (
            <div className="absolute bottom-50 left-1/2 z-30 flex -translate-x-1/2 items-center justify-between gap-60">
              <IconButton
                icon="IC_LeftArrow"
                size="sm"
                variant="secondary"
                ariaLabel="이전 페이지"
                className="text-gray900 bg-white hover:bg-white/70 active:bg-white/70 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={handlePrevPage}
                disabled={isFirstPage}
              />
              <IconButton
                icon="IC_RighttArrow"
                size="sm"
                variant="secondary"
                ariaLabel="다음 페이지"
                className="text-gray900 bg-white hover:bg-white/70 active:bg-white/70 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={handleNextPage}
                disabled={isLastPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
