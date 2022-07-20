import { notification } from 'antd';
import API from 'api';
import { getErrorMessageObj } from 'utils/response';
import useCardano, { CARDANO_WALLET_PROVIDER } from '../../hooks/useCardano';
import Auth from '../../auth/Auth';
import useUser from '../../hooks/useUser';
import { signOut } from '../../utils/auth';

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

export const WalletButton = () => {
  const { user } = useUser('header');



  return <div className={'flex'}>
    {!user.walletAddress && <ConnectButton/>}
    {user.walletAddress && <SignOutButton/>}
  </div>
}

const ConnectButton = () => {
  const cardano = useCardano();
  const walletProvider = CARDANO_WALLET_PROVIDER.NAMI;

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
    <div>
      <a onClick={handleConnectWallet}
         className={`
                px-8 py-3
                text-lg font-bold rounded
                text--primary bg-blue-200
                cursor-pointer`}
      >
        {'Connect Wallet'}
      </a>
    </div>
  )
}
const SignOutButton = () => {
  return (
    <div>
      <a onClick={signOut}
         className={`
                px-8 py-3
                text-lg font-bold rounded
                text--primary bg-blue-200
                cursor-pointer`}
      >{'Sign Out'}</a>
    </div>
  )
}