export function getPolicyId(fullAssetId: string) {
  if (fullAssetId.length < 56) throw `Invalid assetId length: ${fullAssetId}`;
  return fullAssetId.substr(0, 56);
}

export function getAssetHex(fullAssetId: string) {
  if (fullAssetId.length < 56) throw 'Invalid assetId length';
  return fullAssetId.substr(56);
}
