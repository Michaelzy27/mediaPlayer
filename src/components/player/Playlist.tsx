import { IAssetInfo } from '../../api/wallet-asset';
import { RefObject, useEffect, useState } from 'react';
import ButtonPlay, { createIpfsURL } from './ButtonPlay';
import { formatTime } from './Slider';
import { Button, List, Popover, Spin } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import * as React from 'react';
import { useHover } from '../../hooks/useHover';
import { fromIPFS } from '../../utils/fromIPFS';
import classNames from 'classnames';

const videoDurationMap: Record<string, number> = {};

export const Playlist = (props: {
  assets: IAssetInfo[]
  onItemHover?: (asset: IAssetInfo | null) => void,
  onItemClick?: (asset: IAssetInfo) => void,
  hoveredItem?: string,
  selectedItem?: string,
}) => {
  const {assets} = props;

  return (
    <div className={'h-[calc(100vh-200px)] overflow-auto'}>
      {assets.map((i) => {
        return <PlaylistItem key={i.unit} asset={i}
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

const PlaylistItem = (props : {
  asset: IAssetInfo
  onItemHover?: (asset: IAssetInfo | null) => void,
  onItemClick?: (asset: IAssetInfo) => void,
  selected?: boolean,
}) => {
  const {asset} = props;
  const h = useHover();
  const {isHover} = h

  useEffect(() => {
    if (isHover) {
      props.onItemHover?.(props.asset);
    }
    else {
      props.onItemHover?.(null);
    }
  }, [isHover])

  return (
    <div className={classNames('border cursor-pointer flex gap-4', {
      'bg-slate-800 ': props.selected,
      'bg-slate-800': isHover,
    })}
      onMouseEnter={h.handleMouseEnter}
      onMouseLeave={h.handleMouseLeave}
      onClick={() => props.onItemClick?.(props.asset)}
    >
      <img src={fromIPFS(asset.info.image)} className={'w-12 h-12'}/>
      <div className={'grid'}>
        <div>{asset.info.name}</div>
        <div>{asset.info.artist}</div>
      </div>
    </div>
  )
}
