'use client';

import { floorImages, objectImages, wallImages } from '@/lib/constants/images';
import { RoomConfig, RoomImages } from '@/types/RoomAssets';
import { useMemo, useState } from 'react';

export function useRoomConfig(initialConfig: RoomConfig) {
  const [config, setConfig] = useState<RoomConfig>({
    wallType: initialConfig.wallType,
    floorType: initialConfig.floorType,
    objectType: initialConfig.objectType,
  });

  // 현재 선택된 이미지들
  const currentImages = useMemo<RoomImages>(
    () => ({
      wall: wallImages[config.wallType],
      floor: floorImages[config.floorType],
      object: objectImages[config.objectType],
    }),
    [config.wallType, config.floorType, config.objectType]
  );

  const updateWallType = (type: number) => {
    setConfig(prev => ({ ...prev, wallType: type }));
  };

  const updateFloorType = (type: number) => {
    setConfig(prev => ({ ...prev, floorType: type }));
  };

  const updateObjectType = (type: number) => {
    setConfig(prev => ({ ...prev, objectType: type }));
  };

  return {
    config,
    currentImages,
    updateWallType,
    updateFloorType,
    updateObjectType,
  };
}
