import { useEffect, useMemo } from 'react';
interface IUser {
  email: 'minh.tuan@m1studio.co';
  picture?: string;
  name?: string;
  displayName?: string;
  givenName?: string;
  familyName?: string;
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
