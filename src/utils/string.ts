import { addressHexToBech32 } from './cardano';

export const shortWalletAddress = (wallet?: string) => {
  if (!wallet) return null;
  const bech = addressHexToBech32(wallet);
  return bech.slice(0, 6) + '...' + bech.slice(-6);
}

export const lovelaceToADAString = (lovelace?: number) => {
  if (!lovelace)  return '0';

  return ((lovelace - lovelace % 10000) / 1000000).toString()
}