import { RefObject, useCallback, useEffect, useState } from 'react';
import * as React from 'react';
import ButtonPlay, { IFile } from './ButtonPlay';
import { Button, Popover } from 'antd';
import { StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons';
import Slider from './Slider';
import { SongInfo } from './Player';

interface PlayerControlProps {
  refVideo: RefObject<HTMLVideoElement>;
  onPrevSong: React.MouseEventHandler<HTMLElement>;
  onNextSong: React.MouseEventHandler<HTMLElement>;
  file?: IFile;
  songInfo: SongInfo;
}

export const PlayerControl = ({ refVideo, onPrevSong, onNextSong, file, songInfo }: PlayerControlProps) => {
  if (file == null){
    return <></>
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
        <ButtonPlay file={file} refVideo={refVideo} />
        <Button
          onClick={onNextSong}
          className='mx-2 my-0'
          icon={<StepForwardOutlined className='text-2xl' />}
        />
      </div>
      <TrackInfo songInfo={songInfo} />
      <RightGroupControl refVideo={refVideo} />
    </div>
    {/* Player controls end */}
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

const RightGroupControl = ({ refVideo }: {
  refVideo: RefObject<HTMLVideoElement>
}) => {
  const [isPopoverVisible, setPopoverVisible] = useState<boolean>(false);

  const content = (
    <div className='justify-center items-center flex'>
      <RepeatControl refVideo={refVideo} />
      <ShuffleControl />
      <VolumeControl refVideo={refVideo} />
      <VolumeSliderControl refVideo={refVideo} />
    </div>
  );

  return (
    <div className='justify-center items-center ml-4 flex'>
      <div className='justify-center items-center hidden sm:flex'>
        <RepeatControl refVideo={refVideo} />
        <ShuffleControl />
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

const RepeatControl = ({ refVideo }: {
  refVideo: RefObject<HTMLVideoElement>;
}) => {
  const [isLoop, setLoop] = useState<boolean>(refVideo.current?.loop ?? false);
  const handleRepeat = () => {
    setLoop(!isLoop);
  };
  useEffect(() => {
    if (refVideo.current) {
      refVideo.current.loop = isLoop;
    }
  }, [isLoop, refVideo]);

  return isLoop ? (
    <Button
      type='primary'
      onClick={handleRepeat}
      className='mx-2 my-0'
      icon={<i className='ri-repeat-one-line text-lg'></i>}
    />
  ) : (
    <Button
      onClick={handleRepeat}
      className='mx-2 my-0'
      icon={<i className='ri-repeat-2-line text-lg'></i>}
    />
  );
};

const ShuffleControl = () => {
  const [isShuffle, setShuffle] = useState<boolean>(false);
  const handleShuffle = () => {
    setShuffle(!isShuffle);
  };

  return (
    <Button
      disabled
      type={isShuffle ? 'primary' : undefined}
      onClick={handleShuffle}
      className='mx-2 my-0'
      icon={<i className='ri-shuffle-line text-lg'></i>}
    />
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
  return muted ? (
    <Button
      onClick={handleMuteVolume}
      className='mx-2 my-0'
      icon={<i className='ri-volume-mute-line text-lg'></i>}
    />
  ) : (
    <Button
      onClick={handleMuteVolume}
      className='mx-2 my-0'
      icon={<i className='ri-volume-up-fill text-lg'></i>}
    />
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

