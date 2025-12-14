'use client';

import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import Spinner from '@/components/Spinner';
import TextArea from '@/components/TextArea';
import { usePageOwner } from '@/hooks/usePageOwner';
import { getSantaById, SantaId } from '@/lib/constants/santaData';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import usePostCertificate from './hooks/usePostCertificate';

interface Props {
  santaId: number;
  userId: string;
}

export default function SendPageContent({santaId, userId}:Props) {
  // const router = useRouter();
  // const params = useParams();
  // const searchParams = useSearchParams();
  // const userId = params.userId as string;

  const { ownerInfo, isLoading: ownerLoading } = usePageOwner(userId);

  const [content, setContent] = useState('');
  const [senderName, setSenderName] = useState('');
  // const [santaId, setSantaId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  // useEffect(() => {
    // const santaId = searchParams.get('santaId');

    // if (santaId) {
    //   const id = parseInt(santaId, 10);
    //   if (!isNaN(id) && id >= 1 && id <= 8) {
    //     setSantaId(id);
    //     return;
    //   }
    // }

    // 유효하지 않으면 questions로 리다이렉트
    // router.push(`/mypage/${userId}/questions`);
  // }, [searchParams, router, userId]);

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
      <div className="mt-10 flex flex-col items-center gap-4 px-6 py-16">
        <div className="flex max-w-90 w-full flex-col items-center rounded-xl bg-linear-to-r from-red-50 to-blue-50 p-5">
          <h1 className="text-2xl font-bold">임명장</h1>
          <span className='w-full text-right text-gray700 text-sm'>이름 {ownerName}</span>

          <div className="rounded-lg p-3">
            <div className="flex flex-col items-center gap-1">
              <span>{santa.miniTitle}</span>
              <h2 className="text-xl font-bold text-gray-900">{santa.title}</h2>
              <Image
                src={santa.image}
                alt={santa.title}
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* 보내는 사람 이름 입력 */}
        <div className="mb-4 flex max-w-90 w-full flex-col gap-3">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">당신의 닉네임</label>
            <input
              type="text"
              value={senderName}
              onChange={e => setSenderName(e.target.value)}
              placeholder="당신의 닉네임을 입력하세요"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none"
              maxLength={20}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">임명장 메시지</label>
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
      <Modal open={open} onClose={onClose}>
        <div className="flex flex-col gap-5">
          <span className="text-lg font-semibold">임명장이 발송되었습니다!</span>
          <div className="flex gap-2">
            <Button size="full" variant="secondary" label="메인화면으로 돌아가기" />
            <Button size="full" label={`${ownerName}의 작업실 방문하기`} />
          </div>
        </div>
      </Modal>
    </>
  );
}
