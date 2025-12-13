'use client';

import Image from 'next/image';

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
  return (
    <div className="flex justify-center gap-2 p-2 pb-20">
      {images.map((img, idx) => {
        const isSelected = selectedIndex === idx;

        return (
          <div
            key={idx}
            className={`relative w-50 cursor-pointer overflow-hidden rounded-2xl transition-all ${
              isSelected
                ? 'border-3 border-blue-500 ring-2 ring-blue-200'
                : 'border-2 border-transparent hover:border-gray-300'
            }`}
            onClick={() => onSelect(idx)}
            style={{ height: `${height}rem` }}
          >
            <Image src={img} alt={`옵션 ${idx + 1}`} fill className={layout} />
          </div>
        );
      })}
    </div>
  );
}
