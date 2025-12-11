'use client';

import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import { useEffect, useState } from 'react';

import EditTab from './components/EditTab';
import Room from './components/Room';

export default function MyPageContent() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [wallType, setWallType] = useState(0);
  const [objectType, setObjectType] = useState(0);
  const [floorType, setFloorType] = useState(0);

  useEffect(() => {
    const mockCertificates = Array.from({ length: 27 }).map((_, i) => {
      const santaType = (i % 8) + 1;
      const santaIconMap: Record<number, string> = {
        1: '🎅',
        2: '🧝',
        3: '🦌',
        4: '🎁',
        5: '🌟',
        6: '❄️',
        7: '🍪',
        8: '🔔',
      };
      return {
        id: i + 1,
        santaType,
        santaTypeName: `산타 타입 ${santaType}`,
        icon: santaIconMap[santaType],
        description: `이것은 산타 타입 ${santaType}에 대한 설명입니다.`,
        letter: `임명장 내용 예시 ${i + 1}번\n산타 타입 ${santaType}의 능력을 소유하고 있습니다!`,
      };
    });
    setCertificates(mockCertificates);
  }, []);

  const wallImages = [
    '/assets/images/wall1.png',
    '/assets/images/wall2.png',
    '/assets/images/wall3.png',
  ];
  const floorImages = [
    '/assets/images/floor1.png',
    '/assets/images/floor2.png',
    '/assets/images/floor3.png',
  ];
  const objectImages = [
    '/assets/images/Snowman.png',
    '/assets/images/Rudolph.png',
    '/assets/images/Tree.png',
  ];

  const toggleEditMode = () => setIsEditMode(!isEditMode);
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      console.log('페이지 링크가 복사되었습니다!');
    } catch (err) {
      console.error(err);
      console.log('복사에 실패했습니다. 브라우저에서 지원되지 않을 수 있습니다.');
    }
  };

  const closeModal = () => setSelected(null);

  return (
    <>
      <div className="relative flex h-190 w-full flex-col border">
        <div>
          <Room
            wallType={wallType}
            floorType={floorType}
            objectType={objectType}
            wallImages={wallImages}
            floorImages={floorImages}
            objectImages={objectImages}
            certificates={certificates}
            onSelectCertificate={setSelected}
          />
        </div>
        {/* 타이틀 */}
        <div className="absolute top-0 z-10 flex w-full justify-start p-2">
          <div className="flex flex-col items-start">
            <h1 className="w-fit rounded bg-[#b59059] px-3 py-2 text-3xl font-bold shadow-md">
              내 산타 작업실
            </h1>
            <span>산타 임명장을 {certificates.length}개 받았어요!</span>
          </div>
        </div>

        {/* 하단 메뉴: Room 안쪽에 넣으면 항상 Room 위에 떠있음 */}
        <div className="absolute bottom-0 left-0 flex w-full justify-between p-4">
          <Button
            label="방 꾸미기"
            className="mr-2 w-1/2"
            onClick={e => {
              toggleEditMode();
              (e.currentTarget as HTMLButtonElement).blur(); // 클릭 후 포커스 제거
            }}
          />
          <Button
            label="공유하기"
            className="ml-2 w-1/2"
            onClick={e => {
              copyLink();
              (e.currentTarget as HTMLButtonElement).blur();
            }}
          />
        </div>
        <div className="absolute -bottom-105 w-full bg-white">
          <EditTab
            isEditMode={isEditMode}
            wallImages={wallImages}
            floorImages={floorImages}
            objectImages={objectImages}
            setWallType={setWallType}
            setFloorType={setFloorType}
            setObjectType={setObjectType}
          />
        </div>
      </div>
      <Modal open={!!selected} onClose={closeModal}>
        {selected && (
          <>
            <h2 className="mb-3 text-2xl font-bold">{selected.santaTypeName}</h2>
            <p className="mb-4 whitespace-pre-line text-gray-700">{selected.description}</p>
            <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">{selected.letter}</div>
          </>
        )}
      </Modal>
    </>
  );
}
