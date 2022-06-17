import { useCallback } from 'react';
import API from 'api';

export enum CARDANO_WALLET_PROVIDER {
  NAMI = 'NAMI',
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

interface ICardanoPlugin {
  enable: Function;
  getUsedAddresses: Function;
  signData: Function;
  // add by Chau 2022-06-14 start
  getStakeAddress: Function;
  // add by Chau 2022-06-14 end
}

declare global {
  interface Window {
    cardano: ICardanoConfigPlugin;
    __nami: INamiPlugin;
  }
}
// add by Chau 2022-06-14 start

interface GetStakeAddressResponse {
  stakeAddress: string;
  error: string;
}

export interface Asset {
  policyId: string;
  assetId: string;
  name: string;
}

export interface WalletFunds {
  stakeAddress: string;
  assets: Asset[];
  lovelace: number;
}

const _stakeAddressByWalletAddressHex = new Map<string, string>();
// add by Chau 2022-06-14 end

function toHexString(str: string) {
  const byteArray = new TextEncoder().encode(str);
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
}

const useCardano = (): ICardanoPlugin => {
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

export default useCardano;
