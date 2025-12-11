'use client';

import CertificateBadge from '@/components/CertificateBadge';
import Image from 'next/image';

interface RoomProps {
  wallType: number;
  floorType: number;
  objectType: number;
  wallImages: string[];
  floorImages: string[];
  objectImages: string[];
  certificates: any[];
  onSelectCertificate: (item: any) => void;
}

export default function Room({
  wallType,
  floorType,
  objectType,
  wallImages,
  floorImages,
  objectImages,
  certificates,
  onSelectCertificate,
}: RoomProps) {
  return (
    <div className="relative h-220 w-full flex-1 overflow-hidden">
      {/* 배경(벽+바닥) */}
      <div className="-z-10 flex h-full flex-col">
        <div
          className="flex-1 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${wallImages[wallType]})` }}
        />
        <div
          className="h-100 w-full bg-top"
          style={{ backgroundImage: `url(${floorImages[floorType]})` }}
        />
      </div>

      {/* 오브젝트 + 뱃지 */}
      <div className="absolute bottom-75 left-1/2 z-20 -translate-x-1/2">
        <div className="relative h-120 w-60">
          <Image
            src={objectImages[objectType]}
            alt="오브젝트"
            fill
            unoptimized
            className="pointer-events-none h-auto w-full"
          />

          {certificates.slice(0, 12).map((item, index) => {
            const row = Math.floor(index / 3); // 0, 1, 2, 3 ...
            const col = index % 3; // 0 = 왼쪽, 1 = 가운데, 2 = 오른쪽

            const topPxBase = 205 + row * 70;
            const leftPx = 65 + col * 70;

            // 가운데 열(col === 1)만 아래로 15px 정도 이동
            const topPxAdjusted = topPxBase + (col === 1 ? 10 : 0);

            const topPercent = (topPxAdjusted / 600) * 100;
            const leftPercent = (leftPx / 300) * 100;

            return (
              <div
                key={index}
                className="absolute cursor-pointer rounded-full shadow-md"
                style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                onClick={() => onSelectCertificate(item)}
              >
                <CertificateBadge santaType={item.santaType} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
