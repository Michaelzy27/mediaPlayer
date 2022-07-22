import { notification } from 'antd';
import API from 'api';
import { getErrorMessageObj } from 'utils/response';
import useCardano, { CARDANO_WALLET_PROVIDER } from '../../hooks/useCardano';
import Auth from '../../auth/Auth';
import useUser from '../../hooks/useUser';
import { signOut } from '../../utils/auth';
import { useHover } from '../../hooks/useHover';

interface IWallet {
  key: string,
  icon: string
  name: string
}

const WALLETS: IWallet[] = [
  {
    key: 'nami',
    icon: '/images/wallets/nami.svg',
    name: 'Nami',
  },
  {
    key: 'eternl',
    icon: '/images/wallets/eternl.webp',
    name: 'Eternl',
  },
  {
    key: 'typhon',
    icon: '/images/wallets/typhon.svg',
    name: 'Typhon',
  },
  {
    key: 'gero',
    icon: '/images/wallets/gero.svg',
    name: 'Gero',
  },
  {
    key: 'flint',
    icon: '/images/wallets/flint.svg',
    name: 'Flint',
  },
]

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

const WalletItem = ({item, onClick}: {item: IWallet, onClick?: (i: IWallet) => void}) => {
  return (
    <div className={'flex items-center w-full cursor-pointer hover:bg-slate-800 px-4 py-2'}
         onClick={() => onClick?.(item)}
    >
      <img src={item.icon} className={'h-[36px] w-[36px] mr-8'}/>
      <div className={'text-lg'}>{item.name}</div>
    </div>
    )
}

const ConnectButton = () => {
  const cardano = useCardano();
  const walletProvider = CARDANO_WALLET_PROVIDER.NAMI;
  const hover = useHover();

  const handleConnectWallet = async (wallet: IWallet) => {
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
    <div className={'relative z-10 select-none'}>
      <a onMouseEnter={hover.handleMouseEnter}
         onMouseLeave={hover.handleMouseLeave}
         className={`hover:bg-white hover:no-underline
                px-8 py-3
                bg-primary text-primary-contrast
                text-lg font-bold rounded
                cursor-pointer`}
      >
        {'Connect Wallet'}
      </a>
      {hover.isHover && <div className={'absolute top-0 right-0 mt-[46px] pt-[10px] w-full'}
             onMouseEnter={hover.handleMouseEnter}
             onMouseLeave={hover.handleMouseLeave}
      >
        <div className={'border '}>
          {WALLETS.map((i) => {
            return <WalletItem key={i.key} item={i} onClick={handleConnectWallet}/>
          })}
        </div>
      </div>}
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
                bg-primary text-primary-contrast
                cursor-pointer`}
      >{'Sign Out'}</a>
    </div>
  )
}