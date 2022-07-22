
const ipfsURL = "https://ipfs.blockfrost.dev/ipfs/";
const ipfsPrefix = "ipfs://";
export const fromIPFS = (src: string | undefined) => {
  if (typeof src === 'string'){
    return ipfsURL + src.replace(ipfsPrefix, "");
  }
  return;
}