import { IAssetInfo } from '../../api/wallet-asset';
import { RefObject, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { useHover } from '../../hooks/useHover';
import { fromIPFS } from '../../utils/fromIPFS';
import classNames from 'classnames';
import { formatTime } from '../../utils/formatTime';

export const Playlist = (props: {
  assets: IAssetInfo[]
  onItemHover?: (asset: IAssetInfo | null) => void,
  onItemClick?: (asset: IAssetInfo) => void,
  hoveredItem?: string,
  selectedItem?: string,
}) => {
  const {assets} = props;

  const ref = useRef(null);
  const [observer, setObserver] = useState(null);

  return (
    <div ref={ref} className={'h-[calc(100vh-200px)] overflow-auto'}>
      {assets.map((i) => {
        return <PlaylistItem key={i.unit} asset={i}
                             container={ref}
                             onItemClick={props.onItemClick}
                             onItemHover={(asset) => {
                               if (asset != null) {
                                 props?.onItemHover?.(asset)
                               }
                               else if (props.hoveredItem === i.unit) {
                                 props?.onItemHover?.(null)
                               }
                             }}
                             selected={props.selectedItem === i.unit} />
      })}
    </div>
  )
}

const videoDurationMap: Record<string, number> = {};

const PlaylistItem = (props : {
  asset: IAssetInfo
  container: React.MutableRefObject<any>,
  onItemHover?: (asset: IAssetInfo | null) => void,
  onItemClick?: (asset: IAssetInfo) => void,
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

          console.log('INTERSECT', );
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
      if (props.asset.info.file?.src && !duration) {
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = function() {
          window.URL.revokeObjectURL(video.src);
          const duration = video.duration;
          setDuration(duration);
          resolve(true)
        };

        video.src = fromIPFS(props.asset.info.file.src)!;
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
      onClick={() => props.onItemClick?.(props.asset)}
    >
      <img src={fromIPFS(asset.info.image)} className={'w-12 h-12 object-contain'}/>
      <div className={'flex-1 grid'}>
        <div>{asset.info.name}</div>
        <div>{asset.info.artist}</div>
      </div>
      <div className={'mr-2'}>
        {duration &&
          <div >{formatTime(duration)}</div>}
      </div>
    </div>
  )
}
