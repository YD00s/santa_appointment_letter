'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastProvider';

interface UseSaveMyPageConfigParams {
  isEditMode: boolean;
  pageOwnerId: string;
  wallType: number;
  floorType: number;
  objectType: number;
  toggleEditMode: () => void;
  onSuccess?: () => void;
}

export function useSaveMyPageConfig({
  isEditMode,
  pageOwnerId,
  wallType,
  floorType,
  objectType,
  onSuccess,
}: UseSaveMyPageConfigParams) {
  const { user, loadUser } = useAuthContext();
  const { show } = useToast();

  const saveMyPageConfig = async () => {
    // 편집 모드가 아니면 편집 모드로 전환
    if (!isEditMode) {
      return;
    }
    if (!user) {
      show('로그인이 필요합니다.', 'error');
      return;
    }

    // 편집 모드면 저장
    try {
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
        const errorData = await res.json();
        throw new Error(errorData.message || '저장에 실패했습니다.');
      }

      show('✅ 저장되었습니다!', 'success');

      onSuccess?.();
    } catch (error) {
      console.error('저장 중 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      show(`⚠️ ${errorMessage}`, 'error');
    }
  };

  return { saveMyPageConfig };
}
