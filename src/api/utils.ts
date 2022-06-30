import { AxiosResponse } from 'axios';

import { signOut } from 'utils/auth';
import { bech32 } from 'bech32';

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

function hexToBytes(hex: string) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

export const getBech32EncodedAddress = (addressHex: string) => {
  const bytes = hexToBytes(addressHex);
  const words = bech32.toWords(bytes);
  return bech32.encode('addr', words, 256);
};
