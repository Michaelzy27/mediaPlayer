import {
  LoadingOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Image, notification, Table, List, Avatar, Row, Col } from 'antd';
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
  onchain_metadata,
  refVideo,
}: {
  onchain_metadata: any;
  refVideo: RefObject<HTMLVideoElement>;
}) => {
  const src = createIpfsURL(onchain_metadata?.files?.[0]?.src);
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
      key: 'name',
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
          <ButtonPlay onchain_metadata={onchain_metadata} refVideo={refVideo} />
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

  const data = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
  ];

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
          <Card title="List assest">
            <Table
              rowKey="asset"
              dataSource={user.walletFunds?.assets}
              columns={columns}
            ></Table>
          </Card>
        )}
        <Row>
        <Col span={12}>Video here</Col>
        <Col span={12}>
          <div style={{
            height: 400,
            overflow: 'auto',
            padding: '0 16px',
            border: '1px solid rgba(140, 140, 140, 0.35)',
          }}>
            <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={<a href="https://ant.design">{item.title}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
            </List.Item>
            )}
            />
          </div>
        </Col>
       </Row>
       
        <video controls ref={refVideo} className="fixed bottom-8 left-8">
          <source type="audio/mpeg"></source>
        </video>
      </ResponsiveContainer>
    </>
  );
};

export default UserMain;
