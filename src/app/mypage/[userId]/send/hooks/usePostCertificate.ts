'use client';

import { useToast } from '@/contexts/ToastProvider';
import { useState } from 'react';

interface Props {
  userId: string;
  senderName: string;
  receiverName: string;
  content: string;
  santaId: number;
}
export default function usePostCertificate({
  userId,
  senderName,
  receiverName,
  content,
  santaId,
}: Props) {
  const [loading, setLoading] = useState(false);
  const { show } = useToast();

  const send = async () => {
    console.log(receiverName);
    if (!userId || !senderName.trim() || !receiverName.trim() || !content.trim()) {
      console.warn('모든 값이 로드 되지 않았습니다.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: userId,
          senderName: senderName.trim(),
          receiverName: receiverName.trim(),
          message: content.trim(),
          santaId: santaId,
          createdAt: new Date(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('임명장 전송 실패:', err);
        show('임명장 전송에 실패했습니다.');
      }
    } catch (err) {
      console.error('임명장 전송 오류:', err);
      show('임명장 전송 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return { send, loading };
}
