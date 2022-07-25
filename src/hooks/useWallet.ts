import { useCallback, useState } from 'react';
import { Buffer } from 'buffer';
import { notification } from 'antd';

globalThis.Buffer = Buffer;

export enum CARDANO_WALLET_PROVIDER {
  NAMI = 'NAMI',
  ETERNL = 'ETERNL',
  GERO = 'GERO',
  TYPHON = 'TYPHON',
  FLINT = 'FLINT',
}

interface ICardanoWallet {
  enable: Function;
  getUsedAddresses: Function;
  signData: Function;
  getStakeAddress: Function;
}

declare global {
  interface Window {
    a: string;
    cardano: {
      nami: {
        enable: Function
      },
      eternl: {
        enable: Function
      }
      gerowallet: {
        enable: Function
      }
      typhon: {
        enable: Function
      }
      flint: {
        enable: Function
      }
    };
  }
}

const getWalletInstance = async (provider: CARDANO_WALLET_PROVIDER): Promise<ICardanoWallet | null> => {
  try {
    if (provider === CARDANO_WALLET_PROVIDER.NAMI) {
      return await window.cardano.nami?.enable();
    } else if (provider === CARDANO_WALLET_PROVIDER.ETERNL) {
      return await window.cardano.eternl?.enable();
    } else if (provider === CARDANO_WALLET_PROVIDER.GERO) {
      return await window.cardano.eternl?.enable();
    } else if (provider === CARDANO_WALLET_PROVIDER.TYPHON) {
      return await window.cardano.typhon?.enable();
    } else if (provider === CARDANO_WALLET_PROVIDER.FLINT) {
      return await window.cardano.flint?.enable();
    }
  } catch (e: any) {
    notification.error({ message: e.info ?? JSON.stringify(e) });
    return null;
  }
  return null;
};

const wallets: { [key in CARDANO_WALLET_PROVIDER]?: ICardanoWallet | null | undefined } = {};

export const useWallet = (provider: CARDANO_WALLET_PROVIDER) => {
  const [wallet, setWallet] = useState(wallets[provider]);
  const get = async () => {
    if (wallet === undefined) {
      /// try to get wallet
      const ans = await getWalletInstance(provider);
      wallets[provider] = ans;
      setWallet(ans);
      return ans;
    } else {
      return wallet;
    }
  };

  return { get };
};

export const useWallets = () => {
  const nami = useWallet(CARDANO_WALLET_PROVIDER.NAMI);
  const eternal = useWallet(CARDANO_WALLET_PROVIDER.ETERNL);
  const gero = useWallet(CARDANO_WALLET_PROVIDER.GERO);
  const typhon = useWallet(CARDANO_WALLET_PROVIDER.TYPHON);
  const flint = useWallet(CARDANO_WALLET_PROVIDER.FLINT);
  return {
    [CARDANO_WALLET_PROVIDER.NAMI]: nami,
    [CARDANO_WALLET_PROVIDER.ETERNL]: eternal,
    [CARDANO_WALLET_PROVIDER.GERO]: gero,
    [CARDANO_WALLET_PROVIDER.TYPHON]: typhon,
    [CARDANO_WALLET_PROVIDER.FLINT]: flint
  };
};
