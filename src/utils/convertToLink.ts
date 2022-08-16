const ipfsURL = 'https://ipfs.blockfrost.dev/ipfs/';
const ipfsPrefix = 'ipfs://';
const ipfsPrefix2 = 'ipfs://ipfs/';

const arweaveURL = 'https://snaznabndfe3.arweave.net/';
const arPrefix = 'ar://';

export const convertToLink = (src: string | undefined) => {
  if (typeof src === 'string') {
    if (src.startsWith('ipfs:')) {
      let a = src.replace(ipfsPrefix2, '')
        .replace(ipfsPrefix, '');
      return ipfsURL + a;
    } else if (src.startsWith('ar:')) {
      let a = src.replace(arPrefix, '');
      return arweaveURL + a;
    }
  }
  return;
};
