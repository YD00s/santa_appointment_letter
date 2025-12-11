'use client';

import TextArea from '@/components/TextArea';
import { supabase } from '@/lib/supabase/supabase';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SendPageContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = params.userId as string;

  const [letter, setLetter] = useState('');
  const [nickname, setNickname] = useState('');
  const [result, setResult] = useState<any>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // URL에서 결과 데이터 가져오기
    const resultData = searchParams.get('data');
    if (resultData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(resultData));
        setResult(parsed);
      } catch (error) {
        console.error('결과 데이터 파싱 실패:', error);
        router.push(`/mypage/${userId}/questions`);
      }
    } else {
      // 결과가 없으면 질문 페이지로 리다이렉트
      router.push(`/mypage/${userId}/questions`);
    }
  }, [searchParams, router, userId]);

  const send = async () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요!');
      return;
    }

    if (!letter.trim()) {
      alert('편지 내용을 입력해주세요!');
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.from('messages').insert({
        receiver_id: userId,
        sender_nickname: nickname.trim(),
        content: letter.trim(),
        santa_type: result?.type || '1',
        santa_type_name: result?.title || '산타',
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error('임명장 전송 실패:', error);
        alert('임명장 전송에 실패했습니다. 다시 시도해주세요.');
      } else {
        alert('✅ 임명장이 전송되었습니다!');
        router.push(`/mypage/${userId}`);
      }
    } catch (error) {
      console.error('임명장 전송 오류:', error);
      alert('임명장 전송 중 오류가 발생했습니다.');
    } finally {
      setSending(false);
    }
  };

  if (!result) return null;

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold">편지 작성하기</h1>

      {/* 결과 요약 */}
      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <p className="text-sm text-gray-600">
          당신의 결과: <span className="font-semibold text-gray-900">{result.title}</span>
        </p>
      </div>

      {/* 닉네임 입력 */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-semibold text-gray-700">당신의 닉네임</label>
        <input
          type="text"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          placeholder="닉네임을 입력하세요"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          maxLength={20}
        />
      </div>

      {/* 편지 입력 */}
      <TextArea
        value={letter}
        onChange={e => setLetter(e.target.value)}
        heightLines={8}
        maxLength={200}
        placeholder="친구에게 보낼 따뜻한 편지를 적어줘"
      />

      <button
        onClick={send}
        disabled={sending}
        className="mt-8 w-full rounded-xl bg-red-600 py-3 text-lg text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? '전송 중...' : '임명장 보내기'}
      </button>
    </main>
  );
}