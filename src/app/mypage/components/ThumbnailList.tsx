'use client';

import Image from 'next/image';

interface ThumbnailListProps {
  images: string[];
  height?: number;
  onSelect: (index: number) => void;
}

export default function ThumbnailList({ images, height = 10, onSelect }: ThumbnailListProps) {
  return (
    <div className="flex justify-center gap-2 p-2 pb-20">
      {images.map((img, idx) => (
        <div
          key={idx}
          className="hover:border-gray200 relative w-50 cursor-pointer overflow-hidden rounded-2xl hover:border-3"
          onClick={() => onSelect(idx)}
          style={{ height: `${height}rem` }}
        >
          <Image src={img} alt="선택" fill className="object-cover" />
        </div>
      ))}
    </div>
  );
}
