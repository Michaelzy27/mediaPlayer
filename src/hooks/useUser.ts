import { useState } from 'react';
import { WalletFunds } from './useCardano';
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
    // blabla
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
