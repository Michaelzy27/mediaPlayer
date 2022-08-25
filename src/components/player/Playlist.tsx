import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useHover } from '../../hooks/useHover';
import { convertToLink } from '../../utils/convertToLink';
import classNames from 'classnames';
import { formatTime } from '../../utils/formatTime';
import { ISong, ITune, Media } from './player-types';
import _ from 'lodash';
import { BsFillFileEarmarkFontFill, BsFillFileEarmarkMusicFill, BsFillFileEarmarkPlayFill } from 'react-icons/bs';
import { AssetAPI } from '../../api/asset';

export const Playlist = (props: {
  className?: string
  items: ISong[]
  onItemHover?: (asset: ISong | null) => void,
  onItemClick?: (asset: ISong) => void,
  hoveredItem?: ISong | null,
  selectedItem?: ISong | null,
  onPlaylist?: (list: ISong[]) => void,
  onTabSelect?: (key: string) => void,
}) => {
  const { items } = props;
  const ref = useRef(null);

  const videos = useMemo(() => {
    return items.filter((i) => {
      return i.media === Media.Video && !i.isTun3z;
    });
  }, [items]);

  const songs = useMemo(() => {
    return items.filter((i) => {
      return i.media === Media.Audio && !i.isTun3z;
    });
  }, [items]);


  const tunes: ITune[] = useMemo(() => {
    const itemsWithTune = items.filter((i) => {
      return i.isTun3z;
    });
    /// group by unit
    const groups = _.groupBy(itemsWithTune, 'unit');
    return Object.values(groups).map((items) => {
      const first = items.find((i) => i.media === Media.Tun3z) ?? items.find((i) => i.media === Media.Audio) ?? items[0];
      return {
        name: first.name,
        artist: first.artist,
        items: items.filter((i) => i.media !== Media.Tun3z),
        imageUrl: first.imageUrl,
        unit: first.unit,
        image: first.image
      };
    });
  }, [items]);


  const [selectedTab, setTab] = useState<string>(tunes.length > 0 ? 'tunes' : songs.length > 0 ? 'music' : 'video');
  const [selectedArtist, setArtist] = useState<string | null>(null);


  const artists = useMemo(() => {
    const ans = _.groupBy(items, 'artist');
    return ans;
  }, [items]);

  const selectedItems = selectedTab === 'artists' ? artists[selectedArtist!]
    : selectedTab === 'video' ? videos
      : selectedTab === 'tunes' ? []
        : songs;

  useEffect(() => {
    props.onPlaylist?.(selectedItems);
  }, [selectedTab, selectedArtist, songs]);


  return (
    <div>
      <div ref={ref} className={classNames(props.className, ' overflow-auto hide-scrollbar')}>
        <div className={'sticky top-0 grid bg-black'}>
          <PlaylistTab
            className={'w-full'}
            tabs={[
              {
                key: 'tunes',
                label: `TUN3Z (${tunes.length})`,
                disabled: tunes.length === 0
              },
              {
                key: 'music',
                label: `Music (${songs.length})`,
                disabled: songs.length === 0
              },
              {
                key: 'video',
                label: `Videos (${videos.length})`,
                disabled: videos.length === 0
              },
              {
                key: 'artists',
                label: `Artists (${Object.keys(artists).length})`
              }
            ]}
            selectedTab={selectedTab}
            onClick={(k) => {
              if (k === 'artists') {
                setArtist(Object.keys(artists).sort()[0]);
              }
              setTab(k);
              props.onTabSelect?.(k);
            }} />
          <PlaylistTab
            className={classNames('w-full overflow-x-auto', {
              'hidden': selectedTab !== 'artists'
            })}
            tabs={Object.keys(artists).sort().map((key) => {
              return {
                key,
                label: key
              };
            })}
            selectedTab={selectedArtist}
            onClick={setArtist} />
        </div>

        {/*LIST of ITEMS*/}
        {selectedTab !== 'tunes' && selectedItems.map((i) => {
          return <PlaylistItem key={i.key} asset={i}
                               container={ref}
                               onItemClick={props.onItemClick}
                               onItemHover={(asset) => {
                                 if (asset != null) {
                                   props?.onItemHover?.(asset);
                                 } else if (props.hoveredItem?.key === i.key) {
                                   props?.onItemHover?.(null);
                                 }
                               }}
                               selected={props.selectedItem?.key === i.key} />;
        })}
        {selectedTab === 'tunes' && tunes.map((i) => {
          return <TunesList key={i.unit}
                            tune={i}
                            onItemClick={props.onItemClick}
                            selected={props.selectedItem?.key ?? ''} />;
        })}
      </div>
    </div>
  );
};

const videoDurationMap: Record<string, number> = {};

interface ITab {
  key: string;
  label: string;
  disabled?: boolean;
}

const PlaylistTab = (props: {
  className?: string,
  tabs: ITab[],
  selectedTab: string | null,
  onClick: (key: string) => void
}) => {
  return (
    <div className={classNames(props.className, 'flex px-2 py-2 gap-2 bg-black')}>
      {props.tabs.map((tab) => {

        const selected = props.selectedTab === tab.key;
        return <div key={tab.key}
                    className={classNames('rounded-md cursor-pointer px-2 py-1 transition-all hover:bg-slate-800 select-none whitespace-nowrap', {
                      'bg-slate-700 font-bold': selected,
                      'text-gray-500 pointer-events-none': tab.disabled
                    })} onClick={() => props.onClick(tab.key)}>
          <div>{tab.label}</div>
        </div>;
      })}
    </div>
  );
};

const TunesList = (props: {
  tune: ITune,
  selected: string,
  onItemHover?: (asset: ISong | null) => void,
  onItemClick?: (asset: ISong) => void,
}) => {
  const { tune } = props;

  return (
    <div>
      <div className={classNames('cursor-pointer flex gap-4 p-2')}
      >
        <img src={tune.imageUrl ?? convertToLink(tune.image)} className={'w-12 h-12 object-contain'} />
        <div className={'flex-1 grid'}>
          <div className={'font-bold'}>{tune.name}</div>
          <div className={'text-gray-400'}>{tune.artist}</div>
        </div>
      </div>
      <div>
        {tune.items.map((item) => {
          return <TuneItem key={item.key} song={item}
                           onClick={() => props.onItemClick?.(item)}
                           selected={item.key === props.selected}/>;
        })}
      </div>
    </div>
  );
};

const TuneItem = (props: {
  song: ISong,
  selected: boolean,
  onClick?: () => void,
}) => {
  const { song } = props;
  const h = useHover();
  const { isHover } = h;
  const [showText, setShowText] = useState<boolean>(false);
  const [text, setText] = useState<string | undefined>();

  useEffect(() => {
    const src = song.file?.src;
    AssetAPI.get(song.unit)
      .then((info) => {
        const file = info?.info.texts?.find((i) => i.src === src)
        const text = file?.text;
        if (song.media === Media.Text && text){
          setText(text);
        }
      })
  }, [showText, song]);



  const iconClass = 'h-6 w-6 ';
  return <div
    className={classNames('cursor-pointer grid pl-10 py-1', {
      'bg-slate-800 ': props.selected,
      'bg-slate-800': isHover
    })}
    onClick={() => {
      if (song.media === Media.Text){
        setShowText(!showText);
      }
      else {
        props.onClick?.()
      }
    }}
    onMouseEnter={h.handleMouseEnter}
    onMouseLeave={h.handleMouseLeave}
  >
    <div className={'flex'}>
      {song.media === Media.Audio && <BsFillFileEarmarkMusicFill className={iconClass}/>}
      {song.media === Media.Video && <BsFillFileEarmarkPlayFill className={iconClass}/>}
      {song.media === Media.Text && <BsFillFileEarmarkFontFill className={iconClass}/>}
      <div className={'font-bold ml-2'}>{song.name}</div>
    </div>
    {showText && <div className={'whitespace-pre-line h-40 overflow-auto'}>{text}</div>}
  </div>;
};

const PlaylistItem = (props: {
  asset: ISong
  container: React.MutableRefObject<any>,
  onItemHover?: (asset: ISong | null) => void,
  onItemClick?: (asset: ISong) => void,
  selected?: boolean,
}) => {
  const { asset } = props;
  const h = useHover();
  const { isHover } = h;
  const el = useRef(null);

  const [duration, setDuration] = useState<number>(
    videoDurationMap[props.asset.key] || 0
  );

  useEffect(() => {
    if (props.container.current && el.current) {
      const el_ = el.current;
      const observer = new IntersectionObserver((e) => {
        const r = e[0].intersectionRatio;
        if (!duration && r > 0.5) {

          loadTime().then((loaded) => {
            if (loaded) {
              observer.unobserve(el_);
            }
          });
        }
      }, {
        root: props.container.current,
        threshold: 0.5
      });

      observer.observe(el_);

      return () => {
        observer.unobserve(el_);
      };
    }
  }, [parent, el]);

  const { file } = props.asset;

  const loadTime = () => {
    return new Promise((resolve) => {
      if (file?.src && !duration && !file?.encrypted) {
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = function() {
          window.URL.revokeObjectURL(video.src);
          const duration = video.duration;
          videoDurationMap[props.asset.key] = duration;
          setDuration(duration);
          resolve(true);
        };

        video.src = convertToLink(file.src)!;
      }
    });
  };


  useEffect(() => {
    if (isHover) {
      props.onItemHover?.(props.asset);
      // loadTime();
    } else {
      props.onItemHover?.(null);
    }
  }, [isHover]);

  return (
    <div ref={el} className={classNames('border-b cursor-pointer flex gap-4 p-2', {
      'bg-slate-800 ': props.selected,
      'bg-slate-800': isHover
    })}
         onMouseEnter={h.handleMouseEnter}
         onMouseLeave={h.handleMouseLeave}
         onClick={(e) => {
           if (e.altKey) {
             console.log(props.asset);
             window.open(`https://k5ez40j8h4.execute-api.us-east-1.amazonaws.com/api/v1/asset/${asset.unit}`, '__blank');
           }
           return props.onItemClick?.(props.asset);
         }}
    >
      <img src={asset.imageUrl ?? convertToLink(asset.image)} className={'w-12 h-12 object-contain'} />
      <div className={'flex-1 grid'}>
        <div className={'font-bold'}>{asset.name}</div>
        <div className={'text-gray-400'}>{asset.artist}</div>
      </div>
      <div className={'mr-2'}>
        {duration > 0 &&
          <div>{formatTime(duration)}</div>}
      </div>
    </div>
  );
};
