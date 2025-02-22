import React, { memo } from '../../lib/teact/teact';

import type { ApiChatFolder } from '../../api/types';
import type { TabWithProperties } from '../ui/TabList';

import buildClassName from '../../util/buildClassName';

import ChatFoldersSidebarItem from './ChatFoldersSidebarItem';

import './ChatFoldersSidebar.scss';

type OwnProps = {
  tabs: readonly TabWithProperties[];
  folders: ApiChatFolder[];
  activeTab: number;
  onSwitchFolder: (index: number) => void;
};
type StateProps = {};

function ChatFoldersSidebar({
  tabs,
  folders,
  activeTab,
  onSwitchFolder,
}: OwnProps & StateProps) {
  return (
    <div className={buildClassName('ChatFoldersSidebar')}>
      {tabs.map((tab, index) => {
        const folder = folders.find((f) => f.id === tab.id)!;
        return (
          <ChatFoldersSidebarItem
            folder={folder}
            clickArg={index}
            onClick={onSwitchFolder}
            key={tab.id}
            tab={tab}
            selected={activeTab === index}
          />
        );
      })}
    </div>
  );
}
export default memo(ChatFoldersSidebar);
