'use client';
import clsx from 'clsx';

type Theme = 'wall-1' | 'wall-2' | 'wall-3';
type Floor = 'floor-1' | 'floor-2' | 'floor-3';

interface Props {
  wallpaper: Theme;
  floor: Floor;
  objects: { id: string; x: number; y: number; type: string }[];
  onChange: (payload: { wallpaper?: Theme; floor?: Floor; objects?: Props['objects'] }) => void;
}

export default function RoomEditor({ wallpaper, floor, objects, onChange }: Props) {
  const addObject = (type: string) => {
    const newObj = {
      id: crypto.randomUUID(),
      x: 50,
      y: 50,
      type,
    };
    onChange({ objects: [...objects, newObj] });
  };

  const removeObject = (id: string) => {
    onChange({ objects: objects.filter(o => o.id !== id) });
  };

  return (
    <div>
      <div className="mb-4 flex gap-4">
        <div>
          <div className="mb-2 font-semibold">벽지</div>
          <div className="flex gap-2">
            {(['wall-1', 'wall-2', 'wall-3'] as Theme[]).map(w => (
              <button
                key={w}
                onClick={() => onChange({ wallpaper: w })}
                className={clsx(
                  'h-20 w-20 rounded-lg border',
                  wallpaper === w ? 'ring-2 ring-red-300' : 'border-gray-200'
                )}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 font-semibold">바닥</div>
          <div className="flex gap-2">
            {(['floor-1', 'floor-2', 'floor-3'] as Floor[]).map(f => (
              <button
                key={f}
                onClick={() => onChange({ floor: f })}
                className={clsx(
                  'h-20 w-20 rounded-lg border',
                  floor === f ? 'ring-2 ring-red-300' : 'border-gray-200'
                )}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 font-semibold">오브젝트 추가</div>
          <div className="flex gap-2">
            <button onClick={() => addObject('tree')} className="rounded bg-green-200 px-3 py-2">
              트리
            </button>
            <button onClick={() => addObject('snowman')} className="rounded bg-blue-200 px-3 py-2">
              눈사람
            </button>
            <button
              onClick={() => addObject('reindeer')}
              className="rounded bg-yellow-200 px-3 py-2"
            >
              루돌프
            </button>
          </div>
        </div>
      </div>

      {/* 실제 방 미리보기 영역 (간단한 예시) */}
      <div className="relative h-[420px] w-[720px] overflow-hidden rounded-xl border bg-white">
        {/* 배경 (wallpaper / floor)에 따라 클래스 추가 */}
        <div
          className={clsx(
            'absolute inset-0',
            wallpaper === 'wall-1' && 'bg-gradient-to-b from-[#fff7f0] to-[#fff3e0]',
            wallpaper === 'wall-2' && 'bg-gradient-to-b from-[#f0f8ff] to-[#e6f5ff]',
            wallpaper === 'wall-3' && 'bg-gradient-to-b from-[#f7fff3] to-[#ecffe9]'
          )}
        />

        {/* 배치된 오브젝트들은 단순 absolute로 렌더 */}
        {objects.map(o => (
          <div key={o.id} className="absolute">
            {/* 실제로는 이미지를 사용하고 드래그 기능 추가 가능 */}
            <div className="flex h-24 w-20 items-center justify-center rounded bg-white text-xs shadow">
              {o.type}
            </div>
            <button onClick={() => removeObject(o.id)} className="mt-1 text-xs text-red-500">
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
