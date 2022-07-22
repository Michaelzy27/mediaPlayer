import {
  LoadingOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import { RefObject, useCallback, useEffect, useState } from 'react';

export interface IFile extends Record<string, any> {
  src: string;
}

export const createIpfsURL = (srcStr?: string) : string | undefined => {
  if (typeof srcStr !== 'string') return;
  const ipfsURL = 'https://ipfs.blockfrost.dev/ipfs/';
  const ipfsPrefix = 'ipfs://';
  return srcStr && ipfsURL + srcStr.replace(ipfsPrefix, '');
};

const ButtonPlay = ({
  file,
  refVideo,
  onPlay,
}: {
  file: IFile;
  refVideo: RefObject<HTMLVideoElement>;
  onPlay?: Function;
}) => {
  const src = createIpfsURL(file?.src);
  const [wantToPlay, setWantToPlay] = useState<boolean>(false);
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);

  const isCurrent = src === refVideo.current?.src;
  const isLoaded = isCurrent && refVideo.current?.readyState === 4;
  const isPlaying = isCurrent && isLoaded && !refVideo.current?.paused;

  let icon = <PlayCircleOutlined className="text-2xl" />;
  if (isCurrent) {
    if (isPlaying) {
      icon = <PauseCircleOutlined className="text-2xl" />;
    } else if (!isLoaded) {
      icon = <LoadingOutlined className="text-2xl" />;
    }
  }
  const onLoadedData = useCallback(() => {
    const current = src === refVideo.current?.src;
    const loaded = current && refVideo.current?.readyState === 4;
    const playing = current && loaded && !refVideo.current?.paused;
    if (current && !playing) {
      if (wantToPlay) {
        refVideo.current?.play();
      }
    }
    forceUpdate();
  }, [wantToPlay, src, refVideo, forceUpdate]);
  const onPauseEvent = useCallback(() => {
    const current = src === refVideo.current?.src;
    const loaded = current && refVideo.current?.readyState === 4;
    const playing = current && loaded && !refVideo.current?.paused;
    if (playing !== isPlaying) {
      forceUpdate();
    }
  }, [isPlaying, src, refVideo, forceUpdate]);
  const onPlayEvent = useCallback(() => {
    const current = src === refVideo.current?.src;
    const loaded = current && refVideo.current?.readyState === 4;
    const playing = current && loaded && !refVideo.current?.paused;
    if (current) {
      onPlay?.();
    }
    if (playing !== isPlaying) {
      forceUpdate();
    }
  }, [isPlaying, src, refVideo, onPlay, forceUpdate]);

  useEffect(() => {
    const currentRef = refVideo.current;
    if (currentRef) {
      currentRef.addEventListener('loadeddata', onLoadedData);
      currentRef.addEventListener('play', onPlayEvent);
      currentRef.addEventListener('pause', onPauseEvent);
      return () => {
        if (currentRef) {
          currentRef.removeEventListener('loadeddata', onLoadedData);
          currentRef.removeEventListener('play', onPlayEvent);
          currentRef.removeEventListener('pause', onPauseEvent);
        }
      };
    }
  }, [refVideo, onPlayEvent, onLoadedData, onPauseEvent]);

  return (
    <Button
      icon={icon}
      className="w-12 h-12"
      onClick={() => {
        if (!isCurrent && refVideo.current && src) {
          refVideo.current.src = src;
        }
        setTimeout(() => {
          if (refVideo.current) {
            if (isCurrent && isPlaying) {
              refVideo.current.pause();
            } else if (isCurrent && isLoaded) {
              refVideo.current.play();
            } else {
              refVideo.current.load();
              setWantToPlay(true);
            }
            forceUpdate();
          }
        }, 0);
      }}
    />
  );
};

export default ButtonPlay;
