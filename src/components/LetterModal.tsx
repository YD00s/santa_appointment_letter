'use client';
import { Letter } from '@/types/Letter';
import { useState } from 'react';

interface Props {
  recipientName: string;
  santaId: number;
  onSave: (letter: Letter) => void;
  onClose: () => void;
}

export default function LetterModal({ recipientName, santaId, onSave, onClose }: Props) {
  const [content, setContent] = useState('');
  const [authorId, setAuthorId] = useState('');

  const handleSave = () => {
    if (!authorId || !content) return console.log('작성자와 내용을 입력해주세요.');
    const letter: Letter = {
      id: Date.now().toString(),
      authorId,
      recipientName,
      content,
      santaId,
      createdAt: new Date().toISOString(),
    };
    onSave(letter);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-80 rounded-lg bg-white p-6">
        <h2 className="mb-2 text-lg font-bold">편지 작성</h2>
        <input
          placeholder="작성자 이름"
          className="mb-2 w-full rounded border p-1"
          value={authorId}
          onChange={e => setAuthorId(e.target.value)}
        />
        <textarea
          placeholder="편지 내용"
          className="mb-2 h-24 w-full rounded border p-1"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded border px-3 py-1">
            취소
          </button>
          <button onClick={handleSave} className="rounded bg-green-500 px-3 py-1 text-white">
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
