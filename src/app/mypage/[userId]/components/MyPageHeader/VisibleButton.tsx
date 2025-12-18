'use client';
import Button from '@/components/Button/Button';
import { useToast } from '@/contexts/ToastProvider';
import { useCallback, useEffect, useState } from 'react';

interface Props {
  userId: string; // kakao_id
  initialVisible?: boolean; // 서버에서 전달받은 초기값 (선택사항)
  onVisibilityChange?: (visible: boolean) => void; // ✅ 부모에게 변경 알림
}

export default function VisibleButton({
  userId,
  initialVisible = false,
  onVisibilityChange,
}: Props) {
  const { show } = useToast();
  const [isVisible, setIsVisible] = useState<boolean>(initialVisible);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * 초기 상태 로드
   */
  const fetchCurrentStatus = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/mypage?userId=${userId}`);
      if (!res.ok) {
        console.warn('마이페이지 정보 로드 실패');
        return;
      }

      const result = await res.json();
      console.log('📥 GET /api/mypage 응답:', result);

      if (result.success && result.data) {
        const newVisible = !!result.data.visible;
        setIsVisible(newVisible);
        onVisibilityChange?.(newVisible); // ✅ 부모에게 알림
      }
    } catch (err) {
      console.warn('초기 공개 상태 로드 실패:', err);
    }
  }, [userId]);

  useEffect(() => {
    // initialVisible이 제공되지 않은 경우에만 fetch
    if (initialVisible === undefined) {
      fetchCurrentStatus();
    }
  }, [fetchCurrentStatus, initialVisible]);

  /**
   * 공개 상태 변경 핸들러
   */
  const handleToggleVisibility = async () => {
    if (isLoading || !userId) return;

    setIsLoading(true);
    const nextState = !isVisible;
    const previousState = isVisible;

    // 낙관적 업데이트
    setIsVisible(nextState);
    onVisibilityChange?.(nextState); // ✅ 부모에게 즉시 알림

    try {
      console.log('📤 PATCH /api/mypage/visible 요청:', { userId, visible: nextState });

      const response = await fetch('/api/mypage/visible', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          visible: nextState,
        }),
      });

      const result = await response.json();
      console.log('📥 PATCH /api/mypage/visible 응답:', result);

      if (result.success || response.ok) {
        show(
          nextState ? '마이페이지가 전체 공개되었습니다.' : '마이페이지가 비공개로 전환되었습니다.',
          'success'
        );
      } else {
        // 실패 시 롤백
        setIsVisible(previousState);
        throw new Error(result.message || '업데이트에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('❌ Visibility Update Error:', err);
      // 롤백
      setIsVisible(previousState);
      onVisibilityChange?.(previousState); // ✅ 롤백도 알림
      show(err.message || '상태 변경 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isVisible ? 'tertiary' : 'secondary'}
        label={isLoading ? '처리중...' : isVisible ? '나만보기' : '전체공개'}
        onClick={handleToggleVisibility}
        disabled={isLoading}
        size="sm"
        className="text-gray900"
      />
    </div>
  );
}
