import {
  LoadingOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Image, notification, Table } from 'antd';
import API from 'api';
import Auth from 'auth/Auth';
import BackLink from 'components/common/BackLink';
import ResponsiveContainer from 'components/common/ResponsiveContainer';
import useCardano, { CARDANO_WALLET_PROVIDER } from 'hooks/useCardano';
import useUser from 'hooks/useUser';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { signOut } from 'utils/auth';
import { getErrorMessageObj } from 'utils/response';

const createIpfsURL = (srcStr: string) => {
  const ipfsURL = 'https://ipfs.blockfrost.dev/ipfs/';
  const ipfsPrefix = 'ipfs://';
  return ipfsURL + srcStr.replace(ipfsPrefix, '');
};

const ButtonPlay = ({
  file,
  refVideo,
}: {
  file: any;
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

const UserMain = () => {
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
      render: (file: any) => {
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
          <Card title="List assets">
            <Table
              rowKey="asset"
              dataSource={user.walletFunds?.assets}
              columns={columns}
            ></Table>
          </Card>
        )}
        <video controls ref={refVideo} className="fixed bottom-8 left-8">
          <source type="audio/mpeg"></source>
        </video>
      </ResponsiveContainer>
    </>
  );
};

export default UserMain;
