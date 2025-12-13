'use client';

import Button from '@/components/Button/Button';
import Spinner from '@/components/Spinner';
import { useToast } from '@/contexts/ToastProvider';
import { useEffect, useState } from 'react';

import { useSaveName } from '../../hooks/useSaveName';
import EditButton from './EditButton';
import LogoutButton from './LogoutButton';

interface Props {
  isOwner: boolean;
  initialName: string;
  userId: string;
  certificateCount: number;
}

export default function MyPageHeader({ isOwner, initialName, userId, certificateCount }: Props) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(initialName);
  const { show } = useToast();

  const { saveName, isSaving } = useSaveName({ kakaoId: userId });

  useEffect(() => {
    setTempName(initialName);
  }, [initialName]);

  const handleSaveName = async () => {
    if (!tempName.trim()) return;

    await saveName(tempName, () => {
      show('✅ 이름이 저장되었습니다!', 'success');
      setIsEditingName(false);
    });
  };

  const handleCancel = () => {
    setTempName(initialName);
    setIsEditingName(false);
  };

  return (
    <div className="absolute top-0 z-10 flex w-full justify-between p-2">
      <div className="relative flex flex-col items-start">
        {isOwner && !isEditingName && <EditButton onClick={() => setIsEditingName(true)} />}

        {isEditingName ? (
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                value={tempName}
                onChange={e => e.target.value.length <= 6 && setTempName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSaveName();
                  if (e.key === 'Escape') handleCancel();
                }}
                autoFocus
                disabled={isSaving}
                className="w-60 rounded bg-white px-3 py-2 text-3xl font-bold disabled:opacity-50"
              />
              {isSaving && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                  <Spinner size={30} />
                </div>
              )}
            </div>

            <Button label="저장" onClick={handleSaveName} disabled={isSaving} />
            <Button label="취소" onClick={handleCancel} disabled={isSaving} />
          </div>
        ) : (
          <h1 className="rounded bg-[#b59059] px-3 py-2 text-3xl font-bold shadow-md">
            {`${tempName}산타의 작업실`}
          </h1>
        )}

        <span>산타 임명장을 {certificateCount}개 받았어요!</span>
      </div>

      {isOwner && <LogoutButton />}
    </div>
  );
}
