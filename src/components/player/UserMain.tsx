import { Button, Card, notification, Table, Image } from 'antd';
import API from 'api';
import Auth from 'auth/Auth';
import BackLink from 'components/common/BackLink';
import ResponsiveContainer from 'components/common/ResponsiveContainer';
import useCardano, {
  CARDANO_WALLET_PROVIDER,
} from 'hooks/useCardano';
import useUser, {WalletFunds, IAsset} from 'hooks/useUser';
import { getErrorMessageObj } from 'utils/response';

const UserMain = () => {
  const { user, setWalletFunds } = useUser();

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
    const assets: IAsset[] = [
      {
        policyId: 'test policyId',
        assetId: 'test assetId',
        name: 'test name',
        onchain_metadata: {
        "name": "KYD JU$E - Lucci #240",
        "image": "ipfs://Qmd5eRve64Kq6AvCivSAZqD5uQXSZmish7KMR95SYSEKpQ",
        "Title": "Lucci by KYD JU$E",
        "files": [
            {
                "src": "ipfs://QmP4FyS1AUuNDv67vQxS71PC6dKa5YWX3t41Pe8KYjouWW",
                "name": "KYD JU$E - Lucci #240",
                "mediaType": "audio/mpeg"
            }
        ],
        "Artist": "KYD JU$E",
        "Twitter": "https://twitter.com/kydjuse",
        "Quantity": "250",
        "Copyright": "JU$E Music ©",
        "Publisher": "JU$E Music",
        "Royalties": "5%",
        "mediaType": "image/png",
        "Use Rights": "This NFT is a non-exclusive license to use in perpetuity.",
        "Description": "Use the link to unlock private link to stream via Soundcloud",
        "description": "Lucci is the first single released by KYD JUSE on Cardano.",
        "Unlock Feature": "https://tinyurl.com/jusedrops",
        "Publishers Website": "https://www.jusemusic.com"
        }
      }
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
          {/*<AssetsList assets={user.walletFunds?.assets} />*/}
        </Card>
        }
      </ResponsiveContainer>
    </>
  );
};

export default UserMain;
