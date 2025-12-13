// RoomFooter.tsx
'use client';

import Button from '@/components/Button/Button';
import { useToast } from '@/contexts/ToastProvider';
import { useRouter } from 'next/navigation';

interface Props {
  isOwner: boolean;
  isEditMode: boolean;
  toggleEditMode: () => void;
  onSave: () => void;
  userId: string; // 비소유자 전송용
}

export default function MyPageFooter({
  isOwner,
  isEditMode,
  toggleEditMode,
  onSave,
  userId,
}: Props) {
  const router = useRouter();
  const { show } = useToast();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      show('✅ 페이지 링크가 복사되었습니다!', 'success');
    } catch (err) {
      console.error(err);
      show('😫 페이지 링크 복사에 실패했습니다.', 'error');
    }
  };

  const goToQuestions = () => {
    router.push(`/mypage/${userId}/questions`);
  };

  if (isOwner) {
    return (
      <div className="absolute bottom-0 left-0 flex w-full justify-between p-4">
        <Button
          label={isEditMode ? '저장하기' : '방 꾸미기'}
          className="mr-2 w-1/2"
          onClick={e => {
            isEditMode ? onSave() : toggleEditMode();
            (e.currentTarget as HTMLButtonElement).blur();
          }}
        />
        <Button
          label="공유하기"
          className="ml-2 w-1/2"
          onClick={e => {
            handleCopyLink();
            (e.currentTarget as HTMLButtonElement).blur();
          }}
        />
      </div>
    );
  }

  return (
    <div className="absolute bottom-0 left-0 w-full p-4">
      <Button
        label="임명장 전송하기"
        className="w-full"
        onClick={e => {
          goToQuestions();
          (e.currentTarget as HTMLButtonElement).blur();
        }}
      />
    </div>
  );
}
