'use client';

import TextArea from '@/components/TextArea';
import { useState } from 'react';

export default function SendPageContent() {
  const [letter, setLetter] = useState('');

  const send = async () => {
    // await fetch("/api/sendCertificate", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     id: params.id,
    //     letter,
    //   }),
    // });

    console.log('친구에게 임명장을 보냈어!');
  };

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold">편지 작성하기</h1>

      <TextArea
        value={letter}
        onChange={e => setLetter(e.target.value)}
        heightLines={8}
        maxLength={200}
        placeholder="친구에게 보낼 따뜻한 편지를 적어줘"
      />

      <button onClick={send} className="mt-8 w-full rounded-xl bg-red-600 py-3 text-lg text-white">
        임명장 보내기
      </button>
    </main>
  );
}
