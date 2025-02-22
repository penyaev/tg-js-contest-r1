import type { RefObject } from 'react';
import React, {
  memo, useCallback, useEffect, useRef,
} from '../../../../lib/teact/teact';

import type { FolderIcons } from '../../FolderIcon';

import Button from '../../../ui/Button';
import Menu from '../../../ui/Menu';
import FolderIcon, { emoticonImageMapping } from '../../FolderIcon';

import './FolderIconPicker.scss';

type OwnProps = {
  isOpen: boolean;
  pickerButtonRef: RefObject<HTMLButtonElement>;
  onFolderIconSelect: (icon: FolderIcons) => void;
  onClose: () => void;
  active: FolderIcons;
};
type StateProps = {};

function FolderIconPicker({
  isOpen,
  pickerButtonRef,
  onFolderIconSelect,
  onClose,
  active,
}: OwnProps & StateProps) {
  const transformOriginX = useRef<number>();
  useEffect(() => {
    transformOriginX.current = pickerButtonRef.current!.getBoundingClientRect().right;
  }, [isOpen, pickerButtonRef]);

  const handleFolderIconClick = useCallback((icon: FolderIcons) => {
    onFolderIconSelect(icon);
    onClose();
  }, [onClose, onFolderIconSelect]);
  return (
    <Menu
      isOpen={isOpen}
      noCompact
      positionX="right"
      // bubbleClassName={styles.menuContent}
      onClose={onClose}
      // transformOriginX={transformOriginX.current}
      // noCloseOnBackdrop={isContextMenuShown}
    >
      <div className="FolderIconPicker--container">
        {emoticonImageMapping.map(([, icon]) => {
          return (
            <Button
              key={icon}
              round
              size="smaller"
              color="translucent"
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => handleFolderIconClick(icon)}
            >
              <FolderIcon
                icon={icon}
                active={active === icon}
              />
            </Button>
          );
        })}
      </div>
    </Menu>

  );
}

export default memo(FolderIconPicker);
