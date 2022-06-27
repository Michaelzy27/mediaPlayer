import { useState } from 'react';

export interface IAsset {
  policyId: string;
  assetId: string;
  name: string;
  onchain_metadata: any;
}

export interface WalletFunds {
  stakeAddress: string;
  assets: IAsset[];
  lovelace: number;
}

interface IUser {
  email: 'minh.tuan@m1studio.co';
  picture?: string;
  name?: string;
  displayName?: string;
  givenName?: string;
  familyName?: string;
  walletFunds?: WalletFunds;
}

const useUser = (): {
  user: IUser;
  setWalletFunds: Function;
} => {
  const [walletFunds, _setWalletFunds] = useState<WalletFunds>();
  const setWalletFunds = (walletFunds: WalletFunds) => {
    _setWalletFunds(walletFunds);
  };
  return {
    user: {
      displayName: 'Tuan Pham',
      email: 'minh.tuan@m1studio.co',
      walletFunds,
    },
    setWalletFunds
  };
};

export default useUser;
