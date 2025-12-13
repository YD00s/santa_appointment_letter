'use client';

import Tab from '@/components/Tab/Tab';

import ThumbnailList from './ThumbnailList';

interface EditTabProps {
  isEditMode: boolean;
  wallImages: string[];
  floorImages: string[];
  objectImages: string[];
  currentWallType: number;
  currentFloorType: number;
  currentObjectType: number;
  onWallTypeChange: (type: number) => void;
  onFloorTypeChange: (type: number) => void;
  onObjectTypeChange: (type: number) => void;
}

export default function EditTab({
  isEditMode,
  wallImages,
  floorImages,
  objectImages,
  currentWallType,
  currentFloorType,
  currentObjectType,
  onWallTypeChange,
  onFloorTypeChange,
  onObjectTypeChange,
}: EditTabProps) {
  if (!isEditMode) return null;

  return (
    <div className="h-100 pt-3">
      <Tab
        tabs={['벽지', '오브젝트', '바닥']}
        contents={{
          벽지: (
            <ThumbnailList
              images={wallImages}
              selectedIndex={currentWallType}
              onSelect={onWallTypeChange}
              height={12}
            />
          ),
          오브젝트: (
            <ThumbnailList
              images={objectImages}
              selectedIndex={currentObjectType}
              onSelect={onObjectTypeChange}
              height={14}
              layout="object-contain"
            />
          ),
          바닥: (
            <ThumbnailList
              images={floorImages}
              selectedIndex={currentFloorType}
              onSelect={onFloorTypeChange}
              height={5}
            />
          ),
        }}
      />
    </div>
  );
}
