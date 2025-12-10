'use client';

import Tab from '@/components/Tab/Tab';

import ThumbnailList from './ThumbnailList';

interface EditTabProps {
  isEditMode: boolean;
  wallImages: string[];
  floorImages: string[];
  objectImages: string[];
  setWallType: (idx: number) => void;
  setFloorType: (idx: number) => void;
  setObjectType: (idx: number) => void;
}

export default function EditTab({
  isEditMode,
  wallImages,
  floorImages,
  objectImages,
  setWallType,
  setFloorType,
  setObjectType,
}: EditTabProps) {
  if (!isEditMode) return null;

  return (
    <div className="pt-3">
      <Tab
        tabs={['벽지', '오브젝트', '바닥']}
        contents={{
          벽지: <ThumbnailList images={wallImages} onSelect={setWallType} height={15} />,
          오브젝트: <ThumbnailList images={objectImages} onSelect={setObjectType} height={22} />,
          바닥: <ThumbnailList images={floorImages} onSelect={setFloorType} height={5} />,
        }}
      />
    </div>
  );
}
