import { useCallback, useState } from 'react';
import API from 'api';
import {Buffer} from 'buffer'

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
      }
    };
    __nami: INamiPlugin;
  }
}

const getWalletInstance = async (provider: CARDANO_WALLET_PROVIDER) : Promise<ICardanoWallet | null> => {
  if (provider === CARDANO_WALLET_PROVIDER.NAMI){
    return await window.cardano.nami.enable();
  }
  return null
}

const wallets: {[key in CARDANO_WALLET_PROVIDER]?: ICardanoWallet | null | undefined} = {};

export const useWallet = (provider: CARDANO_WALLET_PROVIDER) => {
  const [wallet, setWallet] = useState(wallets[provider]);
  const get = async  () => {
    if (wallet === undefined) {
      /// try to get wallet
      const ans = await getWalletInstance(provider)
      wallets[provider] = ans;
      setWallet(ans);
      return ans;
    }
    else {
      return wallet;
    }
  }

  return {get};
}

export const useWallets = () => {
  const nami = useWallet(CARDANO_WALLET_PROVIDER.NAMI);
  const eternal = useWallet(CARDANO_WALLET_PROVIDER.ETERNL);
  const gero = useWallet(CARDANO_WALLET_PROVIDER.GERO);
  const typhon = useWallet(CARDANO_WALLET_PROVIDER.TYPHON);
  const flint = useWallet(CARDANO_WALLET_PROVIDER.FLINT);
  return {
    [CARDANO_WALLET_PROVIDER.NAMI] : nami,
      [CARDANO_WALLET_PROVIDER.ETERNL] : eternal,
    [CARDANO_WALLET_PROVIDER.GERO] : gero,
    [CARDANO_WALLET_PROVIDER.TYPHON] : typhon,
    [CARDANO_WALLET_PROVIDER.FLINT] : flint,
  }
}

interface INamiConfigPlugin {
  enable: Function;
  signData: Function;
  getUsedAddresses: Function;
}

interface INamiPlugin {
  signData: Function;
  getUsedAddresses: Function;
  // add by Chau 2022-06-14 start
  getUtxos: Function;
  // add by Chau 2022-06-14 end
}

interface ICardanoConfigPlugin {
  nami: INamiConfigPlugin;
}

// add by Chau 2022-06-14 start

interface GetStakeAddressResponse {
  stakeAddress: string;
  error: string;
}

const _stakeAddressByWalletAddressHex = new Map<string, string>();
// add by Chau 2022-06-14 end

function toHexString(str: string) {
  const byteArray = new TextEncoder().encode(str);
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
}

const useCardanoOld = (): ICardanoWallet => {
  const enable = useCallback(
    async (walletProvider: CARDANO_WALLET_PROVIDER) => {
      if (walletProvider === CARDANO_WALLET_PROVIDER.NAMI) {
        console.log('en', window.cardano.nami);
        window.__nami = await window.cardano.nami.enable();
        return window.__nami;
      }
    },
    []
  );
  const getUsedAddresses = useCallback(
    (walletProvider: CARDANO_WALLET_PROVIDER) => {
      if (walletProvider === CARDANO_WALLET_PROVIDER.NAMI) {
        console.log('use', window.__nami);
        if (window.__nami) {
          return window.__nami.getUsedAddresses();
        } else {
          console.error('Nami not enabled yet.');
        }
      }
    },
    []
  );
  const signData = useCallback(
    (
      walletProvider: CARDANO_WALLET_PROVIDER,
      addressHex: string,
      payload: string
    ) => {
      if (walletProvider === CARDANO_WALLET_PROVIDER.NAMI) {
        return window.__nami.signData(addressHex, toHexString(payload));
      }
    },
    []
  );
  // add by Chau 2022-06-14 start
  const getStakeAddress = useCallback(
    async (
      walletAddressHex: string
    ) => {
      if (_stakeAddressByWalletAddressHex.has(walletAddressHex)) {
        return _stakeAddressByWalletAddressHex.get(walletAddressHex)!;
      }
      const  [stake, error] = await API.User.getStakeAddress(walletAddressHex);
      if (error) {
        return error;
      }
      if (stake.stakeAddress) {
        return _stakeAddressByWalletAddressHex.set(walletAddressHex, stake.stakeAddress);
      }
      return '';
    },
    []
  );

  const getUtxos = useCallback(
    (
      walletProvider: CARDANO_WALLET_PROVIDER
    ) => {
      const fn = {
        'NAMI': window.__nami.getUtxos
      }
    },
    []
  );
  
  // add by Chau 2022-06-14 end
  return {
    enable,
    getUsedAddresses,
    signData,
     // add by Chau 2022-06-14 start
    getStakeAddress
     // add by Chau 2022-06-14 end
  };
};

