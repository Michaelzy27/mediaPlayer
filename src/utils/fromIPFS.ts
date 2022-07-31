
const ipfsURL = "https://ipfs.blockfrost.dev/ipfs/";
const ipfsPrefix = "ipfs://";
const ipfsPrefix2 = "ipfs://ipfs/";
export const fromIPFS = (src: string | undefined) => {
  if (typeof src === 'string'){
    let a = src.replace(ipfsPrefix2, "");
    a = a.replace(ipfsPrefix, "");
    return ipfsURL + a;
  }
  return;
}