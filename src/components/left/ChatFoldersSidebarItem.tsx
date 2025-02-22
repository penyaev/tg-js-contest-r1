import React, { memo, useRef } from '../../lib/teact/teact';

import type { ApiChatFolder } from '../../api/types';
import type { TabWithProperties } from '../ui/TabList';

import buildClassName from '../../util/buildClassName';
import { MouseButton } from '../../util/windowEnvironment';

import useContextMenuHandlers from '../../hooks/useContextMenuHandlers';
import { useFastClick } from '../../hooks/useFastClick';
import useLastCallback from '../../hooks/useLastCallback';

import Menu from '../ui/Menu';
import MenuItem from '../ui/MenuItem';
import MenuSeparator from '../ui/MenuSeparator';
import FolderIcon, { iconForFolder } from './FolderIcon';

type OwnProps = {
  selected: boolean;
  tab: TabWithProperties;
  folder: ApiChatFolder;
  onClick: (id: any) => void;
  clickArg: any;
};
type StateProps = {};

function ChatFoldersSidebarItem({
  selected,
  tab,
  folder,
  onClick,
  clickArg,
}: OwnProps & StateProps) {
  // eslint-disable-next-line no-null/no-null
  const ref = useRef<HTMLDivElement>(null);

  // const handleClick = useCallback(() => {
  //   onClick(clickArg);
  // }, [onClick, clickArg]);

  const {
    contextMenuAnchor, handleContextMenu, handleBeforeContextMenu, handleContextMenuClose,
    handleContextMenuHide, isContextMenuOpen,
  } = useContextMenuHandlers(ref, !tab.contextActions);

  const getTriggerElement = useLastCallback(() => ref.current);
  const getRootElement = useLastCallback(
    () => document.body,
  );
  const getMenuElement = useLastCallback(
    () => document.querySelector('#portals')!.querySelector('.Tab-context-menu .bubble'),
  );
  const getLayout = useLastCallback(() => ({ withPortal: true }));

  const { handleClick, handleMouseDown } = useFastClick((e: React.MouseEvent<HTMLDivElement>) => {
    if (tab.contextActions && (e.button === MouseButton.Secondary || !onClick)) {
      handleBeforeContextMenu(e);
    }

    if (e.type === 'mousedown' && e.button !== MouseButton.Main) {
      return;
    }

    onClick?.(clickArg!);
  });

  return (
    <div
      key={tab.id}
      ref={ref}
      className={buildClassName(
        'ChatFoldersSidebar--folder',
        selected && 'ChatFoldersSidebar--folder__selected',
      )}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
    >
      <div className="ChatFoldersSidebar--folder-icon">
        <FolderIcon
          active={selected}
          icon={iconForFolder(folder)}
          clickable
        />
      </div>
      <div className="ChatFoldersSidebar--folder-title">{tab.title}</div>
      {tab.badgeCount && <div className="ChatFoldersSidebar--folder-badge">{tab.badgeCount}</div>}

      {tab.contextActions && contextMenuAnchor !== undefined && (
        <Menu
          isOpen={isContextMenuOpen}
          anchor={contextMenuAnchor}
          getTriggerElement={getTriggerElement}
          getRootElement={getRootElement}
          getMenuElement={getMenuElement}
          getLayout={getLayout}
          className="Tab-context-menu"
          autoClose
          onClose={handleContextMenuClose}
          onCloseAnimationEnd={handleContextMenuHide}
          withPortal
        >
          {tab.contextActions.map((action) => (
            ('isSeparator' in action) ? (
              <MenuSeparator key={action.key || 'separator'} />
            ) : (
              <MenuItem
                key={action.title}
                icon={action.icon}
                destructive={action.destructive}
                disabled={!action.handler}
                onClick={action.handler}
              >
                {action.title}
              </MenuItem>
            )
          ))}
        </Menu>
      )}
    </div>
  );
}

export default memo(ChatFoldersSidebarItem);
