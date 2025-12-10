import { useState } from 'react';

export function useTab<T extends string>(initialTab: T) {
  const [activeTab, setActiveTab] = useState<T>(initialTab);

  const handleTabClick = (tab: T) => {
    setActiveTab(tab);
  };

  return {
    activeTab,
    handleTabClick,
  };
}
