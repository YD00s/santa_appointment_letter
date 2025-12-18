'use client';

import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import Spinner from '@/components/Spinner';
import TextArea from '@/components/TextArea';
import { usePageOwner } from '@/hooks/usePageOwner';
import { SantaId, getSantaById } from '@/lib/constants/santaData';
import Image from 'next/image';
import { useState } from 'react';

import usePostCertificate from './hooks/usePostCertificate';

interface Props {
  santaId: SantaId;
  userId: string;
}

export default function SendPageContent({ santaId, userId }: Props) {
  const { ownerInfo, isLoading: ownerLoading } = usePageOwner(userId);

  const [content, setContent] = useState('');
  const [senderName, setSenderName] = useState('');
  const [open, setOpen] = useState(false);

  const { send, loading } = usePostCertificate({
    userId,
    senderName,
    receiverName: ownerInfo?.name || '',
    content,
    santaId: santaId || 1,
    onSuccess: () => {
      setOpen(true);
    },
  });

  const onClose = () => {
    setOpen(false);
  };

  if (!santaId || ownerLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size={50} />
      </div>
    );
  }

  const santa = getSantaById(santaId);
  const ownerName = ownerInfo?.name || '산타';
  const isDisabled = loading || !senderName.trim() || !content.trim();

  return (
    <>
      <div className="mt-10 flex justify-center">
        <div className="flex w-80 flex-col items-center gap-4 rounded-2xl bg-white px-4 py-10">
          <div className="flex flex-col items-center gap-2">
            <span className="mb-4 text-2xl font-bold">임명장</span>
            <span className="text-gray700 w-full text-right text-sm">이름 {ownerName}</span>
            <div className="flex flex-col items-center">
              <span className="text-gray-600">{santa.miniTitle}</span>
              <span className="text-2xl font-semibold">{santa.title}</span>
            </div>
            <Image
              src={santa.image}
              alt={santa.title}
              width={200}
              height={200}
              className="mt-5 object-contain"
            />
          </div>

          {/* 보내는 사람 이름 입력 */}
          <div className="mb-4 flex w-full max-w-90 flex-col gap-3">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                당신의 닉네임
              </label>
              <input
                type="text"
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
                placeholder="당신의 닉네임을 입력하세요"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
                maxLength={15}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                임명장 메시지
              </label>
              <div className="w-full">
                <TextArea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  heightLines={5}
                  maxLength={200}
                  placeholder={`${ownerName}에게 보낼 따뜻한 메시지를 적어주세요`}
                />
              </div>
            </div>
            <Button
              label={loading ? '전송 중...' : '임명장 보내기'}
              onClick={send}
              size="full"
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>
      <Modal open={open} onClose={onClose}>
        <div className="flex flex-col gap-5">
          <span className="text-lg font-semibold">임명장이 발송되었습니다!</span>
          <div className="flex flex-col gap-2">
            <Button
              href={`/mypage/${userId}`}
              size="full"
              label={`${ownerName}의 작업실 방문하기`}
            />
            <Button href="/" size="full" variant="secondary" label="메인화면으로 돌아가기" />
          </div>
        </div>
      </Modal>
    </>
  );
}
