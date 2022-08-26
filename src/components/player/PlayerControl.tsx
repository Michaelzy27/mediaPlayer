import { RefObject, useCallback, useEffect, useState } from 'react';
import * as React from 'react';
import { Button, Popover } from 'antd';
import {
  LoadingOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined
} from '@ant-design/icons';
import Slider from './Slider';
import { SongInfo } from './player-types';
import { TbArrowsShuffle2, TbRepeat, TbRepeatOff, TbRepeatOnce, TbVolume, TbVolumeOff } from 'react-icons/all';
import classNames from 'classnames';

export enum REPEAT_MODE {
  NONE = 'NONE',
  REPEAT = 'REPEAT',
  ONE = 'ONE',
}

export const PlayerControl = (props:{
  refVideo: RefObject<HTMLVideoElement>;
  repeatMode: REPEAT_MODE;
  isShuffle: boolean,
  onShuffle: () => void,
  onPrevSong: () => void;
  onNextSong: () => void;
  onPlay: () => void;
  onPause: () => void;
  onRepeat: () => void;
  file?: {src: string};
  songInfo: SongInfo;
  isPlaying: boolean;
  loading: boolean;
} ) => {
  const { refVideo, onPrevSong, onNextSong, file, songInfo } = props;
  const el = refVideo.current;
  if (file == null || el == null) {
    return <></>;
  }

  return <div
    className='flex flex-col justify-around h-16 backdrop-saturate-[180%] backdrop-blur-[30px] bg-black fixed inset-x-0 bottom-0 z-[100]'>
    <SongSliderControl refVideo={refVideo} />
    <div className='flex flex-row h-full px-4 z-[-1] w-full justify-between'>
      <div className='flex justify-left items-center'>
        <Button
          onClick={onPrevSong}
          className='mx-2 my-0'
          icon={<StepBackwardOutlined className='text-2xl' />}
        />
        <ButtonPlay isPlaying={props.isPlaying} onClick={() => props.isPlaying ? props.onPause() : props.onPlay()} loading={props.loading}/>
        <Button
          onClick={onNextSong}
          className='mx-2 my-0'
          icon={<StepForwardOutlined className='text-2xl' />}
        />
      </div>
      <TrackInfo songInfo={songInfo} />
      <RightGroupControl repeatMode={props.repeatMode}
                         isShuffle={props.isShuffle}
                         onShuffle={props.onShuffle}
                         onRepeat={props.onRepeat}
                         refVideo={refVideo} />
    </div>
  </div>;
};

/* Player control start */
const TrackInfo = ({ songInfo }: { songInfo: SongInfo }) => {
  return (
    <div className='flex items-center justify-center'>
      <img
        src={songInfo.thumbnail}
        alt={songInfo.title}
        className='h-[46px] rounded-[5px]'
      />

      <div className='flex md:flex flex-col justify-center h-[46px] ml-3'>
        <div className='font-semibold text-base text-[color:var(--color-text)] opacity-90 mb-1 truncate'>
          {songInfo.title}
        </div>
        <div className='text-xs opacity-60 text-[color:var(--color-text)] truncate'>
          {songInfo.artistsNames}
        </div>
      </div>
    </div>
  );
};

const SongSliderControl = ({ refVideo }: {
  refVideo: RefObject<HTMLVideoElement>;
}) => {
  const [progress, setProgress] = useState<number>(
    refVideo.current?.currentTime || 0
  );
  const loadProgress = useCallback(() => {
    const current = refVideo.current;
    if (current) {
      const loadedPercentage = current.currentTime / current.duration;
      setProgress(loadedPercentage);
    }
  }, [refVideo, setProgress]);
  useEffect(() => {
    const current = refVideo.current;
    if (current) {
      current.addEventListener('timeupdate', loadProgress);
      return () => {
        current.removeEventListener('timeupdate', loadProgress);
      };
    }
  }, [refVideo, loadProgress]);
  return (
    <Slider
      setWidth={'100%'}
      setHeight={'2px'}
      percentSlider={progress * 100}
      toogleTooltip={true}
      currentTimeSongTooltip={progress * (refVideo.current?.duration || 0)}
      getPercentSlider={(value: number) => {
        if (refVideo.current) {
          refVideo.current.currentTime =
            (value / 100) * refVideo.current.duration;
        }
      }}
    />
  );
};

const RightGroupControl = ({ refVideo, ...props }: {
  repeatMode: REPEAT_MODE,
  onRepeat: () => void,
  isShuffle: boolean,
  onShuffle: () => void,
  refVideo: RefObject<HTMLVideoElement>
}) => {
  const [isPopoverVisible, setPopoverVisible] = useState<boolean>(false);

  const content = (
    <div className='justify-center items-center flex gap-2'>
      <RepeatControl mode={props.repeatMode} onClick={props.onRepeat} />
      <ShuffleControl isShuffle={props.isShuffle} onClick={props.onShuffle} />
      <VolumeControl refVideo={refVideo} />
      <VolumeSliderControl refVideo={refVideo} />
    </div>
  );

  return (
    <div className='justify-center items-center ml-4 flex'>
      <div className='justify-center items-center hidden sm:flex gap-2'>
        <RepeatControl mode={props.repeatMode} onClick={props.onRepeat} />
        <ShuffleControl isShuffle={props.isShuffle} onClick={props.onShuffle} />
        <VolumeControl refVideo={refVideo} />
        <VolumeSliderControl refVideo={refVideo} />
      </div>
      <Popover
        placement='right'
        onVisibleChange={(visible) => {
          setPopoverVisible(visible);
        }}
        content={content}
      >
        <Button className='sm:hidden' icon={<i className='ri-arrow-left-s-fill text-lg'></i>} />
      </Popover>
    </div>
  );
};

const iconClass = 'h-6 w-6 ';
const buttonClass = 'p-1.5 border rounded-md hover:bg-slate-700 cursor-pointer';

const RepeatControl = (props: {
  mode: REPEAT_MODE,
  onClick: () => void,
}) => {
  return (
    <div
      onClick={props.onClick}
      className={buttonClass}
    >
      {props.mode === REPEAT_MODE.REPEAT ? <TbRepeat className={iconClass} /> :
        props.mode === REPEAT_MODE.NONE ? <TbRepeatOff className={iconClass} /> :
          <TbRepeatOnce className={iconClass} />}
    </div>
  );
};

const ShuffleControl = (props: {
  isShuffle: boolean,
  onClick: () => void,
}) => {
  return (
    <div
      onClick={props.onClick}
      className={classNames(buttonClass, {
        'bg-slate-500': props.isShuffle
      })}
    >
      <TbArrowsShuffle2 className={iconClass} />
    </div>
  );
};

const VolumeControl = ({ refVideo }: {
  refVideo: RefObject<HTMLVideoElement>;
}) => {
  const [muted, setMuted] = useState<boolean>(refVideo.current?.muted ?? false);
  const handleMuteVolume = () => {
    setMuted(!muted);
  };
  useEffect(() => {
    if (refVideo.current) {
      refVideo.current.muted = muted;
    }
  }, [muted, refVideo]);
  return (
    <div
      onClick={handleMuteVolume}
      className={classNames(buttonClass, {
      })}
    >
      {muted ? <TbVolumeOff className={iconClass}/> :
      <TbVolume className={iconClass} />}
    </div>
  );
};

const VolumeSliderControl = ({ refVideo }: {
  refVideo: RefObject<HTMLVideoElement>;
}) => {
  const [volume, setVolume] = useState<number>(refVideo.current?.volume || 0.5);
  useEffect(() => {
    if (refVideo.current) {
      refVideo.current.volume = volume;
    }
  }, [refVideo, volume]);
  return (
    <Slider
      setWidth={'84px'}
      setHeight={'4px'}
      percentSlider={volume * 100}
      toogleTooltip={false}
      getPercentSlider={(value: number) => {
        setVolume(value / 100);
      }}
    />
  );
};

const ButtonPlay = (props: {
  isPlaying: boolean;
  onClick: () => void;
  loading: boolean;
}) => {
  const icon = props.loading ?
    <LoadingOutlined className='text-2xl' /> :
    props.isPlaying ? <PauseCircleOutlined className='text-2xl' />
      : <PlayCircleOutlined className='text-2xl' />;

  return (
    <Button
      icon={icon}
      className='w-12 h-12'
      onClick={props.onClick}
    />
  );
};
