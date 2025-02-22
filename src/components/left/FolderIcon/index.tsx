import React, { memo } from '../../../lib/teact/teact';

import type { ApiChatFolder } from '../../../api/types';

import { ALL_FOLDER_ID } from '../../../config';
import buildClassName from '../../../util/buildClassName';
import ImgExistingChats from './images/folder_existing_chats@3x.png';
import ImgNewChats from './images/folder_new_chats@3x.png';
import ImgAirplane from './images/folders_airplane@3x.png';
import ImgAll from './images/folders_all@3x.png';
import ImgBook from './images/folders_book@3x.png';
import ImgBots from './images/folders_bots@3x.png';
import ImgCat from './images/folders_cat@3x.png';
import ImgChannels from './images/folders_channels@3x.png';
import ImgCrown from './images/folders_crown@3x.png';
import ImgCustom from './images/folders_custom@3x.png';
import ImgEdit from './images/folders_edit@3x.png';
import ImgFavorite from './images/folders_favorite@3x.png';
import ImgFlower from './images/folders_flower@3x.png';
import ImgGame from './images/folders_game@3x.png';
import ImgGroup from './images/folders_group@3x.png';
import ImgHome from './images/folders_home@3x.png';
import ImgLight from './images/folders_light@3x.png';
import ImgLike from './images/folders_like@3x.png';
import ImgLove from './images/folders_love@3x.png';
import ImgMask from './images/folders_mask@3x.png';
import ImgMoney from './images/folders_money@3x.png';
import ImgNote from './images/folders_note@3x.png';
import ImgPalette from './images/folders_palette@3x.png';
import ImgParty from './images/folders_party@3x.png';
import ImgPoo from './images/folders_poo@3x.png';
import ImgPrivate from './images/folders_private@3x.png';
import ImgSetup from './images/folders_setup@3x.png';
import ImgSport from './images/folders_sport@3x.png';
import ImgStudy from './images/folders_study@3x.png';
import ImgTrade from './images/folders_trade@3x.png';
import ImgTravel from './images/folders_travel@3x.png';
import ImgTypeArchived from './images/folders_type_archived@3x.png';
import ImgTypeBots from './images/folders_type_bots@3x.png';
import ImgTypeChannels from './images/folders_type_channels@3x.png';
import ImgTypeContacts from './images/folders_type_contacts@3x.png';
import ImgTypeGroups from './images/folders_type_groups@3x.png';
import ImgTypeMuted from './images/folders_type_muted@3x.png';
import ImgTypeNoncontacts from './images/folders_type_noncontacts@3x.png';
import ImgTypeRead from './images/folders_type_read@3x.png';
import ImgUnmuted from './images/folders_unmuted@3x.png';
import ImgUnread from './images/folders_unread@3x.png';
import ImgWork from './images/folders_work@3x.png';

import './FolderIcon.scss';

export enum FolderIcons {
  Group = ImgGroup,
  Trade = ImgTrade,
  ExistingChats = ImgExistingChats,
  Home = ImgHome,
  Travel = ImgTravel,
  NewChats = ImgNewChats,
  Light = ImgLight,
  TypeArchived = ImgTypeArchived,
  Airplane = ImgAirplane,
  Like = ImgLike,
  TypeBots = ImgTypeBots,
  All = ImgAll,
  Love = ImgLove,
  TypeChannels = ImgTypeChannels,
  Book = ImgBook,
  Mask = ImgMask,
  TypeContacts = ImgTypeContacts,
  Bots = ImgBots,
  Money = ImgMoney,
  TypeGroups = ImgTypeGroups,
  Cat = ImgCat,
  Note = ImgNote,
  TypeMuted = ImgTypeMuted,
  Channels = ImgChannels,
  Palette = ImgPalette,
  TypeNoncontacts = ImgTypeNoncontacts,
  Crown = ImgCrown,
  Party = ImgParty,
  TypeRead = ImgTypeRead,
  Custom = ImgCustom,
  Poo = ImgPoo,
  Unmuted = ImgUnmuted,
  Edit = ImgEdit,
  Private = ImgPrivate,
  Unread = ImgUnread,
  Favorite = ImgFavorite,
  Setup = ImgSetup,
  Work = ImgWork,
  Flower = ImgFlower,
  Sport = ImgSport,
  Game = ImgGame,
  Study = ImgStudy,
}

export const emoticonImageMapping: [string, FolderIcons][] = [
  ['🍸', FolderIcons.Party],
  ['👤', FolderIcons.Private],
  ['👥', FolderIcons.Group],
  ['📢', FolderIcons.Channels],
  ['💬', FolderIcons.All],
  ['✅', FolderIcons.TypeRead],
  ['☑️', FolderIcons.Unread],
  ['🔔', FolderIcons.Unmuted],
  // ['🗂', FolderIcons.Custom],
  ['📁', FolderIcons.Custom],
  ['🤖', FolderIcons.Bots],
  ['🐱', FolderIcons.Cat],
  ['📕', FolderIcons.Book],
  ['💰', FolderIcons.Money],
  ['📸', FolderIcons.Crown],
  ['🎮', FolderIcons.Game],
  ['🏡', FolderIcons.Home],
  ['💡', FolderIcons.Light],
  ['👍', FolderIcons.Like],
  // ['🔒', FolderIcons.Custom],
  ['❤️', FolderIcons.Love],
  ['➕', FolderIcons.Trade],
  ['🎵', FolderIcons.Note],
  ['🎨', FolderIcons.Palette],
  ['✈', FolderIcons.Travel],
  ['⚽', FolderIcons.Sport],
  ['⭐', FolderIcons.Favorite],
  ['🎓', FolderIcons.Study],
  ['🛫', FolderIcons.Airplane],
  ['💼', FolderIcons.Work],
  ['🍷', FolderIcons.Party],
  ['🎭', FolderIcons.Mask],
];
const emoticonToImage = new Map(emoticonImageMapping);

type OwnProps = {
  active?: boolean;
  icon: FolderIcons;
  className?: string;
  clickable?: boolean;
};

function FolderIcon({
  active,
  icon,
  className,
  clickable,
}: OwnProps) {
  return (
    <div className={buildClassName('FolderIcon', clickable && 'FolderIcon__clickable', className)}>
      <div className="FolderIcon--layer FolderIcon--layer__bg">
        <img className="FolderIcon--image" src={icon.toString()} alt="" />
      </div>
      <div className={buildClassName(
        'FolderIcon--layer',
        'FolderIcon--layer__fg',
        active && 'FolderIcon--layer__fg_active',
      )}
      >
        <img className="FolderIcon--image" src={icon.toString()} alt="" />
      </div>
    </div>
  );
}

export function emoticonForIcon(icon: FolderIcons) {
  const item = emoticonImageMapping.find(([, i]) => i === icon);
  if (item) {
    return item[0];
  } else {
    return '';
  }
}

export function iconForFolder(folder: Partial<ApiChatFolder>): FolderIcons {
  const icon = emoticonToImage.get(folder.emoticon || '');
  if (icon) {
    return icon;
  }
  if (folder.id === ALL_FOLDER_ID) {
    return FolderIcons.ExistingChats;
  } else if (folder.excludeRead) {
    return FolderIcons.Unread;
  } else if (folder.excludeMuted) {
    return FolderIcons.Unmuted;
  } if (folder.contacts) {
    return FolderIcons.Private;
  } else if (folder.nonContacts) {
    return FolderIcons.TypeNoncontacts;
  } else if (folder.groups) {
    return FolderIcons.Group;
  } else if (folder.channels) {
    return FolderIcons.Channels;
  } else if (folder.bots) {
    return FolderIcons.Bots;
  }
  return FolderIcons.Custom;
}

export default memo(FolderIcon);
