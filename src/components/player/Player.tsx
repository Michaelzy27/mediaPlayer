import { IAssetInfo } from 'api/wallet-asset';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import 'video-react/dist/video-react.css';
import { PlayerControl, REPEAT_MODE } from './PlayerControl';
import { Playlist } from './Playlist';
import { convertToLink } from 'utils/convertToLink';
import classNames from 'classnames';
import { getPolicyId } from 'utils/cardano';
import { Link } from 'react-router-dom';
import { AssetAPI } from 'api/asset';
import _ from 'lodash';
import { useHotkeys } from 'react-hotkeys-hook';
import { ISong, Media, SongInfo } from './player-types';
import ReactGA from 'react-ga4';
import { TrackAPI } from 'api/track';

window.URL = window.URL || window.webkitURL;

const EXCLUDE = [
  'af2e27f580f7f08e93190a81f72462f153026d06450924726645891b44524950',
  'eebf7f0deadaf8bbf24f032012f46311a0c77da84ad9ceb624e52d48'
];

const INCLUSIVE = [
  '2f1fd2519f072324a6a7608e98d193f718112270a590e251f89788116e69646f2d686f6c642d6f6e2d7632'
];

export const Player = (props: {
  assets: IAssetInfo[];
  random?: boolean,
}) => {
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
      const ans: ISong[] = [
        ...(asset.info.audios ?? []).map((file) => {
          return {
            key: file.src,
            media: Media.Audio,
            unit: asset.unit,
            image: asset.info.image,
            imageUrl: asset.info.imageUrl,
            name: file.name ?? asset.info.name,
            artist: file.artist ?? asset.info.artist,
            file: file,
            isTun3z: asset.isTun3z ?? false
          };
        }),
        ...(asset.info.videos ?? []).map((file) => {
          return {
            key: file.src,
            media: Media.Video,
            unit: asset.unit,
            image: asset.info.image,
            imageUrl: asset.info.imageUrl,
            name: file.name ?? asset.info.name,
            artist: file.artist ?? asset.info.artist,
            file: file,
            isTun3z: asset.isTun3z ?? false
          };
        }),
        ...(asset.info.texts ?? []).map((file) => {
          return {
            key: file.src,
            media: Media.Text,
            unit: asset.unit,
            image: asset.info.image,
            imageUrl: asset.info.imageUrl,
            name: file.name ?? asset.info.name,
            artist: file.artist ?? asset.info.artist,
            file: file,
            isTun3z: asset.isTun3z ?? false
          };
        })
      ];
      if (asset.isTun3z) {
        ans.push({
          key: asset.unit,
          media: Media.Tun3z,
          unit: asset.unit,
          image: asset.info.image,
          imageUrl: asset.info.imageUrl,
          name: asset.info.name,
          artist: asset.info.artist,
          isTun3z: true
        });
      }
      return ans;
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
  const [currentItem, setCurrentItem] = useState<ISong | undefined>();
  const [hoverItem, setHoverItem] = useState<ISong | null>(null);
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<REPEAT_MODE>(REPEAT_MODE.REPEAT);
  const [isShuffle, setShuffle] = useState<boolean>(false);
  const [playedSongs, setPlayedSongs] = useState<ISong[]>([]);
  const [playlist, setPlaylist] = useState<ISong[]>(songs);
  const [isVideo, setVideo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    setPlayedSongs([]);
  }, [songs]);

  useEffect(() => {
    const t = setInterval(() => {
      if (currentItem && isPlaying && !loading){
        console.log('event', currentItem?.name, isPlaying, loading);
        ReactGA.event({
          action: 'playing',
          category: isVideo ? 'video' : 'music',
          label: currentItem.name,
          value: 10,
        });
      }
    }, 10000);
    return () => {
      clearInterval(t);
    };
  }, [currentItem, isPlaying, loading, isVideo]);


  const play = useCallback(() => {
    refVideo.current?.play();
  }, [refVideo]);

  const pause = useCallback(() => {
    refVideo.current?.pause();
  }, [refVideo]);

  const stop = useCallback(() => {
    const el = refVideo.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
  }, [refVideo]);

  const load = useCallback((file: {
    src: string,
    url?: string,
  }) => {
    if (file == null) return;
    const src = file.url ?? convertToLink(file.src);
    const el = refVideo.current;
    if (src && el) {
      setLoading(true);
      el.onloadeddata = () => {
        if (el.src === src) {
          el.play();
          setLoading(false);
        }
      };
      el.src = src;
      console.log(src);
    }
  }, [refVideo]);

  const selectPlayAsset = useCallback(async (song: ISong, history: boolean, isVideo: boolean) => {
    if (song.key === currentItem?.key) return;
    stop();
    setLoading(true);
    if (currentItem != null && history) {
      setPlayedSongs([currentItem, ...playedSongs]);
    }
    setCurrentItem(song);




    const info = await AssetAPI.get(song.unit);
    const src = song.file?.src;
    if (src) {
      ReactGA.event({
        action: 'play',
        category: isVideo ? 'video' : 'music',
        label: song.name
      });
      TrackAPI.track(src);

      const file2 = (isVideo ? info?.info.videos : info?.info.audios)?.find((i) => i.src === src);

      load({
        src: src,
        url: file2?.url
      });
    }
  }, [currentItem, load]);

  const handleNextSong = useCallback(() => {
    const currentIndex = playlist.findIndex(
      (asset) => asset.unit === currentItem?.unit
    );

    // console.log('NEXT', repeatMode, currentIndex, `l=${playlist.length}`);

    let next = currentIndex + 1;
    if (repeatMode === REPEAT_MODE.ONE) {
      next = currentIndex;
      // console.log('NEXT -> REPEAT ONE', next);
      selectPlayAsset(playlist[next], true, isVideo);
    } else if (isShuffle && playlist.length > 1) {
      next = currentIndex;
      while (next === currentIndex) {
        next = Math.floor(Math.random() * playlist.length);
      }
      // console.log('NEXT -> SHUFFLE', next);
      selectPlayAsset(playlist[next], true, isVideo);
    } else if (next > playlist.length - 1) {
      if (repeatMode === REPEAT_MODE.REPEAT) {
        next = 0;
        // console.log('NEXT -> REPEAT NEXT', next);
        selectPlayAsset(playlist[next], true, isVideo);
      } else {
        next = 0;
        // console.log('NEXT -> RETURN STOP', next);
        setCurrentItem(playlist[next]);
      }
    } else if (next >= 0) {
      // console.log('NEXT -> JUST NEXT', next);

      selectPlayAsset(playlist[next], true, isVideo);
    }

  }, [isVideo, currentItem, selectPlayAsset, playlist, repeatMode, isShuffle]);

  const handlePrevSong = useCallback(() => {
    if (playedSongs.length > 0) {
      const prevSong = playedSongs[0];
      setPlayedSongs(playedSongs.slice(1));
      selectPlayAsset(prevSong, false, isVideo);

      return;
    }
    const currentIndex = songs.findIndex(
      (asset) => asset.unit === currentItem?.unit
    );
    if (currentIndex > 0) {
      selectPlayAsset(songs[currentIndex - 1], false, isVideo);
    }
  }, [currentItem, selectPlayAsset, songs, isVideo]);


  const songInfo: SongInfo = {
    thumbnail: currentItem?.imageUrl ?? convertToLink(currentItem?.image) ?? '',
    title: currentItem?.name ?? '',
    artistsNames: currentItem?.artist ?? ''
  };

  const handleItemHover = (asset: ISong | null) => {
    /// set image
    setHoverItem(asset);
  };

  const hasImage = currentItem || hoverItem;
  const imageSrc = (currentItem ?? hoverItem)?.imageUrl ?? convertToLink((currentItem ?? hoverItem)?.image);

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
            {imageSrc && !isVideo &&
              <img alt={'album image'}
                   key={imageSrc}
                   className={'object-contain h-full w-full rounded-xl'}
                   src={imageSrc} />}
            {<video
              ref={refVideo}
              controls={true}
              autoPlay={true}
              className={classNames('object-contain w-full rounded-xl', {
                'opacity-0 pointer-events-none': !isVideo || !currentItem
              })}
              // onSeekingCapture={() => {
              //   console.log('SeekingCapture')
              // }}
              // onSeeking={() => {
              //   console.log('Seeking')
              // }}
              onPlaying={() => {
                setLoading(false);
              }}
              onWaiting={(e) => {
                setLoading(true);
              }}
              onPause={() => {
                setPlaying(false);
              }}
              onPlay={() => {
                setPlaying(true);
              }}
              onEnded={() => {
                handleNextSong();
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
                    playing={isPlaying}
                    loading={loading}
                    className={classNames('lg:relative lg:mt-0 lg:w-[500px] lg:h-[calc(100vh-220px)] ',
                      'absolute right-0 border rounded-xl mr-4 bg-black w-[400px] h-[400px] -mt-8')}
                    onItemClick={(asset) => {
                      setVideo(asset.media === Media.Video);
                      selectPlayAsset(asset, false, asset.media === Media.Video);
                    }}
                    onTabSelect={(k) => {
                      stop();
                      setCurrentItem(undefined);
                    }}
                    onPlaylist={setPlaylist}
                    hoveredItem={hoverItem}
                    selectedItem={currentItem}
          />
        </div>
        <div />
      </div>

      {/* Absolute */}
      {currentItem && !isVideo &&
        <PlayerControl refVideo={refVideo} onPrevSong={handlePrevSong} onNextSong={handleNextSong}
                       repeatMode={repeatMode}
                       loading={loading}
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
    </div>
  );
};
