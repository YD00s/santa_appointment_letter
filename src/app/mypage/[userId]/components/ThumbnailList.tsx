'use client';

import Spinner from '@/components/Spinner';
import Image from 'next/image';
import { useState } from 'react';

interface ThumbnailListProps {
  images: string[];
  selectedIndex?: number;
  height?: number;
  layout?: 'object-cover' | 'object-contain';
  onSelect: (index: number) => void;
}

export default function ThumbnailList({
  images,
  selectedIndex,
  height = 10,
  layout = 'object-cover',
  onSelect,
}: ThumbnailListProps) {
  const [isLoaded, setIsLoaded] = useState<Record<number, boolean>>({});

  return (
    <div className="flex justify-center gap-2 p-2 pb-20">
      {images.map((img, idx) => {
        const isSelected = selectedIndex === idx;
        const isisLoaded = isLoaded[idx];

        return (
          <div
            key={idx}
            className={`relative w-50 cursor-pointer overflow-hidden rounded-2xl transition-all ${
              isSelected
                ? 'border-red500 border-3 ring-2 ring-blue-200'
                : 'border-2 border-transparent hover:border-gray-300'
            }`}
            onClick={() => onSelect(idx)}
            style={{ height: `${height}rem` }}
          >
            {!isisLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner />
              </div>
            )}
            <Image
              key={img}
              src={img}
              alt={`옵션 ${idx + 1}`}
              fill
              className={`${layout} transition-opacity duration-200 ${
                isisLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoadingComplete={() => setIsLoaded(prev => ({ ...prev, [idx]: true }))}
            />
          </div>
        );
      })}
    </div>
  );
}
