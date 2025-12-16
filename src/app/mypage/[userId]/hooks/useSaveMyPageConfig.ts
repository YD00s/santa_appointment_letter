'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastProvider';
import { useState } from 'react';

interface UseSaveMyPageConfigParams {
  isEditMode: boolean;
  pageOwnerId: string;
  wallType: number;
  floorType: number;
  objectType: number;
  toggleEditMode: () => void;
  onSuccess?: () => void;
}

type ApiErrorResponse = {
  message?: string;
};

export function useSaveMyPageConfig({
  isEditMode,
  pageOwnerId,
  wallType,
  floorType,
  objectType,
  onSuccess,
}: UseSaveMyPageConfigParams) {
  const { user } = useAuthContext();
  const { show } = useToast();
  const [loading, setLoading] = useState(false);

  const saveMyPageConfig = async () => {
    if (!isEditMode) return;

    if (!user) {
      show('로그인이 필요합니다.', 'error');
      return;
    }

    // 편집 모드면 저장
    try {
      setLoading(true);

      const res = await fetch('/api/mypage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: pageOwnerId,
          wallType,
          floorType,
          objectType,
        }),
      });

      if (!res.ok) {
        let serverMessage = '설정을 저장하지 못했습니다.';

        try {
          const data: ApiErrorResponse = await res.json();
          if (data?.message) {
            serverMessage = data.message;
          }
        } catch {
          // 응답 바디 파싱 실패 (추측: 서버가 JSON이 아닌 에러를 반환했을 가능성)
        }

        switch (res.status) {
          case 400:
            show(serverMessage || '요청 정보가 올바르지 않습니다.', 'error');
            return;
          case 401:
            show('누구시죠? 다시 로그인해 주세요.', 'error');
            return;
          case 403:
            show('잘못 찾아왔어요! 방을 수정할 권한이 없습니다.', 'error');
            return;
          case 404:
            show('저장할 방을 찾을 수 없습니다.', 'error');
            return;
          case 500:
          default:
            show(serverMessage || '서버 오류로 저장에 실패했습니다.', 'error');
            return;
        }
      }

      show('저장되었습니다!', 'success');

      onSuccess?.();
    } catch (error) {
      console.error('저장 중 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      show(`⚠️ ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return { saveMyPageConfig, loading };
}
