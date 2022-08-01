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
import { AssetAPI } from '../../api/asset';
import _ from 'lodash';
import { useHotkeys } from 'react-hotkeys-hook';

window.URL = window.URL || window.webkitURL;

export interface SongInfo {
  thumbnail: string;
  title: string;
  artistsNames: string;
}

interface PlayerProps {
  assets: IAssetInfo[];
  random?: boolean,
}

export enum Media {
  Audio = 'Audio',
  Video = 'Video',
}

export interface ISong {
  key: string;
  unit: string;
  image: string;
  imageUrl?: string;
  name: string;
  artist: string;
  media: Media,
  file: {
    src: string;
    mediaType: string;
    encrypted?: boolean;
  },
  tune?: string;           // group by this
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

const INCLUSIVE = [
  '2f1fd2519f072324a6a7608e98d193f718112270a590e251f89788116e69646f2d686f6c642d6f6e2d7632'
]

const TUNE: { [key: string]: string } = {
  '2f1fd2519f072324a6a7608e98d193f718112270a590e251f89788116e69646f2d686f6c642d6f6e2d7632': 'Hold On'
};

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
      const tune: string | undefined = TUNE[asset.unit];
      return [
        ...asset.info.audios!.map((file) => {
          return {
            key: file.src,
            media: Media.Audio,
            unit: asset.unit,
            image: asset.info.image,
            imageUrl: asset.info.imageUrl,
            name: file.name ?? asset.info.name,
            artist: file.artist ?? asset.info.artist,
            file: file,
            tune: tune,
          };
        }),
        ...asset.info.videos!.map((file) => {
          return {
            key: file.src,
            media: Media.Video,
            unit: asset.unit,
            image: asset.info.image,
            imageUrl: asset.info.imageUrl,
            name: file.name ?? asset.info.name,
            artist: file.artist ?? asset.info.artist,
            file: file,
            tune: tune,
          };
        })];
    }).flat() ?? [];
    let ans2 = _.uniqBy(ans, 'key');

    if (props.random) {
      const always = ans2?.filter((asset) => asset.media === Media.Video || INCLUSIVE.includes(asset.unit));
      const ans3 = [...always];
      if (ans2.length > 15) {
        const indices: number[] = [];
        while (indices.length < 10) {
          const r = Math.floor(Math.random() * ans2.length);
          const asset = ans2[r];
          if (!indices.includes(r) && r < ans2.length && asset.media !== Media.Video && !INCLUSIVE.includes(asset.unit)) {
            indices.push(r);
            ans3.push(asset);
          }
        }
        return ans3;
      }
    }
    /// http://sound-rig-prod-public.s3-website-us-east-1.amazonaws.com/ipfs_v6_Raw/07706c11-4a17-484e-8ab7-ebdd01af1334
    /// https://sound-rig-prod-public.s3-website-us-east-1.amazonaws.com/ipfs_v6_Raw/07706c11-4a17-484e-8ab7-ebdd01af1334
    /// https://sound-rig-prod-public.s3.amazonaws.com/ipfs_v6_Raw/0418f3ed-2e43-467a-b0dc-811bfb0cbaed

    return ans2;
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
  const refVideo2 = useRef<HTMLVideoElement>(null);
  const [currentItem, setCurrentItem] = useState<ISong | undefined>();
  const [hoverItem, setHoverItem] = useState<ISong | null>(null);
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<REPEAT_MODE>(REPEAT_MODE.REPEAT);
  const [isShuffle, setShuffle] = useState<boolean>(false);
  const [playedSongs, setPlayedSongs] = useState<ISong[]>([]);
  const [playlist, setPlaylist] = useState<ISong[]>(songs);
  const [isVideo, setVideo] = useState<boolean>(false);


  useEffect(() => {
    setPlayedSongs([]);
  }, [songs]);

  const el = refVideo.current;
  const el2 = refVideo2.current;

  const play = useCallback(() => {
    (isVideo ? el2 : el)?.play();
  }, [el, el2, isVideo]);
  const pause = useCallback(() => {
    (isVideo ? el2 : el)?.pause();
  }, [el, el2, isVideo]);
  const stop = useCallback(() => {
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    if (el2) {
      el2.pause();
      el2.currentTime = 0;
    }
  }, [el, el2, isVideo]);
  const load = useCallback((file: {
    src: string,
    url?: string,
  }) => {
    if (file == null) return;
    const src = file.url ?? fromIPFS(file.src);
    if (src && el && !isVideo) {
      el.onloadeddata = () => {
        el.play();
      };
      el.src = src;
    } else if (el2 && isVideo && src) {
      el2.onloadeddata = () => {
        el2.play();
      };
      el2.src = src;
    }
  }, [el, el2, isVideo]);

  const selectPlayAsset = useCallback(async (song: ISong, history: boolean) => {
    if (song.key === currentItem?.key) return;
    if (currentItem != null && history) {
      setPlayedSongs([currentItem, ...playedSongs]);
    }
    setCurrentItem(song);


    const info = await AssetAPI.get(song.unit);
    const file2 = (isVideo ? info?.info.videos : info?.info.audios)?.find((i) => i.src === song.file.src);

    load({
      src: song.file.src,
      url: file2?.url
    });
  }, [isVideo, currentItem, load]);

  const handleNextSong = useCallback(() => {
    const currentIndex = playlist.findIndex(
      (asset) => asset.unit === currentItem?.unit
    );

    // console.log('NEXT', repeatMode, currentIndex, `l=${playlist.length}`);

    let next = currentIndex + 1;
    if (repeatMode === REPEAT_MODE.ONE) {
      next = currentIndex;
      // console.log('NEXT -> REPEAT ONE', next);
      selectPlayAsset(playlist[next], true);
    } else if (isShuffle && playlist.length > 1) {
      next = currentIndex;
      while (next === currentIndex) {
        next = Math.floor(Math.random() * playlist.length);
      }
      // console.log('NEXT -> SHUFFLE', next);
      selectPlayAsset(playlist[next], true);
    } else if (next > playlist.length - 1) {
      if (repeatMode === REPEAT_MODE.REPEAT) {
        next = 0;
        // console.log('NEXT -> REPEAT NEXT', next);
        selectPlayAsset(playlist[next], true);
      } else {
        next = 0;
        // console.log('NEXT -> RETURN STOP', next);
        setCurrentItem(playlist[next]);
      }
    } else if (next >= 0) {
      // console.log('NEXT -> JUST NEXT', next);

      selectPlayAsset(playlist[next], true);
    }

  }, [currentItem, selectPlayAsset, playlist, repeatMode, isShuffle]);


  const handlePrevSong = useCallback(() => {
    if (playedSongs.length > 0) {
      const prevSong = playedSongs[0];
      setPlayedSongs(playedSongs.slice(1));
      selectPlayAsset(prevSong, false);

      return;
    }
    const currentIndex = songs.findIndex(
      (asset) => asset.unit === currentItem?.unit
    );
    if (currentIndex > 0) {
      selectPlayAsset(songs[currentIndex - 1], false);
    }
  }, [currentItem, selectPlayAsset, songs]);


  const songInfo: SongInfo = {
    thumbnail: currentItem?.imageUrl ?? fromIPFS(currentItem?.image) ?? '',
    title: currentItem?.name ?? '',
    artistsNames: currentItem?.artist ?? ''
  };

  const handleItemHover = (asset: ISong | null) => {
    /// set image
    setHoverItem(asset);
  };

  const hasImage = currentItem || hoverItem;

  useHotkeys('space', () => {
    if (isPlaying) {
      pause();
    } else if (currentItem) {
      play();
    }
  }, [isPlaying]);

  return (
    <div className={'flex-1 grid items-center mb-[40px]'}>
      <div className={'flex w-full lg:justify-between'}>
        <div />
        <div className={'ml-4 lg:ml-0'}>
          <div className={classNames('w-[calc(100vh-220px)] h-[calc(100vh-220px)] rounded-xl grid items-center', {
            'border border-slate-800 grid items-center justify-center': !hasImage
          })}>
            {hasImage && !isVideo &&
              <img alt={'album image'}
                   className={'object-contain h-full w-full rounded-xl'}
                   src={(currentItem ?? hoverItem)!.imageUrl ?? fromIPFS((currentItem ?? hoverItem)!.image)} />}
            {isVideo &&
              <video
                ref={refVideo2}
                controls={true}
                autoPlay={true}
                className={classNames('object-contain w-full rounded-xl', {
                  'hidden': !isVideo || !currentItem
                })}
                onPause={() => {
                  isVideo && setPlaying(false);
                }}
                onPlay={() => {
                  isVideo && setPlaying(true);
                }}
                onEnded={() => {
                  isVideo && handleNextSong();
                }}
              />}
            {!hasImage &&
              <div>

                <div className={'font-bold text-3xl'}>{isVideo ? 'Choose a VID3O!' : 'Choose a TUN3!'}</div>
              </div>
            }
          </div>
        </div>
        <div>
          <Playlist items={songs} onItemHover={handleItemHover}
                    className={classNames('lg:relative lg:mt-0 lg:w-[500px] lg:h-[calc(100vh-220px)] ',
                      'absolute right-0 border rounded-xl mr-4 bg-black w-[400px] h-[400px] -mt-8')}
                    onItemClick={(asset) => {
                      selectPlayAsset(asset, false);
                    }}
                    onTabSelect={(k) => {
                      stop();
                      setCurrentItem(undefined);
                      setVideo(k === 'video');
                    }}
                    onPlaylist={setPlaylist}
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
                       onPlay={() => play()}
                       onPause={() => pause()}
                       file={currentItem?.file} songInfo={songInfo} />
      }

      <video controls ref={refVideo} className='fixed bottom-8 left-8 hidden'
             onPause={() => {
               !isVideo && setPlaying(false);
             }}
             onPlay={() => {
               !isVideo && setPlaying(true);
             }}
             onEnded={() => {
               !isVideo && handleNextSong();
             }}
      >
        <source type='audio/mpeg'></source>
      </video>
    </div>
  );
};
