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
    <div className="relative min-h-screen w-full flex-1 overflow-hidden border">
      {/* 배경(벽+바닥) */}
      <div className="absolute inset-0 -z-10 flex flex-col">
        <div
          className="h-195 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${wallImages[wallType]})` }}
        />
        <div
          className="h-55 w-full bg-top"
          style={{ backgroundImage: `url(${floorImages[floorType]})` }}
        />
      </div>

      {/* 오브젝트 + 뱃지 */}
      <div className="absolute bottom-28 left-1/2 z-20 -translate-x-1/2">
        <div className="relative h-200 w-100">
          <Image
            src={objectImages[objectType]}
            alt="오브젝트"
            fill
            unoptimized
            className="pointer-events-none h-auto w-full"
          />

          {certificates.slice(0, 12).map((item, index) => {
            const topPx = 210 + Math.floor(index / 3) * 70;
            const leftPx = 65 + (index % 3) * 70;
            const topPercent = (topPx / 600) * 100;
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
