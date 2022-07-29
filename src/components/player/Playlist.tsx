import { RefObject, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { useHover } from '../../hooks/useHover';
import { fromIPFS } from '../../utils/fromIPFS';
import classNames from 'classnames';
import { formatTime } from '../../utils/formatTime';
import { ISong } from './Player';

export const Playlist = (props: {
  className?: string
  songs: ISong[]
  onItemHover?: (asset: ISong | null) => void,
  onItemClick?: (asset: ISong) => void,
  hoveredItem?: ISong | null,
  selectedItem?: ISong | null,
}) => {
  const {songs} = props;

  const ref = useRef(null);
  const [observer, setObserver] = useState(null);

  return (
    <div ref={ref} className={classNames(props.className,' overflow-auto hide-scrollbar')}>
      {songs.map((i) => {
        return <PlaylistItem key={i.key} asset={i}
                             container={ref}
                             onItemClick={props.onItemClick}
                             onItemHover={(asset) => {
                               if (asset != null) {
                                 props?.onItemHover?.(asset)
                               }
                               else if (props.hoveredItem?.key === i.key) {
                                 props?.onItemHover?.(null)
                               }
                             }}
                             selected={props.selectedItem?.key === i.key} />
      })}
    </div>
  )
}

const videoDurationMap: Record<string, number> = {};

const PlaylistItem = (props : {
  asset: ISong
  container: React.MutableRefObject<any>,
  onItemHover?: (asset: ISong | null) => void,
  onItemClick?: (asset: ISong) => void,
  selected?: boolean,
}) => {
  const {asset} = props;
  const h = useHover();
  const {isHover} = h
  const el = useRef(null);

  const [duration, setDuration] = useState<number>(
    videoDurationMap[props.asset.unit] || 0
  );

  useEffect(() => {
    if (props.container.current && el.current){
      const el_ = el.current;
      const observer = new IntersectionObserver((e) => {
        const r = e[0].intersectionRatio;
        if (!duration && r > 0.5){

          loadTime().then((loaded) => {
            if (loaded){
              observer.unobserve(el_);
            }
          })
        }
      }, {
        root: props.container.current,
        threshold: 0.5,
      })

      observer.observe(el_)

      return () => {
        observer.unobserve(el_);
      }
    }
  }, [parent, el]);

  const loadTime =  () => {
    return new Promise((resolve) => {
      if (props.asset.file?.src && !duration) {
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = function() {
          window.URL.revokeObjectURL(video.src);
          const duration = video.duration;
          setDuration(duration);
          resolve(true)
        };

        video.src = fromIPFS(props.asset.file.src)!;
      }
    })
  };


  useEffect(() => {
    if (isHover) {
      props.onItemHover?.(props.asset);
      // loadTime();
    }
    else {
      props.onItemHover?.(null);
    }
  }, [isHover])

  return (
    <div ref={el} className={classNames('border-b cursor-pointer flex gap-4 p-2', {
      'bg-slate-800 ': props.selected,
      'bg-slate-800': isHover,
    })}
      onMouseEnter={h.handleMouseEnter}
      onMouseLeave={h.handleMouseLeave}
      onClick={(e) => {
        if (e.altKey){
          console.log(props.asset)
          window.open(`https://k5ez40j8h4.execute-api.us-east-1.amazonaws.com/api/v1/asset/${asset.unit}`, '__blank')
        }
        return props.onItemClick?.(props.asset);
      }}
    >
      <img src={fromIPFS(asset.image)} className={'w-12 h-12 object-contain'}/>
      <div className={'flex-1 grid'}>
        <div className={'font-bold'}>{asset.name}</div>
        <div className={'text-gray-400'}>{asset.artist}</div>
      </div>
      <div className={'mr-2'}>
        {duration &&
          <div >{formatTime(duration)}</div>}
      </div>
    </div>
  )
}
