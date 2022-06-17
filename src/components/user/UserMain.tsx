import { Button, Card, notification, Table } from 'antd';
import API from 'api';
import Auth from 'auth/Auth';
import BackLink from 'components/common/BackLink';
import ResponsiveContainer from 'components/common/ResponsiveContainer';
import useCardano, {
  CARDANO_WALLET_PROVIDER,
} from 'hooks/useCardano';
import useUser, {WalletFunds, Asset} from 'hooks/useUser';
import { useCallback, useState } from 'react';
import { getErrorMessageObj } from 'utils/response';

const UserMain = () => {
  const columns = [
    {
      title: 'Asset Id',
      dataIndex: 'assetId',
      key: 'assetId',
    },
    {
      title: 'Policy Id',
      dataIndex: 'policyId',
      key: 'policyId',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
  ];
  const { user, setWalletFunds } = useUser();

  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);

  const setUser = useCallback((_user: any) => {
    /// TODO: action set user
  }, []);

  const cardano = useCardano();

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
    console.log('sig', signature);
    await sendAuth(addressHex, signature, key);
    // add by Chau 2022-06-14 start
    user.walletFunds = await getAsset();
    console.log('walletFunds', user.walletFunds);
    setWalletFunds(user.walletFunds);
    //  add by Chau 2022-06-14 end
  };

  // add by Chau 2022-06-14 start
  const getAsset = async () => {
    await cardano.enable(walletProvider);
    const usedAddresses = await cardano.getUsedAddresses(walletProvider);
    const assets: Asset[] = [
      {
        policyId: 'test',
        assetId: 'test',
        name: 'test',
      },
    ];
    const lovelace = 1;
    const walletFunds: WalletFunds = {
      stakeAddress: 'stakeAddress',
      lovelace: lovelace,
      assets: assets,
    };
    return walletFunds;
    // const stakeAddress = await cardano.getStakeAddress(usedAddresses);
    // const assets: Asset[] = [
    //   {
    //     policyId: "test",
    //     assetId:  "test",
    //     name:  "test",
    //   }
    // ];
    // const lovelace = 1;
    // const walletFunds: WalletFunds = {
    //   stakeAddress: stakeAddress,
    //   lovelace: lovelace,
    //   assets: assets
    // }
    // return walletFunds;
  };
  // add by Chau 2022-06-14 end

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
        { user.walletFunds != null &&
        <Card title="List assest" >
          <Table dataSource={user.walletFunds?.assets} columns={columns}>
          </Table>
        </Card>
        }
      </ResponsiveContainer>
    </>
  );
};

export default UserMain;
