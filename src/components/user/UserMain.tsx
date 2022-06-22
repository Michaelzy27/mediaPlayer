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
import { RefObject, useEffect, useRef, useState } from 'react';
import { getErrorMessageObj } from 'utils/response';

const ButtonPlay = ({
  onchain_metadata,
  selectedSrc,
  setSelectedSrc,
  refVideo,
}: {
  onchain_metadata: any;
  selectedSrc?: string;
  setSelectedSrc: any;
  refVideo: RefObject<HTMLVideoElement>;
}) => {
  const src = onchain_metadata?.files?.[0]?.src;
  const isCurrent = src === selectedSrc;
  const [count, setCount] = useState<number>(0);
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
          if (isCurrent && !isPlaying) {
            refVideo.current?.play();
            setCount(count + 1);
          }
        },
        false
      );
    }
  }, [count]);
  return (
    <Button
      icon={icon}
      className="w-12 h-12"
      onClick={() => {
        setSelectedSrc(src);
        setTimeout(() => {
          if (refVideo.current) {
            if (isCurrent && isPlaying) {
              refVideo.current.pause();
            } else if (isCurrent && isLoaded) {
              refVideo.current.play();
            } else {
              refVideo.current.load();
            }
            setCount(count + 1); // force reload
          }
        }, 0);
      }}
    />
  );
};

const UserMain = () => {
  const { user } = useUser();

  const [selectedSrc, setSelectedSrc] = useState<string>();

  const cardano = useCardano();

  const refVideo = useRef<HTMLVideoElement>(null);

  const createIpfsURL = (srcStr: string) => {
    const ipfsURL = 'https://ipfs.blockfrost.dev/ipfs/';
    const ipfsPrefix = 'ipfs://';
    return ipfsURL + srcStr.replace(ipfsPrefix, '');
  };
  const columns = [
    {
      title: 'Policy Id',
      dataIndex: 'policy_id',
      key: 'policy_id',
      className: 'break-all',
    },
    {
      title: 'Asset Id',
      dataIndex: 'asset_name',
      key: 'asset_name',
      className: 'break-all',
    },
    {
      className: 'font-bold',
      width: '30%',
      title: 'Name',
      dataIndex: ['onchain_metadata', 'name'],
      key: 'name'
    },
    {
      width: '20%',
      title: 'Thumbnail',
      dataIndex: 'onchain_metadata',
      key: 'thumbnail',
      render: (onchain_metadata: any) => {
        return <Image src={createIpfsURL(onchain_metadata['image'])} />;
      },
    },
    {
      width: '10%',
      title: 'Actions',
      dataIndex: 'onchain_metadata',
      key: 'actions',
      render: (onchain_metadata: any) => {
        return (
          <ButtonPlay
            onchain_metadata={onchain_metadata}
            selectedSrc={selectedSrc}
            setSelectedSrc={setSelectedSrc}
            refVideo={refVideo}
          />
        );
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
            <h3>Connect your wallet</h3>
            <Button
              type="text"
              className="px-1 -ml-1"
              onClick={handleConnectWallet}
            >
              Connect wallet
            </Button>
            <br />
            <Button type="text" className="px-1 -ml-1" onClick={pingAuth}>
              Ping
            </Button>
          </div>
        </Card>
        {user.walletFunds != null && (
          <Card title="List assest">
            <Table
              rowKey="asset"
              dataSource={user.walletFunds?.assets}
              columns={columns}
            ></Table>
          </Card>
        )}
        <video controls ref={refVideo} className="fixed bottom-8 left-8">
          {/* <video controls ref={refVideo}> */}
          {selectedSrc && (
            <source src={createIpfsURL(selectedSrc)} type="audio/mpeg"></source>
          )}
        </video>
      </ResponsiveContainer>
    </>
  );
};

export default UserMain;
