import { notification } from 'antd';
import { CARDANO_WALLET_PROVIDER, useWallets } from '../../hooks/useWallet';
import Auth from '../../auth/Auth';
import useUser from '../../hooks/useUser';
import { signOut } from '../../utils/auth';
import { useHover } from '../../hooks/useHover';
import classNames from 'classnames';
import { ADA_SYMBOL } from '../../utils/constants';
import { lovelaceToADAString, shortWalletAddress } from '../../utils/string';
import { UserAPI } from '../../api/user';


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
    name: 'Nami'
  },
  {
    key: CARDANO_WALLET_PROVIDER.ETERNL,
    icon: '/images/wallets/eternl.webp',
    name: 'Eternl'
  },
  {
    key: CARDANO_WALLET_PROVIDER.GERO,
    icon: '/images/wallets/gero.svg',
    name: 'Gero'
  },
  {
    key: CARDANO_WALLET_PROVIDER.TYPHON,
    icon: '/images/wallets/typhon.svg',
    name: 'Typhon',
    disabled: true
  },
  {
    key: CARDANO_WALLET_PROVIDER.FLINT,
    icon: '/images/wallets/flint.svg',
    name: 'Flint',
    disabled: true
  }
];


const sendAuth = async (
  addressHex: string,
  signature: string,
  key?: string
) => {
  const data = await UserAPI.sendAuth(addressHex, signature, key);

  const token = data.token;
  Auth.initSession(addressHex, token);
};

export const WalletButton = () => {
  const { user } = useUser('header');


  return <div className={'flex'}>
    {!user.walletAddress && <ConnectButton />}
    {user.walletAddress && <SignOutButton />}
  </div>;
};

const WalletItem = ({ item, onClick }: { item: IWallet, onClick?: (i: IWallet) => void }) => {
  return (
    <div className={classNames('flex items-center w-full cursor-pointer rounded-lg hover:bg-slate-800 px-4 py-2', {
      'pointer-events-none text-gray-500': item.disabled
    })}
         onClick={() => onClick?.(item)}
    >
      <img src={item.icon} className={classNames('h-[36px] w-[36px] mr-8', {
        'grayscale': item.disabled
      })} />
      <div className={'text-lg'}>{item.name}</div>
    </div>
  );
};

const DropdownItem = (props: {
  label: string,
  icon?: string,
  disabled?: string,
  onClick?: () => void,
}) => {
  return (
    <div className={classNames('flex items-center w-full cursor-pointer rounded-lg hover:bg-slate-800 px-4 py-2', {
      'pointer-events-none text-gray-500': props.disabled
    })}
         onClick={() => props.onClick?.()}
    >
      {props.icon &&
        <img src={props.icon} className={classNames('h-[36px] w-[36px] mr-8', {
          'grayscale': props.disabled
        })} />}
      <div className={'text-lg'}>{props.label}</div>
    </div>
  );
};

const ConnectButton = (props: {}) => {
  const wallets = useWallets();
  const hover = useHover();

  const handleConnectWallet = async (i: IWallet) => {
    const wallet = wallets[i.key];
    const walletInstance = await wallet.get();
    if (walletInstance == null) {
      notification.error({ message: `${i.name} wallet is not available` });
    } else {
      const usedAddresses = await walletInstance.getUsedAddresses();
      const addressHex = usedAddresses[0];

      const data = await UserAPI.getAuth(addressHex);

      const payload = Buffer.from(data.message, 'utf-8').toString('hex');

      const signature = await walletInstance.signData(
        addressHex,
        payload
      );

      if (typeof signature === 'string' ){
        await sendAuth(addressHex, signature);
      }
      else {

        await sendAuth(addressHex, signature.signature, signature.key);
      }

    }
  };

  return (
    <div className={'relative z-10 select-none grid items-center'}>
      <div onMouseEnter={hover.handleMouseEnter}
           onMouseLeave={hover.handleMouseLeave}
           className={classNames(`
                px-8 py-3
                bg-primary
                text-lg font-bold rounded
                cursor-pointer`, {
             'bg-slate-700 text-primary': hover.isHover,
             'text-primary-contrast': !hover.isHover
           })}
      >
        {'Connect Wallet'}
      </div>
      {/* Dropdown */}
      <div className={classNames('absolute top-0 right-0 mt-[46px] pt-[10px] w-full',
        'transition-all duration-300', {
          'opacity-0 pointer-events-none -translate-y-2': !hover.isHover,
          'opacity-100 translate-y-0': hover.isHover
        })}
           onMouseEnter={hover.handleMouseEnter}
           onMouseLeave={hover.handleMouseLeave}
      >
        <div className={'border-2 rounded-lg p-1 bg-black'}>
          {WALLETS.map((i) => {
            return <WalletItem key={i.key} item={i} onClick={handleConnectWallet} />;
          })}
        </div>
      </div>
    </div>
  );
};

const SignOutButton = () => {
  const { user } = useUser();

  const hover = useHover();

  return (
    <div className={'relative z-10 select-none grid items-center'}>
      <div
        onMouseEnter={hover.handleMouseEnter}
        onMouseLeave={hover.handleMouseLeave}
        className={classNames(`flex items-center px-8 py-3 gap-4
                bg-primary text-lg font-bold rounded
                cursor-pointer`, {
          'bg-slate-700 text-primary': hover.isHover,
          'text-primary-contrast': !hover.isHover
        })}
      >
        <div className={'text-sm'}>{shortWalletAddress(user.walletAddress)}</div>
        <div>{`${lovelaceToADAString(user.walletFunds?.lovelace)} ${ADA_SYMBOL}`}</div>
      </div>

      {/* Dropdown */}
      <div className={classNames('absolute top-0 right-0 mt-[46px] pt-[10px] w-full',
        'transition-all duration-300', {
          'opacity-0 pointer-events-none -translate-y-2': !hover.isHover,
          'opacity-100 translate-y-0': hover.isHover
        })}
           onMouseEnter={hover.handleMouseEnter}
           onMouseLeave={hover.handleMouseLeave}
      >
        <div className={'border-2 rounded-lg p-1 bg-black'}>
          <DropdownItem
            label={'Sign out'}
            onClick={signOut} />
        </div>
      </div>
    </div>
  );
};