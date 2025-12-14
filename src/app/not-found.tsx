'use client';

import { useRouter } from 'next/navigation';
import Button from "@/components/Button/Button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen text-gray50 gap-4">
      <h1 className='font-bold text-3xl'>🎅길을 잃으셨나요?</h1>
      <div className='flex flex-col gap-1 items-center'>
        <span> 이곳은 산타마을의 지도에도 없는 곳이에요. </span>
        <span> 썰매가 잠시 방향을 잘못 잡은 것 같아요. </span>
        <span> 종소리를 따라 다시 돌아가 주세요. ❄️ </span>
      </div>
      <div className='flex gap-3'>
        <Button href="/" label="메인 화면으로 돌아가기"/>
        <Button label='이전 화면으로 돌아기기'onClick={() => router.back()} />
      </div>
    
    </div>
  );
}
