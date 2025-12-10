// 선택 문항 UI 컴포넌트
'use client';
import clsx from 'clsx';

interface Props {
  title: string;
  options: string[];
  value: string | null;
  onChange: (v: string) => void;
}

export default function OptionGroup({ title, options, value, onChange }: Props) {
  return (
    <div className="mb-10">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <div className="flex flex-col gap-3">
        {options.map(op => (
          <button
            key={op}
            onClick={() => onChange(op)}
            className={clsx(
              'rounded-xl border p-4 text-left transition',
              value === op
                ? 'border-red-400 bg-red-100'
                : 'border-gray-300 bg-white hover:bg-gray-50'
            )}
          >
            {op}
          </button>
        ))}
      </div>
    </div>
  );
}
