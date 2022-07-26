import { AxiosResponse } from 'axios';

import { signOut } from 'utils/auth';
import { bech32 } from 'bech32';

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
