import {
  StepBackwardOutlined,
  StepForwardOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Image,
  List,
  notification,
  Popover,
  Row,
  Spin,
} from 'antd';
import API from 'api';
import { IAssetInfo } from 'api/wallet-asset';
import Auth from 'auth/Auth';
import BackLink from 'components/common/BackLink';
import ResponsiveContainer from 'components/common/ResponsiveContainer';
import Slider, { formatTime } from 'components/player/Slider';
import useCardano, { CARDANO_WALLET_PROVIDER } from 'hooks/useCardano';
import useUser from 'hooks/useUser';
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { signOut } from 'utils/auth';
import { getErrorMessageObj } from 'utils/response';
import 'video-react/dist/video-react.css';
import ButtonPlay, { createIpfsURL, IFile } from './ButtonPlay';

window.URL = window.URL || window.webkitURL;

const videoDurationMap: Record<string, number> = {};

interface SongInfo {
  thumbnail: string;
  title: string;
  artistsNames: string;
}

/* Player control start */
const TrackInfo = ({ songInfo }: { songInfo: SongInfo }) => {
  return (
    <div className="flex items-center">
      {/* Thumbnail */}
      <img
        src={songInfo.thumbnail}
        alt={songInfo.title}
        className="h-[46px] rounded-[5px]"
      />
      {/* End Thumbnail */}

      {/* Info */}
      <div className="flex flex-col justify-center h-[46px] ml-3">
        <div className="font-semibold text-base text-[color:var(--color-text)] opacity-90 mb-1 truncate">
          {songInfo.title}
        </div>
        <div className="text-xs opacity-60 text-[color:var(--color-text)] truncate">
          {songInfo.artistsNames}
        </div>
      </div>
      {/* End Info */}
    </div>
  );
};

const RepeatControl = ({
  refVideo,
}: {
  refVideo: RefObject<HTMLVideoElement>;
}) => {
  const [isLoop, setLoop] = useState<boolean>(refVideo.current?.loop ?? false);
  const handleRepeat = () => {
    setLoop(!isLoop);
  };
  useEffect(() => {
    if (refVideo.current) {
      refVideo.current.loop = isLoop;
    }
  }, [isLoop, refVideo]);

  return isLoop ? (
    <Button
      type="primary"
      onClick={handleRepeat}
      className="mx-2 my-0"
      icon={<i className="ri-repeat-one-line text-lg"></i>}
    />
  ) : (
    <Button
      onClick={handleRepeat}
      className="mx-2 my-0"
      icon={<i className="ri-repeat-2-line text-lg"></i>}
    />
  );
};

const ShuffleControl = () => {
  const [isShuffle, setShuffle] = useState<boolean>(false);
  const handleShuffle = () => {
    setShuffle(!isShuffle);
  };

  return (
    <Button
      disabled
      type={isShuffle ? 'primary' : undefined}
      onClick={handleShuffle}
      className="mx-2 my-0"
      icon={<i className="ri-shuffle-line text-lg"></i>}
    />
  );
};

const VolumeControl = ({
  refVideo,
}: {
  refVideo: RefObject<HTMLVideoElement>;
}) => {
  const [muted, setMuted] = useState<boolean>(refVideo.current?.muted ?? false);
  const handleMuteVolume = () => {
    setMuted(!muted);
  };
  useEffect(() => {
    if (refVideo.current) {
      refVideo.current.muted = muted;
    }
  }, [muted, refVideo]);
  return muted ? (
    <Button
      onClick={handleMuteVolume}
      className="mx-2 my-0"
      icon={<i className="ri-volume-mute-line text-lg"></i>}
    />
  ) : (
    <Button
      onClick={handleMuteVolume}
      className="mx-2 my-0"
      icon={<i className="ri-volume-up-fill text-lg"></i>}
    />
  );
};

const VolumeSliderControl = ({
  refVideo,
}: {
  refVideo: RefObject<HTMLVideoElement>;
}) => {
  const [volume, setVolume] = useState<number>(refVideo.current?.volume || 0.5);
  useEffect(() => {
    if (refVideo.current) {
      refVideo.current.volume = volume;
    }
  }, [refVideo, volume]);
  return (
    <Slider
      setWidth={'84px'}
      setHeight={'4px'}
      percentSlider={volume * 100}
      toogleTooltip={false}
      getPercentSlider={(value: number) => {
        setVolume(value / 100);
      }}
    />
  );
};

const SongSliderControl = ({
  refVideo,
}: {
  refVideo: RefObject<HTMLVideoElement>;
}) => {
  const [progress, setProgress] = useState<number>(
    refVideo.current?.currentTime || 0
  );
  const loadProgress = useCallback(() => {
    const current = refVideo.current;
    if (current) {
      const loadedPercentage = current.currentTime / current.duration;
      setProgress(loadedPercentage);
    }
  }, [refVideo, setProgress]);
  useEffect(() => {
    const current = refVideo.current;
    if (current) {
      current.addEventListener('timeupdate', loadProgress);
      return () => {
        current.removeEventListener('timeupdate', loadProgress);
      };
    }
  }, [refVideo, loadProgress]);
  return (
    <Slider
      setWidth={'100%'}
      setHeight={'2px'}
      percentSlider={progress * 100}
      toogleTooltip={true}
      currentTimeSongTooltip={progress * (refVideo.current?.duration || 0)}
      getPercentSlider={(value: number) => {
        if (refVideo.current) {
          refVideo.current.currentTime =
            (value / 100) * refVideo.current.duration;
        }
      }}
    />
  );
};

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

const UserMain = () => {
  const [currentItem, setCurrentItem] = useState<IAssetInfo>();
  /*Mock data for player start */
  const songInfo: SongInfo = {
    thumbnail: createIpfsURL(currentItem?.info?.image) ?? '',
    title: currentItem?.info?.name ?? '',
    artistsNames: currentItem?.info?.artist ?? '',
  };
  /*Mock data for player end*/
  const { user } = useUser();

  const cardano = useCardano();

  const refVideo = useRef<HTMLVideoElement>(null);

  const walletProvider = CARDANO_WALLET_PROVIDER.NAMI;

  const pingAuth = async () => {
    const [data, error] = await API.User.pingAuth();
    if (error) {
      notification['error'](getErrorMessageObj(error));
      return;
    }

    notification['success']({
      message: 'ping successfully',
    });
  };

  const sendAuth = async (
    addressHex: string,
    signature: string,
    key?: string
  ) => {
    const [data, error] = await API.User.sendAuth(addressHex, signature, key);
    if (error) {
      notification['error'](getErrorMessageObj(error));
      return;
    }

    const token = data.token;
    Auth.initSession(addressHex, token);

    /// try pinging
    await pingAuth();
  };

  const handleConnectWallet = async () => {
    await cardano.enable(walletProvider);
    const usedAddresses = await cardano.getUsedAddresses(walletProvider);
    console.log('used', usedAddresses);
    const addressHex = usedAddresses[0];

    const [data, error] = await API.User.getAuth(addressHex);
    if (error) {
      notification['error'](getErrorMessageObj(error));
      return;
    }

    const payload = data.message;

    const { signature, key } = await cardano.signData(
      walletProvider,
      addressHex,
      payload
    );
    await sendAuth(addressHex, signature, key);
  };

  const filteredAssets = useMemo(() => {
    return (
      user.walletFunds?.assets.filter((asset) => asset?.info?.file?.src) ?? []
    );
  }, [user]);

  const handlePrevSong = useCallback(() => {
    const currentIndex = filteredAssets.findIndex(
      (asset) => asset.unit === currentItem?.unit
    );
    if (currentIndex > 0) {
      setCurrentItem(filteredAssets[currentIndex - 1]);
    }
  }, [currentItem, setCurrentItem, filteredAssets]);

  const handleNextSong = useCallback(() => {
    const currentIndex = filteredAssets.findIndex(
      (asset) => asset.unit === currentItem?.unit
    );
    if (currentIndex >= 0 && currentIndex < filteredAssets.length - 1) {
      setCurrentItem(filteredAssets[currentIndex + 1]);
    }
  }, [currentItem, setCurrentItem, filteredAssets]);

  useEffect(() => {
    if (refVideo.current) {
      refVideo.current.src = createIpfsURL(currentItem?.info?.file?.src) ?? '';
      refVideo.current.load();
    }
  }, [currentItem]);

  useEffect(() => {
    if (filteredAssets.length > 0 && currentItem == null) {
      setCurrentItem(filteredAssets[0]);
    }
  }, [filteredAssets, currentItem]);

  return (
    <>
      <ResponsiveContainer className="my-6">
        <BackLink text="Back" />
        <Card title="Wallet Connect" className="mb-4">
          <div>
            {!user.walletAddress && (
              <>
                <h3>Connect your wallet</h3>
                <Button
                  type="text"
                  className="px-1 -ml-1"
                  onClick={handleConnectWallet}
                >
                  Connect wallet
                </Button>
              </>
            )}
            {user.walletAddress && (
              <>
                <h3>{`Connected to address hex ${user.displayName}`}</h3>
                <Button type="text" className="px-1 -ml-1" onClick={signOut}>
                  Sign out
                </Button>
              </>
            )}
            <br />
            <Button type="text" className="px-1 -ml-1" onClick={pingAuth}>
              Ping
            </Button>
          </div>
        </Card>
        {user.walletFunds != null && (
          <Row>
            <Col span={12}>
              <Image src={songInfo.thumbnail} />
            </Col>
            <Col span={12}>
              <div
                style={{
                  height: 600,
                  overflow: 'auto',
                  padding: '0 16px',
                  border: '1px solid rgba(140, 140, 140, 0.35)',
                }}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={user.walletFunds?.assets}
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
            </Col>
          </Row>
        )}
        {/* Player start */}
        <div className="flex flex-col justify-around h-16 backdrop-saturate-[180%] backdrop-blur-[30px] bg-black fixed inset-x-0 bottom-0 z-[100]">
          {/* Player controls start */}
          <SongSliderControl refVideo={refVideo} />
          <div className="grid grid-cols-3 h-full mx-[10vw] z-[-1]">
            <div className="flex justify-left items-center">
              <Button
                onClick={handlePrevSong}
                className="mx-2 my-0"
                icon={<StepBackwardOutlined className="text-2xl" />}
              />
              <ButtonPlay file={currentItem?.info?.file} refVideo={refVideo} />
              <Button
                onClick={handleNextSong}
                className="mx-2 my-0"
                icon={<StepForwardOutlined className="text-2xl" />}
              />
            </div>
            <TrackInfo songInfo={songInfo} />
            <div className="flex justify-center items-center">
              <RepeatControl refVideo={refVideo} />
              <ShuffleControl />
              <VolumeControl refVideo={refVideo} />
              <VolumeSliderControl refVideo={refVideo} />
            </div>
          </div>
          {/* Player controls end */}
        </div>
        {/* Player end */}
        <video controls ref={refVideo} className="fixed bottom-8 left-8 hidden">
          <source type="audio/mpeg"></source>
        </video>
      </ResponsiveContainer>
    </>
  );
};

export default UserMain;
