'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import { useState } from 'react';

interface Props {
  kakaoId: string;
}

export function useSaveName({ kakaoId }: Props) {
  const { loadUser } = useAuthContext();
  const [isSaving, setIsSaving] = useState(false);

  const saveName = async (name: string, onSuccess?: () => void) => {
    if (!name.trim() || name.length > 6) return;

    try {
      setIsSaving(true);

      const res = await fetch('/api/mypage/name', {
        method: 'PATCH',
        body: JSON.stringify({ name: name, userId: kakaoId }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error('이름 저장에 실패했습니다.');
      }

      // 최신 사용자 정보 즉시 로드
      await loadUser(kakaoId);

      onSuccess?.();
    } catch (e) {
      console.error('이름 저장 중 오류 발생:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return { saveName, isSaving };
}
