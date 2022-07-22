import { IAssetInfo } from 'api/wallet-asset';
import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import 'video-react/dist/video-react.css';
import * as React from 'react';
import { PlayerControl } from './PlayerControl';
import { Playlist } from './Playlist';
import { fromIPFS } from '../../utils/fromIPFS';
import classNames from 'classnames';
import { getPolicyId } from '../../utils/cardano';

window.URL = window.URL || window.webkitURL;

export interface SongInfo {
  thumbnail: string;
  title: string;
  artistsNames: string;
}

interface PlayerProps {
  assets: IAssetInfo[];
}

const SUPPORT_MEDIA_TYPE = {
  'application/pdf': {},
  'audio/mp3': {},
  'audio/mpeg': {},
  'audio/wav': {},
  'image/gif': {},
  'image/jpeg': {},
  'image/jpg': {},
  'image/png': {},
  'model/gltf-binary': {},
  'null': {},
  'text/html': {},
  'video/mp4': {}
};

const AUDIO_MEDIA_TYPE = {
  'audio/mp3': {},
  'audio/mpeg': {},
  'audio/wav': {}
};

const VIDEO_MEDIA_TYPE = {
  'video/mp4': {}
};

const EXCLUDE = [
  'af2e27f580f7f08e93190a81f72462f153026d06450924726645891b44524950',
  'eebf7f0deadaf8bbf24f032012f46311a0c77da84ad9ceb624e52d48',
]

export interface IPlayFunctions {
  load: (file: string | undefined) => void,
  play: () => void,
  pause: () => void,
  isPlaying: () => boolean,
}

export const Player = (props: PlayerProps) => {
  const refVideo = useRef<HTMLVideoElement>(null);

  const assets = props.assets.filter((asset) => {
    if (asset.unit === 'lovelace') return false;
    const file = asset?.info?.file;
    const policy  = getPolicyId(asset.unit);
    return file?.src && Object.keys(AUDIO_MEDIA_TYPE).includes(file?.mediaType)
      && !EXCLUDE.includes(asset.unit)
      && !EXCLUDE.includes(policy);
  }) ?? [];

  const [currentItem, setCurrentItem] = useState<IAssetInfo | undefined>();
  const [hoverItem, setHoverItem] = useState<IAssetInfo | null>(null);
  const [playFunctions, setPlayFunctions] = useState<IPlayFunctions | undefined>();
  const [isPlaying, setPlaying] = useState<boolean>(false);

  const selectPlayAsset = (asset: IAssetInfo) => {
    console.log('SELECT and PLAY')
    setCurrentItem(asset);
    playFunctions?.load(asset.info.file?.src);
  }

  useEffect(() => {
    const el = refVideo.current;
    if (el){
      el.onpause = () => {
        setPlaying(false);
      }
      el.onended = () => {
        handleNextSong();
      }
      el.onplay = () => {
        setPlaying(true);
      }
      setPlayFunctions({
        load: (file) => {
          const src = fromIPFS(file);
          if (src) {
            el.onloadeddata = () => {
              console.log('LOADED');
              el.play();
            }
            el.src = src;
          }
        },
        play: () => {
          el.play()
        },
        pause: () => {
          el.pause();
        },
        isPlaying: () => {
          return !el.paused;
        }
      });
      return () => {
        setPlayFunctions(undefined);
      }
    }
  }, [refVideo, setPlaying, currentItem])

  const handlePrevSong = useCallback(() => {
    const currentIndex = assets.findIndex(
      (asset) => asset.unit === currentItem?.unit
    );
    if (currentIndex > 0) {
      selectPlayAsset(assets[currentIndex - 1]);
    }
  }, [currentItem, selectPlayAsset, assets]);

  const handleNextSong = useCallback(() => {
    const currentIndex = assets.findIndex(
      (asset) => asset.unit === currentItem?.unit
    );
    if (currentIndex >= 0 && currentIndex < assets.length - 1) {
      console.log('Play next song')
      selectPlayAsset(assets[currentIndex + 1]);
    }
  }, [currentItem, selectPlayAsset, assets]);

  const songInfo: SongInfo = {
    thumbnail: fromIPFS(currentItem?.info?.image) ?? '',
    title: currentItem?.info?.name ?? '',
    artistsNames: currentItem?.info?.artist ?? ''
  };

  const handleItemHover = (asset: IAssetInfo | null) => {
    /// set image
    setHoverItem(asset);
  };

  return (
    <div className={'flex-1 grid items-center mb-[40px]'}>
      <div className={'flex w-full lg:justify-between'}>
        <div />
        <div className={'ml-4 lg:ml-0'}>
          <div className={classNames('w-[calc(100vh-220px)] h-[calc(100vh-220px)] rounded-xl', {
            'border border-slate-800': !currentItem && !hoverItem
          })}>
            {(currentItem || hoverItem)
              && <img alt={'album image'}
                      className={'object-contain h-full w-full rounded-xl'}
                      src={fromIPFS((currentItem ?? hoverItem)!.info.image)} />}
          </div>
        </div>
        <div>
          <Playlist assets={assets} onItemHover={handleItemHover}
                    className={classNames('lg:relative lg:mt-0 lg:w-[500px] lg:h-[calc(100vh-220px)] ',
                      'absolute right-0 border rounded-xl mr-4 bg-black w-[400px] h-[400px] -mt-8')}
                    onItemClick={(asset) => {
                      selectPlayAsset(asset);
                    }}
                    hoveredItem={hoverItem?.unit}
                    selectedItem={currentItem?.unit}
          />
        </div>
        <div />
      </div>

      {/* Absolute */}
      {currentItem &&
        <PlayerControl refVideo={refVideo} onPrevSong={handlePrevSong} onNextSong={handleNextSong}
                       isPlaying={isPlaying}
                       onPlay={() => playFunctions?.play()}
                       onPause={() => playFunctions?.pause()}
                       file={currentItem?.info?.file} songInfo={songInfo} />
      }

      <video controls ref={refVideo} className="fixed bottom-8 left-8 hidden">
        <source type="audio/mpeg"></source>
      </video>
    </div>
  );
};
