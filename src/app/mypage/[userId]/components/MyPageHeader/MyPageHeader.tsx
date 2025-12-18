'use client';

import Button from '@/components/Button/Button';
import IconButton from '@/components/IconButton/IconButton';
import Modal from '@/components/Modal/Modal';
import Spinner from '@/components/Spinner';
import { useToast } from '@/contexts/ToastProvider';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useSaveName } from '../../hooks/useSaveName';
import EditButton from './EditButton';
import LogoutButton from './LogoutButton';
import VisibleButton from './VisibleButton';

interface Props {
  isOwner: boolean;
  initialName: string;
  userId: string;
  isVisible: boolean;
  onVisibilityChange?: (visible: boolean) => void; // visible 변경 콜백 추가
}

export default function MyPageHeader({
  isOwner,
  initialName,
  isVisible,
  userId,
  onVisibilityChange,
}: Props) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(initialName);
  const [open, setOpen] = useState(false);
  const { show } = useToast();

  const { saveName, isSaving } = useSaveName({ kakaoId: userId });

  useEffect(() => {
    setTempName(initialName);
  }, [initialName]);

  const handleSaveName = async () => {
    if (!tempName.trim()) show('한글자 이상 입력해주세요', 'error');

    await saveName(tempName, () => {
      show('저장되었습니다!', 'success');
      setIsEditingName(false);
    });
  };

  const handleCancel = () => {
    setTempName(initialName);
    setIsEditingName(false);
  };

  return (
    <>
      <div className="absolute top-0 z-10 flex w-full items-start justify-between p-2">
        <div className="flex flex-col items-start">
          <div className="relative">
            {isEditingName ? (
              <div className="relative flex items-center gap-2">
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
                    className="w-50 rounded bg-white px-3 py-2 text-[20px] font-bold disabled:opacity-50"
                  />
                  {isSaving && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                      <Spinner size={30} />
                    </div>
                  )}
                </div>

                <div className="flex gap-1">
                  <Button label="Y" size="sm" onClick={handleSaveName} disabled={isSaving} />
                  <Button label="N" size="sm" onClick={handleCancel} disabled={isSaving} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="relative">
                  {isOwner && !isEditingName && (
                    <EditButton
                      onClick={() => setIsEditingName(true)}
                      className="absolute -right-3 -bottom-4"
                    />
                  )}
                  <h1 className="rounded bg-[#b59059] px-3 py-2 text-[20px] font-bold shadow-md">
                    {`${tempName} 산타의 작업실`}
                  </h1>
                </div>
                <IconButton
                  icon="IC_Info"
                  ariaLabel="정보"
                  size="lg"
                  variant="ghost"
                  className="text-gray700"
                  onClick={() => setOpen(true)}
                />
              </div>
            )}
          </div>
        </div>

        {isOwner ? (
          <div className="flex items-center gap-2">
            <VisibleButton userId={userId} onVisibilityChange={onVisibilityChange} />
            <LogoutButton />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-white/20 px-2 py-1">
              {isVisible ? '공개' : '비공개'}
            </span>
            <IconButton
              href="/"
              icon="IC_Home"
              variant="tertiary"
              ariaLabel="메인화면으로 이동"
              className="text-gray900"
            />
          </div>
        )}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} className="mx-10">
        <div className="mb-2 flex flex-col gap-1 px-2 font-semibold">
          <div className="flex gap-1">
            <div>
              <Image src="/assets/images/github.png" alt="github icon" width={20} height={20} />
            </div>
            <Link href="https://github.com/YD00s/santa_appointment_letter">Github 주소</Link>
          </div>
          <div className="flex items-center gap-1">
            <div>
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png?20200221181224"
                alt="github icon"
                width={18}
                height={18}
              />
            </div>
            <Link href="https://aback-shirt-867.notion.site/2c0add99c04280c08879d1810dd4eebb">
              소개/안내 페이지
            </Link>
          </div>
        </div>
        <div className="custom-scrollbar flex h-100 flex-col gap-4 overflow-auto p-2 text-lg">
          <span>
            혼자 급하게 만들어본 서비스로, <br />
            <strong>불안정</strong>할 수 있습니다!
          </span>
          <span>
            간직하고 싶은 메세지가 있다면 <br />
            <strong>미리미리 캡처</strong>해주세요.
          </span>
          <span>
            작업실을 꾸미고 오너먼트를 누르면 <br />
            친구에게 받은 메세지가 보여요.
          </span>
          <span>
            작업실 주인은 '나만보기', '전체공개' 버튼을 눌러 <br />
            임명장 내용 <strong>공개여부</strong>를 정할 수 있어요.
          </span>
          <span>
            당신이 게스트라면 좌측 상단의 공개/비공개로 <br />
            메세지 공개 여부를 확인할 수 있답니다.
          </span>
          <span>
            비공개라면 오너먼트를 눌러도 임명장이 보이지 않아요! <br />
            친구의 작업실을 감상해주세요.
          </span>
          <span>
            모든 이미지는 개발자가 <strong>직접 그린</strong> 이미지입니다.
            <br />
            무단으로 사용하지 말아주세요.
          </span>
          <span>상대를 비방하는 말은 적지 말아주세요.</span>
        </div>
      </Modal>
    </>
  );
}
