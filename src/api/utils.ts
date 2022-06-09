import { AxiosResponse } from 'axios';

import { signOut } from 'utils/auth';

export const handleAPIPromise = async (
  promise: Promise<AxiosResponse>
): Promise<[any | undefined, any | undefined]> => {
  try {
    const response = await promise;
    return [response.data, undefined];
  } catch (error: any) {
    if (error.response?.status === 401) {
      // unauthorised, sign out and remove user data
      signOut().then(() => {
        // TODO: action signout
      });
    }
    console.error(error);
    return [undefined, error];
  }
};
