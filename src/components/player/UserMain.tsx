import {
  LoadingOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Image, List, notification, Row } from 'antd';
import API from 'api';
import Auth from 'auth/Auth';
import BackLink from 'components/common/BackLink';
import ResponsiveContainer from 'components/common/ResponsiveContainer';
import useCardano, { CARDANO_WALLET_PROVIDER } from 'hooks/useCardano';
import useUser from 'hooks/useUser';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { signOut } from 'utils/auth';
import { getErrorMessageObj } from 'utils/response';
import { Player } from 'video-react';
import 'video-react/dist/video-react.css';

const createIpfsURL = (srcStr: string) => {
  const ipfsURL = 'https://ipfs.blockfrost.dev/ipfs/';
  const ipfsPrefix = 'ipfs://';
  return ipfsURL + srcStr.replace(ipfsPrefix, '');
};

const showDot = (item: any) => {
  item.Text = '...';
};

const showTime = (item: any) => {
  item.Text = '5:35';
};

interface IFile extends Record<string, any> {
  src: string;
}

interface SongInfo {
  thumbnail: string;
  title: string;
  artistsNames: string;
}

interface SvgAtts {
  color: string;
  width: string;
  height: string;
}

const ButtonPlay = ({
  file,
  refVideo,
}: {
  file: IFile;
  refVideo: RefObject<HTMLVideoElement>;
}) => {
  const src = createIpfsURL(file.src);
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);

  const isCurrent = src === refVideo.current?.src;
  const isLoaded = refVideo.current && refVideo.current.readyState === 4;
  const isPlaying = refVideo.current && isLoaded && !refVideo.current.paused;

  let icon = <PlayCircleOutlined className="text-2xl" />;
  if (isCurrent) {
    if (isPlaying) {
      icon = <PauseCircleOutlined className="text-2xl" />;
    } else if (!isLoaded) {
      icon = <LoadingOutlined className="text-2xl" />;
    }
  }
  useEffect(() => {
    if (refVideo.current) {
      refVideo.current.addEventListener(
        'loadeddata',
        () => {
          const isCurrent = src === refVideo.current?.src;
          const isLoaded =
            refVideo.current && refVideo.current?.readyState === 4;
          const isPlaying =
            refVideo.current && isLoaded && !refVideo.current?.paused;
          if (isCurrent && !isPlaying) {
            refVideo.current?.play();
          }
          forceUpdate();
        },
        false
      );
    }
  }, [forceUpdate, refVideo, src]);

  return (
    <Button
      icon={icon}
      className="w-12 h-12"
      onClick={() => {
        if (!isCurrent && refVideo.current) {
          refVideo.current.src = src;
        }
        setTimeout(() => {
          if (refVideo.current) {
            if (isCurrent && isPlaying) {
              refVideo.current.pause();
            } else if (isCurrent && isLoaded) {
              refVideo.current.play();
            } else {
              refVideo.current.load();
            }
            forceUpdate();
          }
        }, 0);
      }}
    />
  );
};

/* Icons start */
const IconPrevious = ({
  width,
  height,
  color,
}: {
  width: string;
  height: string;
  color: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      fill="none"
      width={width}
      height={height}
    >
      <path
        d="M64 468V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12v176.4l195.5-181C352.1 22.3 384 36.6 384 64v384c0 27.4-31.9 41.7-52.5 24.6L136 292.7V468c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12z"
        fill={color}
      />
    </svg>
  );
};

const IconPause = ({
  width,
  height,
  color,
}: {
  width: string;
  height: string;
  color: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      fill="none"
      width={width}
      height={height}
    >
      <path
        d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"
        fill={color}
      />
    </svg>
  );
};

const IconPlay = ({
  width,
  height,
  color,
}: {
  width: string;
  height: string;
  color: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      fill="none"
      width={width}
      height={height}
    >
      <path
        d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"
        fill={color}
      />
    </svg>
  );
};

const IconNext = ({
  width,
  height,
  color,
}: {
  width: string;
  height: string;
  color: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      fill="none"
      width={width}
      height={height}
    >
      <path
        d="M384 44v424c0 6.6-5.4 12-12 12h-48c-6.6 0-12-5.4-12-12V291.6l-195.5 181C95.9 489.7 64 475.4 64 448V64c0-27.4 31.9-41.7 52.5-24.6L312 219.3V44c0-6.6 5.4-12 12-12h48c6.6 0 12 5.4 12 12z"
        fill={color}
      />
    </svg>
  );
};

const IconRepeat = ({
  width,
  height,
  color,
}: {
  width: string;
  height: string;
  color: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      width={width}
      height={height}
    >
      <path
        d="M512 256c0 88.224-71.775 160-160 160H170.067l34.512 32.419c9.875 9.276 10.119 24.883.539 34.464l-10.775 10.775c-9.373 9.372-24.568 9.372-33.941 0l-92.686-92.686c-9.373-9.373-9.373-24.568 0-33.941l92.686-92.686c9.373-9.373 24.568-9.373 33.941 0l10.775 10.775c9.581 9.581 9.337 25.187-.539 34.464L170.067 352H352c52.935 0 96-43.065 96-96 0-13.958-2.996-27.228-8.376-39.204-4.061-9.039-2.284-19.626 4.723-26.633l12.183-12.183c11.499-11.499 30.965-8.526 38.312 5.982C505.814 205.624 512 230.103 512 256zM72.376 295.204C66.996 283.228 64 269.958 64 256c0-52.935 43.065-96 96-96h181.933l-34.512 32.419c-9.875 9.276-10.119 24.883-.539 34.464l10.775 10.775c9.373 9.372 24.568 9.372 33.941 0l92.686-92.686c9.373-9.373 9.373-24.568 0-33.941l-92.686-92.686c-9.373-9.373-24.568-9.373-33.941 0L306.882 29.12c-9.581 9.581-9.337 25.187.539 34.464L341.933 96H160C71.775 96 0 167.776 0 256c0 25.897 6.186 50.376 17.157 72.039 7.347 14.508 26.813 17.481 38.312 5.982l12.183-12.183c7.008-7.008 8.786-17.595 4.724-26.634z"
        fill={color}
      />
    </svg>
  );
};

const IconShuffle = ({
  width,
  height,
  color,
}: {
  width: string;
  height: string;
  color: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      width={width}
      height={height}
    >
      <path
        d="M504.971 359.029c9.373 9.373 9.373 24.569 0 33.941l-80 79.984c-15.01 15.01-40.971 4.49-40.971-16.971V416h-58.785a12.004 12.004 0 0 1-8.773-3.812l-70.556-75.596 53.333-57.143L352 336h32v-39.981c0-21.438 25.943-31.998 40.971-16.971l80 79.981zM12 176h84l52.781 56.551 53.333-57.143-70.556-75.596A11.999 11.999 0 0 0 122.785 96H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12zm372 0v39.984c0 21.46 25.961 31.98 40.971 16.971l80-79.984c9.373-9.373 9.373-24.569 0-33.941l-80-79.981C409.943 24.021 384 34.582 384 56.019V96h-58.785a12.004 12.004 0 0 0-8.773 3.812L96 336H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h110.785c3.326 0 6.503-1.381 8.773-3.812L352 176h32z"
        fill={color}
      />
    </svg>
  );
};

const IconVolumeMute= ({
  width,
  height,
  color,
}: {
  width: string;
  height: string;
  color: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      width={ width }
      height={ height }
    >
      <path
        d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zM461.64 256l45.64-45.64c6.3-6.3 6.3-16.52 0-22.82l-22.82-22.82c-6.3-6.3-16.52-6.3-22.82 0L416 210.36l-45.64-45.64c-6.3-6.3-16.52-6.3-22.82 0l-22.82 22.82c-6.3 6.3-6.3 16.52 0 22.82L370.36 256l-45.63 45.63c-6.3 6.3-6.3 16.52 0 22.82l22.82 22.82c6.3 6.3 16.52 6.3 22.82 0L416 301.64l45.64 45.64c6.3 6.3 16.52 6.3 22.82 0l22.82-22.82c6.3-6.3 6.3-16.52 0-22.82L461.64 256z"
        fill={ color }
      />
    </svg>
  )
};

const IconVolume = ({
  width,
  height,
  color,
}: {
  width: string;
  height: string;
  color: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 480 512"
      fill="none"
      width={ width }
      height={ height }
    >
      <path
        d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.53 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z"
        fill={ color }
      />
    </svg>
  )
};
/* Icons end */

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
const PreviousControl = () => {
  const handlePrevSong = () => {
    /* Add handling for previous song here */
  };
  return (
    <button
      onClick={handlePrevSong}
      className="mx-2 my-0 style__buttons"
      title="Previous Song"
    >
      <IconPrevious color="white" width="16px" height="16px" />
    </button>
  );
};

const PlayControl = ({
  refVideo,
}: {
  refVideo: RefObject<HTMLVideoElement>;
}) => {
  const isPlay = false;
  const handlePlaySong = () => {
    /* Add play song handling here */
  };
  return (
    <button
      className={'w-[42px] h-[42px] mx-2 my-0 style__buttons'}
      title="Play Song"
      onClick={handlePlaySong}
    >
      {isPlay ? (
        <IconPause color="white" width="24px" height="24px" />
      ) : (
        <IconPlay color="white" width="24px" height="24px" />
      )}
    </button>
  );
};

const NextControl = () => {
  const handleNextSong = () => {
    /*Add handling next song here */
  };

  return (
    <button
      onClick={handleNextSong}
      className="mx-2 my-0 style__buttons"
      title="Next Song"
    >
      <IconNext color="white" width="16px" height="16px" />
    </button>
  );
};

const RepeatControl = () => {
  const isLoop = false;
  const handleRepeat = () => {
    /*Add handling loop song here */
  };

  return (
    <div onClick={handleRepeat}>
      {isLoop ? (
        <button className="mx-2 my-0 style__buttons" title="Repeat">
          <IconRepeat color="white" width="16px" height="16px" />
        </button>
      ) : (
        <button className="mx-2 my-0 style__buttons" title="Repeat">
          <IconRepeat color="white" width="16px" height="16px" />
        </button>
      )}
    </div>
  );
};

const ShuffleControl = () => {
  const isLoop = false;
  const handleShuffle = () => {
    /*Add handling loop song here */
  };

  return (
    <button
      className="mx-2 my-0 style__buttons"
      title="Shuffle"
      onClick={handleShuffle}
    >
      <IconShuffle color="white" width="16px" height="16px" />
    </button>
  );
};

const VolumeControl = ({
  refVideo,
}: {
  refVideo: RefObject<HTMLVideoElement>;
}) => {
  const isMute = false;
  const handleMuteVolume = () => {
    /* Add hanling volume mute here */
  };
  return (
    <div
      onClick={handleMuteVolume}
    >
      {
        isMute
        ?
          <button className="mx-2 my-0 style__buttons" title="Mute">
            <IconVolumeMute color="white" width="16px" height="16px" />
          </button>
        :
          <button className="mx-2 my-0 style__buttons" title="Mute">
            <IconVolume color="white" width="16px" height="16px" />
          </button>
      }
    </div>
  )
};

const VolumeSliderControl = ({
  volume,
  refVideo,
}: {
  volume: string
  refVideo: RefObject<HTMLVideoElement>;
}) => {

  return(
    <Slider
      setWidth={"84px"}
      setHeight={"4px"}
      percentSlider={Number(volume) * 100}
      toogleTooltip={false}
      getPercentSlider={(value: number) => {
        if(refVideo.current) {
          refVideo.current.volume = value / 100
        }
      }}
    />
  )
};

const SongSliderControl  = ({
  currentTime,
  duration,
  refVideo,
}: {
  currentTime: string,
  duration: string,
  refVideo: RefObject<HTMLVideoElement>;
}) => {

  return(
    <Slider
      setWidth={"100%"}
      setHeight={"2px"}
      percentSlider={(Number(currentTime)/Number(duration))*100}
      toogleTooltip={true}
      currentTimeSongTooltip={Number(currentTime)}
      getPercentSlider={(value: number) => {
        if(refVideo.current) {
          refVideo.current.currentTime = (value / 100) * refVideo.current.duration
        }
      }}
    />
  )
};

const Slider = (
{ 
  setWidth, 
  setHeight,
  percentSlider,
  getPercentSlider,
  toogleTooltip,
  currentTimeSongTooltip 
}:{
  setWidth: string
  setHeight: string
  percentSlider: number
  getPercentSlider: Function
  toogleTooltip: boolean
  currentTimeSongTooltip?: number
}) => {

  const sliderRef = useRef<HTMLDivElement>(null)

  // Active UI Dot Slider Hover
  const [isActiveSliderDotHover, setActiveSliderDotHover] = useState<boolean>(false)

  // Active UI Tooltip Dot Hover
  const [isActiveSliderTooltipHover, setActiveSliderTooltipHover] = useState<boolean>(false)

  // Handler Active Dot Slider Hover
  const handleActiveSliderDotHover = (handle: boolean) => {
    setActiveSliderDotHover(handle)
  }

  // Handler Active Tooltip Dot Hover
  const handleActiveSliderTooltipHover = (handle: boolean) => {
    setActiveSliderTooltipHover(handle)
  }

  return (
    // Slider Bar
    // w-full || w-[84px]
    <div
      className="my-[-6px] cursor-pointer"
      style={{
        width: `${setWidth}`
      }}
    >
      {/* Slider Bar Progress */}
      <div
        className="py-[6px] px-0"
        onMouseOver={() => handleActiveSliderDotHover(true)}
        onMouseOut={() => handleActiveSliderDotHover(false)}
        ref={sliderRef}
        onMouseDown={(e) => {

          if(sliderRef.current) {

            let percentSliderWidth  = (
              (e.clientX - sliderRef.current.getBoundingClientRect().left)
                / sliderRef.current.offsetWidth
            ) * 100
            percentSliderWidth = percentSliderWidth < 0
              ? 0
              : percentSliderWidth > 100
              ? 100
              : percentSliderWidth
            getPercentSlider(percentSliderWidth)
          }

          const handleMouseMove = (e: MouseEvent) => {
            if(sliderRef.current) {
              let percentSliderWidth  = (
                  (e.clientX - sliderRef.current.getBoundingClientRect().left)
                    / sliderRef.current.offsetWidth
              ) * 100

              percentSliderWidth = percentSliderWidth < 0
                ? 0
                : percentSliderWidth > 100
                ? 100
                : percentSliderWidth

              getPercentSlider(percentSliderWidth)
            }
          }

          window.addEventListener("mousemove", handleMouseMove)

          window.addEventListener(
            "mouseup",
            () => {
              window.removeEventListener("mousemove", handleMouseMove)
            }
          )
        }}
      >
        {/* Slider Bar Rail */}
        <div
          className="relative w-full transition-[width,left] duration-300 bg-[hsla(0,0%,50.2%,.18)] rounded-[15px]"
          style={{
            height: `${setHeight}`
          }}
        >
          {/* React Slider Progress
            * Change Slider Progress -> width: 23%
          */}
          <div
            className="top-0 left-[0%] absolute z-[1] bg-[#335eea] rounded-[15px]"
            style={{
              width: `${percentSlider}%`,
              height: `${setHeight}`
            }}
          ></div>
          {/* End React Slider Process  */}

          {/* React Slider Dot
            * Change Slider Dot -> left: 23%
          */}
          <div
            className="absolute z-[5] w-3 h-3 top-[50%] translate-x-[-50%] translate-y-[-50%] transition-[left]"
            style={{
              left: `${percentSlider}%`
            }}
          >
            {/* Dot Handle */}
            <div
              className={"cursor-pointer w-full h-full rounded-full bg-[#fff] box-border " +
                (isActiveSliderDotHover ? "visible": "invisible")
              }
              onMouseOver={() => handleActiveSliderTooltipHover(true)}
              onMouseOut={() => handleActiveSliderTooltipHover(false)}
            >
            </div>
            {/* End Dot Handle */}
            {
              // Dot Tooltip
              toogleTooltip &&
              <div className={"top-[-10px] left-1/2 -translate-x-1/2 -translate-y-full absolute " +(isActiveSliderTooltipHover ? "visible" : "invisible")}>
                <div className="text-sm font-medium whitespace-nowrap px-[6px] py-[2px] min-w-[20px] text-center text-[#000] rounded-[5px] bg-[#fff] box-content">
                  <span>{formatTime(currentTimeSongTooltip || 0)}</span>
                </div>
              </div>
              // End Dot Tooltip
            }
          </div>
          {/* End React Slider Dot */}
        </div>
        {/* End Slider Bar Rail */}
      </div>
      {/* End Slider Bar Progress */}
    </div>
    // End Slider Bar
  )
};

const formatTime = ( sec_num: number ):string => {
  let hours: number | string = Math.floor(sec_num / 3600);
  let minutes: number | string = Math.floor((sec_num - hours * 3600) / 60);
  let seconds: number | string = Math.floor(sec_num - hours * 3600 - minutes * 60);

  hours = hours < 10 ? (hours > 0 ? '0' + hours : 0) : hours;

  if (minutes < 10) {
      minutes = '0' + minutes;
  }
  if (seconds < 10) {
      seconds = '0' + seconds;
  }
  return (hours !== 0 ? hours + ':' : '') + minutes + ':' + seconds;
}
/* Player control end */

const UserMain = () => {
  /*Mock data for player start */
  const songInfo: SongInfo = {
    thumbnail: createIpfsURL(
      'ipfs://QmTWwQajnLDZYA3qEtBbLsXA7Ua9NRFXPfhLnyYECe746U'
    ),
    title: 'SickCity332-The Holy Binns',
    artistsNames: 'Bob Peace',
  };
  const currentTime="20";
  const duration="140";
  const currentVolume = "50";
  /*Mock data for player end*/
  const { user } = useUser();

  const cardano = useCardano();

  const refVideo = useRef<HTMLVideoElement>(null);

  const columns = [
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      className: 'break-all',
    },
    {
      className: 'font-bold',
      width: '30%',
      title: 'Name',
      dataIndex: ['info', 'name'],
      key: 'name',
    },
    {
      width: '20%',
      title: 'Thumbnail',
      dataIndex: ['info', 'image'],
      key: 'thumbnail',
      render: (image: any) => {
        return image && <Image src={createIpfsURL(image)} />;
      },
    },
    {
      width: '10%',
      title: 'Actions',
      dataIndex: ['info', 'file'],
      key: 'actions',
      render: (file: IFile) => {
        return file && <ButtonPlay file={file} refVideo={refVideo} />;
      },
    },
  ];
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

  return (
    <>
      <ResponsiveContainer className="my-6">
        <BackLink text="Back" />
        <h2>Account settings</h2>
        <Card title="Test Wallet Connect">
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
              <Image
                src={createIpfsURL(user.walletFunds?.assets?.[0]?.info?.image)}
              />
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
                    const time = <span>5:55</span>;
                    const options = <Button>...</Button>;
                    const showOptions = false;
                    const action = showOptions ? options : time;
                    const { info } = item;
                    return (
                      <List.Item actions={[action]}>
                        {info?.file && (
                          <ButtonPlay file={info.file} refVideo={refVideo} />
                        )}
                        <List.Item.Meta
                          title={info?.name}
                          description={info?.artist}
                          style={{ marginLeft: '20px' }}
                        />
                      </List.Item>
                    );
                  }}
                />
              </div>
            </Col>
          </Row>
        )}
        {/* Player start */}
        <div className="flex flex-col justify-around h-16 backdrop-saturate-[180%] backdrop-blur-[30px] bg-[color:black] fixed inset-x-0 bottom-0 z-[100]">
          {/* Player controls start */}
          <SongSliderControl refVideo={refVideo} currentTime={currentTime} duration={duration} />
          <div className="grid grid-cols-3 h-full mx-[10vw] z-[-1]">
            <div className="flex justify-left items-center">
              <PreviousControl />
              <PlayControl refVideo={refVideo} />
              <NextControl />
            </div>
            <TrackInfo songInfo={songInfo} />
            <div className="flex justify-center items-center">
              <RepeatControl />
              <ShuffleControl />
              <VolumeControl refVideo={refVideo} />
              <VolumeSliderControl refVideo={refVideo} volume={currentVolume} />
            </div>
          </div>
          {/* Player controls end */}
        </div>
        {/* Player end */}
      </ResponsiveContainer>
    </>
  );
};

export default UserMain;
