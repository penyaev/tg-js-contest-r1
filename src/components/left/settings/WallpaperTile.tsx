import { inflate } from 'pako';
import type { FC } from '../../../lib/teact/teact';
import React, {
  memo, useCallback, useEffect, useRef,
  useState,
} from '../../../lib/teact/teact';

import type { ApiWallpaper } from '../../../api/types';
import type { ThemeKey } from '../../../types';
import { UPLOADING_WALLPAPER_SLUG } from '../../../types';

import { CUSTOM_BG_CACHE_NAME } from '../../../config';
import buildClassName from '../../../util/buildClassName';
import * as cacheApi from '../../../util/cacheApi';
import { numberToHexColor } from '../../../util/colors';
import { fetchBlob } from '../../../util/files';

import useCanvasBlur from '../../../hooks/useCanvasBlur';
import useMedia from '../../../hooks/useMedia';
import useMediaWithLoadProgress from '../../../hooks/useMediaWithLoadProgress';
import usePreviousDeprecated from '../../../hooks/usePreviousDeprecated';
import useShowTransitionDeprecated from '../../../hooks/useShowTransitionDeprecated';

import AnimatedBackground from '../../middle/AnimatedBackground';
import ProgressSpinner from '../../ui/ProgressSpinner';

import './WallpaperTile.scss';

type OwnProps = {
  wallpaper: ApiWallpaper;
  theme: ThemeKey;
  isSelected: boolean;
  onClick: (slug: string) => void;
};

const WallpaperTile: FC<OwnProps> = ({
  wallpaper,
  theme,
  isSelected,
  onClick,
}) => {
  const { slug, document } = wallpaper;
  const localMediaHash = `wallpaper${document.id!}`;
  const localBlobUrl = document.previewBlobUrl;
  const previewBlobUrl = useMedia(`${localMediaHash}?size=m`);
  const thumbRef = useCanvasBlur(document.thumbnail?.dataUri, Boolean(previewBlobUrl), true);
  const { transitionClassNames } = useShowTransitionDeprecated(
    Boolean(previewBlobUrl || localBlobUrl),
    undefined,
    undefined,
    'slow',
  );
  const isLoadingRef = useRef(false);
  const [isLoadAllowed, setIsLoadAllowed] = useState(false);
  const {
    mediaData: fullMedia, loadProgress,
  } = useMediaWithLoadProgress(localMediaHash, !isLoadAllowed);
  const wasLoadDisabled = usePreviousDeprecated(isLoadAllowed) === false;
  const { shouldRender: shouldRenderSpinner, transitionClassNames: spinnerClassNames } = useShowTransitionDeprecated(
    (isLoadAllowed && !fullMedia) || slug === UPLOADING_WALLPAPER_SLUG,
    undefined,
    wasLoadDisabled,
    'slow',
  );
  // To prevent triggering of the effect for useCallback
  const cacheKeyRef = useRef<string>();
  cacheKeyRef.current = theme;

  const handleSelect = useCallback(() => {
    (async () => {
      let blob = await fetchBlob(fullMedia!);
      if (blob.type === 'application/x-tgwallpattern') {
        const buffer = await blob.arrayBuffer();
        const inflated = inflate(buffer);
        blob = new Blob([inflated], { type: 'image/svg+xml' });
      }
      await cacheApi.save(CUSTOM_BG_CACHE_NAME, cacheKeyRef.current!, blob);
      onClick(slug);
    })();
  }, [fullMedia, onClick, slug]);

  useEffect(() => {
    // If we've clicked on a wallpaper, select it when full media is loaded
    if (fullMedia && isLoadingRef.current) {
      handleSelect();
      isLoadingRef.current = false;
    }
  }, [fullMedia, handleSelect]);

  const handleClick = useCallback(() => {
    if (fullMedia) {
      handleSelect();
    } else {
      isLoadingRef.current = true;
      setIsLoadAllowed((isAllowed) => !isAllowed);
    }
  }, [fullMedia, handleSelect]);

  const className = buildClassName(
    'WallpaperTile',
    isSelected && 'selected',
  );

  const backgroundColors = [
    wallpaper.settings?.backgroundColor,
    wallpaper.settings?.secondBackgroundColor,
    wallpaper.settings?.thirdBackgroundColor,
    wallpaper.settings?.fourthBackgroundColor,
  ].filter(Boolean).map(numberToHexColor);

  const animatedBackground = wallpaper.pattern && backgroundColors.length >= 3;
  return (
    <div className={className} onClick={handleClick}>
      <div className="media-inner">
        {animatedBackground && (
          <AnimatedBackground
            colors={backgroundColors}
            trigger={0}
          />
        )}
        <canvas
          ref={thumbRef}
          className="thumbnail"
        />
        <img
          src={previewBlobUrl || localBlobUrl}
          className={buildClassName('full-media', transitionClassNames, animatedBackground && 'animatedBackground')}
          alt=""
          draggable={false}
        />
        {shouldRenderSpinner && (
          <div className={buildClassName('spinner-container', spinnerClassNames)}>
            <ProgressSpinner progress={loadProgress} onClick={handleClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(WallpaperTile);
