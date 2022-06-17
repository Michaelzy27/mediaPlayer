import { useEffect, useMemo } from 'react';
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
} => {
  return {
    user: {
      displayName: 'Tuan Pham',
      email: 'minh.tuan@m1studio.co',
    },
  };
};

export default useUser;
