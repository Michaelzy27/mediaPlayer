import { useCallback } from 'react';

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
}

interface ICardanoConfigPlugin {
  nami: INamiConfigPlugin;
}

interface ICardanoPlugin {
  enable: Function;
  getUsedAddresses: Function;
  signData: Function;
}

declare global {
  interface Window {
    cardano: ICardanoConfigPlugin;
    __nami: INamiPlugin;
  }
}

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
  return {
    enable,
    getUsedAddresses,
    signData,
  };
};

export default useCardano;
