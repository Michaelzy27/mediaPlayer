import { bech32 } from "bech32";

export function getPolicyId(fullAssetId: string) {
  if (fullAssetId.length < 56) throw `Invalid assetId length: ${fullAssetId}`;
  return fullAssetId.substr(0, 56);
}

export function splitPolicyId(fullAssetId: string){
  return [getPolicyId(fullAssetId), getAssetHex(fullAssetId)];
}

export function getAssetHex(fullAssetId: string) {
  if (fullAssetId.length < 56) throw 'Invalid assetId length';
  return fullAssetId.substr(56);
}

function hexToBytes(hex: string) {
  return Buffer.from(hex, "hex");
}

export const addressHexToBech32 = (addressHex: string) => {
  const bytes = hexToBytes(addressHex);
  const words = bech32.toWords(bytes);
  return bech32.encode("addr", words, 256);
};
