import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import * as React from 'react';
import { useHover } from '../../hooks/useHover';
import { fromIPFS } from '../../utils/fromIPFS';
import classNames from 'classnames';
import { formatTime } from '../../utils/formatTime';
import { ISong, Media } from './Player';
import _ from 'lodash';

export const Playlist = (props: {
  className?: string
  items: ISong[]
  onItemHover?: (asset: ISong | null) => void,
  onItemClick?: (asset: ISong) => void,
  hoveredItem?: ISong | null,
  selectedItem?: ISong | null,
}) => {
  const { items } = props;

  const ref = useRef(null);
  const [observer, setObserver] = useState(null);

  const videos = useMemo(() => {
    return items.filter((i) => {
        return i.media === Media.Video
    })
  }, [items ])
  const songs = useMemo(() => {
    return items.filter((i) => {
      return i.media === Media.Audio
    })
  }, [items])

  const [selectedTab, setTab] = useState<string>(songs.length > 0 ? 'music' : 'video');
  const [selectedArtist, setArtist] = useState<string | null>(null);


  const artists = useMemo(() => {
    const ans = _.groupBy(items, 'artist');
    console.log('ARTIST', ans)
    return ans;
  }, [items])

  const selectedItems = selectedTab === 'artists' ? artists[selectedArtist!] : selectedTab === 'video' ? videos : songs;

  return (
    <div>
      <div ref={ref} className={classNames(props.className, ' overflow-auto hide-scrollbar')}>
        <div className={'sticky top-0 grid bg-black'}>
          <PlaylistTab
            className={'w-full'}
            tabs={[
              {
                key: 'music',
                label: `Music (${songs.length})`,
                disabled: songs.length === 0,
              },
              {
                key: 'video',
                label: `Videos (${videos.length})`,
                disabled: videos.length === 0,
              },
              {
                key: 'artists',
                label: `Artists (${Object.keys(artists).length})`,
              }
            ]}
            selectedTab={selectedTab}
            onClick={(k) => {
              if (k === 'artists'){
                setArtist(Object.keys(artists).sort()[0]);
              }
              setTab(k)
            }} />
          <PlaylistTab
            className={classNames('w-full overflow-x-auto', {
              'hidden': selectedTab !== 'artists',
            })}
            tabs={Object.keys(artists).sort().map((key) => {
              return {
                key,
                label: key,
              }
            })}
            selectedTab={selectedArtist}
            onClick={setArtist} />
        </div>

        {selectedItems.map((i) => {
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
        return <div key={tab.key} className={classNames('rounded-md cursor-pointer px-2 py-1 transition-all hover:bg-slate-800 select-none whitespace-nowrap', {
          'bg-slate-700 font-bold': selected,
          'text-gray-500 pointer-events-none': tab.disabled,
        })} onClick={() => props.onClick(tab.key)}>
          <div>{tab.label}</div>
        </div>;
      })}
    </div>
  );
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
    videoDurationMap[props.asset.unit] || 0
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

  const loadTime = () => {
    return new Promise((resolve) => {
      if (props.asset.file?.src && !duration) {
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = function() {
          window.URL.revokeObjectURL(video.src);
          const duration = video.duration;
          setDuration(duration);
          resolve(true);
        };

        video.src = fromIPFS(props.asset.file.src)!;
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
      <img src={fromIPFS(asset.image)} className={'w-12 h-12 object-contain'} />
      <div className={'flex-1 grid'}>
        <div className={'font-bold'}>{asset.name}</div>
        <div className={'text-gray-400'}>{asset.artist}</div>
      </div>
      <div className={'mr-2'}>
        {duration &&
          <div>{formatTime(duration)}</div>}
      </div>
    </div>
  );
};
