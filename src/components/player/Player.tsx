import {
  MoreOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from '@ant-design/icons';
import { Button, Col, Image, List, Popover, Row, Spin, Tabs } from 'antd';
import { IAssetInfo } from 'api/wallet-asset';
import ResponsiveContainer from 'components/common/ResponsiveContainer';
import Slider, { formatTime } from 'components/player/Slider';
import useUser from 'hooks/useUser';
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import 'video-react/dist/video-react.css';
import ButtonPlay, { createIpfsURL, IFile } from './ButtonPlay';
import * as React from 'react';
import { PlayerControl } from './PlayerControl';

window.URL = window.URL || window.webkitURL;

const videoDurationMap: Record<string, number> = {};

export interface SongInfo {
  thumbnail: string;
  title: string;
  artistsNames: string;
}

const ListItem = ({
  item,
  refVideo,
  onPlay,
}: {
  item: IAssetInfo;
  refVideo: RefObject<HTMLVideoElement>;
  onPlay?: Function;
}) => {
  const [isHover, setHover] = useState<boolean>(false);
  const [isPopoverVisible, setPopoverVisible] = useState<boolean>(false);

  const src = createIpfsURL(item.info?.file?.src);
  const [duration, setDuration] = useState<number>(
    videoDurationMap[src ?? ''] || 0
  );
  const time = <span>{duration ? formatTime(duration) : <Spin />}</span>;

  useEffect(() => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration;
      setDuration(duration);
    };

    if (src) {
      video.src = src;
    }
  }, [src]);

  const options = (
    <Popover
      trigger="click"
      placement="right"
      onVisibleChange={(visible) => {
        setPopoverVisible(visible);
      }}
      content={
        <List>
          <List.Item key={0}>Action 1</List.Item>
          <List.Item key={1}>Action 2</List.Item>
        </List>
      }
    >
      <Button icon={<MoreOutlined />} />
    </Popover>
  );
  const action = isHover || isPopoverVisible ? options : time;
  const { info } = item;
  return (
    <List.Item
      key={item.unit}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      actions={item.info?.file?.src ? [action] : []}
    >
      {info?.file && (
        <ButtonPlay file={info.file} refVideo={refVideo} onPlay={onPlay} />
      )}
      <List.Item.Meta
        title={info?.name}
        description={info?.artist}
        style={{ marginLeft: '20px' }}
      />
    </List.Item>
  );
};

interface PlayerProps {
  assets: IAssetInfo[]
}

export const Player = ({assets} : PlayerProps) => {
  const [currentItem, setCurrentItem] = useState<IAssetInfo>();
  const songInfo: SongInfo = {
    thumbnail: createIpfsURL(currentItem?.info?.image) ?? '',
    title: currentItem?.info?.name ?? '',
    artistsNames: currentItem?.info?.artist ?? '',
  };

  const refVideo = useRef<HTMLVideoElement>(null);


  const handlePrevSong = useCallback(() => {
    const currentIndex = assets.findIndex(
      (asset) => asset.unit === currentItem?.unit
    );
    if (currentIndex > 0) {
      setCurrentItem(assets[currentIndex - 1]);
    }
  }, [currentItem, setCurrentItem, assets]);

  const handleNextSong = useCallback(() => {
    const currentIndex = assets.findIndex(
      (asset) => asset.unit === currentItem?.unit
    );
    if (currentIndex >= 0 && currentIndex < assets.length - 1) {
      setCurrentItem(assets[currentIndex + 1]);
    }
  }, [currentItem, setCurrentItem, assets]);

  useEffect(() => {
    if (refVideo.current) {
      const lastSrc = refVideo.current.src;
      const src = createIpfsURL(currentItem?.info?.file?.src) ?? '';
      if (src) {
        refVideo.current.src = src;
        refVideo.current.load();
        setTimeout(() => {
          if (lastSrc) {
            refVideo.current?.play();
          }
        }, 0);
      }
    }
  }, [currentItem]);

  useEffect(() => {
    if (assets.length > 0 && currentItem == null) {
      setCurrentItem(assets[0]);
    } else if (assets.length === 0) {
      setCurrentItem(undefined);
    }
  }, [assets, currentItem]);

  return (
    <>
      <ResponsiveContainer wide className="mt-24 mb-12">
        {assets != null && (
          <Row className="h-full">
            <Col span={24} lg={15}>
              <Image
                wrapperClassName="h-[40vh] lg:h-[70vh] w-full"
                style={{ height: '100%', objectFit: 'contain' }}
                src={songInfo.thumbnail}
              />
            </Col>
            <Col span={24} lg={9}>
              <div
                style={{
                  border: '1px solid rgba(140, 140, 140, 0.35)',
                }}
                className="h-[40vh] lg:h-[70vh]"
              >
                <Tabs defaultActiveKey="inv" className="h-full px-4">
                  <Tabs.TabPane tab="Inventory" tabKey="inv" className="h-full">
                    <div
                      style={{
                        height: '100%',
                        overflow: 'auto',
                      }}
                      className="-mx-4 px-4"
                    >
                      <List
                        itemLayout="horizontal"
                        dataSource={assets}
                        renderItem={(item) => {
                          return (
                            <ListItem
                              item={item}
                              refVideo={refVideo}
                              onPlay={() => {
                                setCurrentItem(item);
                              }}
                            />
                          );
                        }}
                      />
                    </div>
                  </Tabs.TabPane>
                </Tabs>
              </div>
            </Col>
          </Row>
        )}
        <PlayerControl refVideo={refVideo} onPrevSong={handlePrevSong} onNextSong={handleNextSong}
                       file={currentItem?.info.file}  songInfo={songInfo}/>
        <video controls ref={refVideo} className="fixed bottom-8 left-8 hidden">
          <source type="audio/mpeg"></source>
        </video>
      </ResponsiveContainer>
    </>
  );
};

