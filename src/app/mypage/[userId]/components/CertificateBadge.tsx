// CertificateBadge.tsx
import { getSantaById } from '@/lib/constants/santaData';
import Image from 'next/image';

interface Props {
  santaId: number;
  isHidden?: boolean;
  isOwner?: boolean;
}

export default function CertificateBadge({ santaId, isHidden = false, isOwner = false }: Props) {
  // santaData에서 이미지 가져오기
  const santa = getSantaById(santaId);

  // 주인이 아니면 숨긴 뱃지는 Room에서 필터링되어 여기까지 오지 않음
  // 주인일 때만 숨긴 뱃지를 반투명하게 표시
  const opacity = isOwner && isHidden ? 'opacity-40' : 'opacity-100';

  return (
    <div
      className={`flex h-12 w-12 cursor-pointer items-center justify-center transition-transform hover:scale-110 ${opacity}`}
    >
      <Image src={santa.badge} alt={santa.title} fill className="object-contain" />
    </div>
  );
}
