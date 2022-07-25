import { notification } from 'antd';
import API from 'api';
import { getErrorMessageObj } from 'utils/response';
import { CARDANO_WALLET_PROVIDER, useWallets } from '../../hooks/useWallet';
import Auth from '../../auth/Auth';
import useUser from '../../hooks/useUser';
import { signOut } from '../../utils/auth';
import { useHover } from '../../hooks/useHover';
import classNames from 'classnames';


interface IWallet {
  key: CARDANO_WALLET_PROVIDER,
  icon: string
  name: string
  disabled?: boolean,
}

const WALLETS: IWallet[] = [
  {
    key: CARDANO_WALLET_PROVIDER.NAMI,
    icon: '/images/wallets/nami.svg',
    name: 'Nami',
  },
  {
    key: CARDANO_WALLET_PROVIDER.ETERNL,
    icon: '/images/wallets/eternl.webp',
    name: 'Eternl',
  },
  {
    key: CARDANO_WALLET_PROVIDER.GERO,
    icon: '/images/wallets/gero.svg',
    name: 'Gero',
  },
  {
    key: CARDANO_WALLET_PROVIDER.TYPHON,
    icon: '/images/wallets/typhon.svg',
    name: 'Typhon',
    disabled: true,
  },
  {
    key: CARDANO_WALLET_PROVIDER.FLINT,
    icon: '/images/wallets/flint.svg',
    name: 'Flint',
    disabled: true,
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
    <div className={classNames('flex items-center w-full cursor-pointer rounded-lg hover:bg-slate-800 px-4 py-2', {
      'pointer-events-none text-gray-500': item.disabled,
    })}
         onClick={() => onClick?.(item)}
    >
      <img src={item.icon} className={classNames('h-[36px] w-[36px] mr-8', {
        'grayscale': item.disabled
      })}/>
      <div className={'text-lg'}>{item.name}</div>
    </div>
    )
}

const ConnectButton = (props: { }) => {
  const wallets = useWallets();
  const hover = useHover();

  const handleConnectWallet = async (i: IWallet) => {
    const wallet = wallets[i.key];
    const walletInstance = await wallet.get();
    if (walletInstance == null){
      notification.error({message: `${i.name} wallet is not available`});
    }
    else {
      const usedAddresses = await walletInstance.getUsedAddresses();
      console.log('used', usedAddresses);
      const addressHex = usedAddresses[0];

      const [data, error] = await API.User.getAuth(addressHex);
      if (error) {
        notification['error'](getErrorMessageObj(error));
        return;
      }

      const payload = Buffer.from(data.message, 'utf-8').toString('hex');

      console.log('SIGNING', {addressHex, payload})
      const { signature, key } = await walletInstance.signData(
        addressHex,
        payload
      );
      await sendAuth(addressHex, signature, key);
    }

    // await cardano.enable(walletProvider);
    // const usedAddresses = await cardano.getUsedAddresses(walletProvider);
    // console.log('used', usedAddresses);
    // const addressHex = usedAddresses[0];
    //
    // const [data, error] = await API.User.getAuth(addressHex);
    // if (error) {
    //   notification['error'](getErrorMessageObj(error));
    //   return;
    // }
    //
    // const payload = data.message;
    //
    // const { signature, key } = await cardano.signData(
    //   walletProvider,
    //   addressHex,
    //   payload
    // );
    // await sendAuth(addressHex, signature, key);
  };

  return (
    <div className={'relative z-10 select-none'}>
      <a onMouseEnter={hover.handleMouseEnter}
         onMouseLeave={hover.handleMouseLeave}
         className={classNames(`
                px-8 py-3
                bg-primary
                text-lg font-bold rounded
                cursor-pointer`, {
           'bg-slate-700 text-primary': hover.isHover,
           'text-primary-contrast': !hover.isHover,
         })}
      >
        {'Connect Wallet'}
      </a>
      {/* Dropdown */}
      {hover.isHover && <div className={'absolute top-0 right-0 mt-[46px] pt-[10px] w-full'}
             onMouseEnter={hover.handleMouseEnter}
             onMouseLeave={hover.handleMouseLeave}
      >
        <div className={'border-2 rounded-lg p-1 bg-black'}>
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