'use client';
import { formatQuestionTitle } from '@/lib/questions';

interface Props {
  number: number;
  title: string;
  ownerName: string;
  items: string[];
  selected?: number;
  onSelect: (index: number) => void;
}

export default function QuestionCard({
  number,
  title,
  ownerName,
  items,
  selected,
  onSelect,
}: Props) {
  return (
    <div className="border-gray200 rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold">
        {number + 1}. {formatQuestionTitle(title, ownerName)}
      </h2>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`w-full cursor-pointer rounded-lg border p-4 text-left whitespace-pre-line transition ${
              selected === idx ? 'border-red500 bg-red50' : 'border-gray200 hover:bg-gray100'
            } `}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
