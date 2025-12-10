'use client';

import React from 'react';

import Divider from '../Divider';
import TabMenu from './TabMenu';
import { useTab } from './hooks/useTab';

interface TabProps {
  tabs: string[];
  contents: Record<string, React.ReactNode>;
}

const Tab = React.forwardRef<HTMLDivElement, TabProps>(function Tab(
  { tabs, contents, ...props },
  ref
) {
  const { activeTab, handleTabClick } = useTab(tabs[0]);
  return (
    <div ref={ref} className="relative w-full" {...props}>
      <div className="flex justify-center">
        <TabMenu
          menus={tabs}
          onClick={e => handleTabClick((e.target as HTMLButtonElement).innerText)}
          activeTab={activeTab}
        />
      </div>
      <div className="absolute w-full -translate-y-0.5">
        <Divider />
      </div>
      {/* 탭에 따라 콘텐츠 변경 */}
      <div className="mt-8 px-6">{contents[activeTab] ?? null}</div>
    </div>
  );
});

export default Tab;
