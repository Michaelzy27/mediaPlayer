import { IAssetInfo } from 'api/wallet-asset';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import 'video-react/dist/video-react.css';
import { PlayerControl, REPEAT_MODE } from './PlayerControl';
import { Playlist } from './Playlist';
import { fromIPFS } from '../../utils/fromIPFS';
import classNames from 'classnames';
import { getPolicyId } from '../../utils/cardano';
import { Link } from 'react-router-dom';
import { notification } from 'antd';
import { AssetAPI } from '../../api/asset';
import { HotKeys } from 'react-hotkeys';
import { getFingerPrint } from '../../services/blockfrost';
import _, { has } from 'lodash';

window.URL = window.URL || window.webkitURL;

export interface SongInfo {
  thumbnail: string;
  title: string;
  artistsNames: string;
}

interface PlayerProps {
  assets: IAssetInfo[];
}

export enum Media {
  Audio = 'Audio',
  Video = 'Video',
}

export interface ISong {
  key: string;
  unit: string;
  image: string;
  name: string;
  artist: string;
  media: Media,
  file: {
    src: string;
    mediaType: string;
  }
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
  'eebf7f0deadaf8bbf24f032012f46311a0c77da84ad9ceb624e52d48'
];

export interface IPlayFunctions {
  load: (file: {
    encrypted: boolean,
    src: string,
  }) => void,
  play: () => void,
  pause: () => void,
  isPlaying: () => boolean,
}


export const Player = (props: PlayerProps) => {

  const songs: ISong[] = useMemo(() => {
    const ans = props.assets.filter((asset) => {
      if (asset.unit === 'lovelace') return false;
      const policy = getPolicyId(asset.unit);
      const hasMusic = (asset?.info.isMusic && asset.info.audios);
      const hasVideo = (asset?.info.isVideo && asset.info.videos);
      return (hasMusic || hasVideo)
        && !EXCLUDE.includes(asset.unit)
        && !EXCLUDE.includes(policy);
    }).map((asset) => {
      return [...asset.info.audios!.map((file) => {
        return {
          key: file.src,
          media: Media.Audio,
          unit: asset.unit,
          image: asset.info.image,
          name: file.name ?? asset.info.name,
          artist: file.artist ?? asset.info.artist,
          file: file
        };
      }), ...asset.info.videos!.map((file) => {
        return {
          key: file.src,
          media: Media.Video,
          unit: asset.unit,
          image: asset.info.image,
          name: file.name ?? asset.info.name,
          artist: file.artist ?? asset.info.artist,
          file: file
        };
      })];
    }).flat() ?? [];
    return _.uniqBy(ans, 'key');
  }, [props.assets]);

  if (songs.length === 0) {
    return <div className={'flex-1 grid items-center justify-center'}>
      <div className={'text-center grid gap-2'}>
        <div className={'text-6xl font-bold'}> No music found :(</div>
        <div className={'text-xl font-bold'}> Get some TUN3Z <Link to={'/mint'} className={'text-link'}>here</Link>
        </div>
      </div>
    </div>;
  }

  const refVideo = useRef<HTMLVideoElement>(null);
  const [currentItem, setCurrentItem] = useState<ISong | undefined>();
  const [hoverItem, setHoverItem] = useState<ISong | null>(null);
  const [playFunctions, setPlayFunctions] = useState<IPlayFunctions | undefined>();
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<REPEAT_MODE>(REPEAT_MODE.REPEAT);
  const [isShuffle, setShuffle] = useState<boolean>(false);
  const [playedSongs, setPlayedSongs] = useState<ISong[]>([]);

  const selectPlayAsset = async (song: ISong) => {
    if (song.key === currentItem?.key ) return;
    if (currentItem != null) {
      setPlayedSongs([currentItem, ...playedSongs]);
    }
    setCurrentItem(song);

    if (song.file != null) {
      const info = await AssetAPI.get(song.unit);
      const [metadataFile] = info?.metadata.files;
      const iv = metadataFile != null && metadataFile.iv;

      playFunctions?.load({
        src: song.file.src,
        encrypted: iv != null
      });
    }

  };

  const selectPlayAssetNoHistory = async (song: ISong) => {
    if (song.key === currentItem?.key ) return;
    setCurrentItem(song);

    if (song.file != null) {
      const info = await AssetAPI.get(song.unit);
      const [metadataFile] = info?.metadata.files;
      const iv = metadataFile != null && metadataFile.iv;

      playFunctions?.load({
        src: song.file.src,
        encrypted: iv != null
      });
    }
  };

  const handleNextSong = useCallback(() => {
    const currentIndex = songs.findIndex(
      (asset) => asset.unit === currentItem?.unit
    );

    console.log('NEXT REPEAT', repeatMode);

    let next = currentIndex + 1;
    if (isShuffle && songs.length > 1) {
      next = currentIndex;
      while (next === currentIndex) {
        next = Math.floor(Math.random() * songs.length);
      }
      selectPlayAsset(songs[next]);
    } else if (repeatMode === REPEAT_MODE.ONE) {
      next = currentIndex;
      selectPlayAsset(songs[next]);
    } else if (next >= songs.length) {
      if (repeatMode === REPEAT_MODE.REPEAT) {
        next = 0;
        selectPlayAsset(songs[next]);
      } else {
        next = 0;
      }
    } else if (next >= 0) {

      selectPlayAsset(songs[next]);
    }

  }, [currentItem, selectPlayAsset, songs, repeatMode, isShuffle]);

  useEffect(() => {
      setPlayedSongs([]);
    },
    [songs]);

  useEffect(() => {
    const el = refVideo.current;
    if (el) {
      el.onpause = () => {
        setPlaying(false);
      };
      el.onended = () => {
        handleNextSong();
      };
      el.onplay = () => {
        setPlaying(true);
      };
      setPlayFunctions({
        load: (file) => {
          if (file == null) return;
          console.log(file);
          if (file.encrypted) {
            /// load file into buffer
            // loadAndDecrypt(file);
            notification.error({ message: 'TODO' });
          } else {
            const src = fromIPFS(file.src);
            if (src) {
              el.onloadeddata = () => {
                el.play();
              };
              el.src = src;
            }
          }
        },
        play: () => {
          el.play();
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
      };
    }
  }, [refVideo, setPlaying, currentItem, repeatMode]);

  const handlePrevSong = useCallback(() => {
    if (playedSongs.length > 0) {
      const prevSong = playedSongs[0];
      setPlayedSongs(playedSongs.slice(1));
      selectPlayAssetNoHistory(prevSong);

      return;
    }
    const currentIndex = songs.findIndex(
      (asset) => asset.unit === currentItem?.unit
    );
    if (currentIndex > 0) {
      selectPlayAssetNoHistory(songs[currentIndex - 1]);
    }
  }, [currentItem, selectPlayAsset, songs]);


  const songInfo: SongInfo = {
    thumbnail: fromIPFS(currentItem?.image) ?? '',
    title: currentItem?.name ?? '',
    artistsNames: currentItem?.artist ?? ''
  };

  const handleItemHover = (asset: ISong | null) => {
    /// set image
    setHoverItem(asset);
  };

  const hasImage = currentItem || hoverItem;
  return (
    <HotKeys
      keyMap={{
        POOL: 'p',
        PAUSE: 'space'
      }}
      handlers={{
        POOL: async () => {
          if (currentItem) {
            const fingerprint = await getFingerPrint(currentItem.unit);
            console.log('FINGERPRINT', fingerprint);
            window.open(`https://pool.pm/${fingerprint}`, '__blank');
          }
          notification.info({ message: 'Open pool pm' });
        },
        PAUSE: () => {
          if (playFunctions?.isPlaying()){
            playFunctions?.pause();
          }
          else if (currentItem) {
            playFunctions?.play();
          }
        }
      }}
      className={'flex-1 grid items-center mb-[40px]'}>
      <div className={'flex w-full lg:justify-between'}>
        <div />
        <div className={'ml-4 lg:ml-0'}>
          <div className={classNames('w-[calc(100vh-220px)] h-[calc(100vh-220px)] rounded-xl', {
            'border border-slate-800 grid items-center justify-center': !hasImage
          })}>
            {hasImage &&
              <img alt={'album image'}
                   className={'object-contain h-full w-full rounded-xl'}
                   src={fromIPFS((currentItem ?? hoverItem)!.image)} />}
            {!hasImage &&
              <div>
                <div className={'font-bold text-3xl'}>Choose a TUN3!</div>
              </div>
            }
          </div>
        </div>
        <div>
          <Playlist items={songs} onItemHover={handleItemHover}
                    className={classNames('lg:relative lg:mt-0 lg:w-[500px] lg:h-[calc(100vh-220px)] ',
                      'absolute right-0 border rounded-xl mr-4 bg-black w-[400px] h-[400px] -mt-8')}
                    onItemClick={(asset) => {
                      selectPlayAssetNoHistory(asset);
                    }}
                    hoveredItem={hoverItem}
                    selectedItem={currentItem}
          />
        </div>
        <div />
      </div>

      {/* Absolute */}
      {currentItem &&
        <PlayerControl refVideo={refVideo} onPrevSong={handlePrevSong} onNextSong={handleNextSong}
                       repeatMode={repeatMode}
                       isShuffle={isShuffle}
                       onRepeat={() => {
                         if (repeatMode === REPEAT_MODE.REPEAT) setRepeatMode(REPEAT_MODE.ONE);
                         else if (repeatMode === REPEAT_MODE.ONE) setRepeatMode(REPEAT_MODE.NONE);
                         else if (repeatMode === REPEAT_MODE.NONE) setRepeatMode(REPEAT_MODE.REPEAT);
                       }}
                       onShuffle={() => {
                         setShuffle(!isShuffle);
                       }}
                       isPlaying={isPlaying}
                       onPlay={() => playFunctions?.play()}
                       onPause={() => playFunctions?.pause()}
                       file={currentItem?.file} songInfo={songInfo} />
      }

      <video controls ref={refVideo} className='fixed bottom-8 left-8 hidden'>
        <source type='audio/mpeg'></source>
      </video>
    </HotKeys>
  );
};
