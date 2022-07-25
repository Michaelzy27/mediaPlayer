import API from 'api';
import { getBech32EncodedAddress } from 'api/utils';
import { IAssetInfo } from 'api/wallet-asset';
import Auth, { AuthState } from 'auth/Auth';
import { useCallback, useEffect, useState } from 'react';

const tempAssets: Asset[] = [
  {
    asset:
      '053b4a4c0e5b7a3904366f19db7cc90dd1ea54da3e4a23222f6db7aa4c75636369323430',
    policy_id: '053b4a4c0e5b7a3904366f19db7cc90dd1ea54da3e4a23222f6db7aa',
    asset_name: '4c75636369323430',
    fingerprint: 'asset1chq7avp6f9un56x5sg2275m9r7dt9dew59aqq3',
    quantity: '1',
    initial_mint_tx_hash:
      'ee8a6bf48bd1b7616d9d121dd30a509d52e22285cf9fe40bebb67dfa4ae11836',
    mint_or_burn_count: 1,
    onchain_metadata: {
      name: 'KYD JU$E - Lucci #240',
      image: 'ipfs://Qmd5eRve64Kq6AvCivSAZqD5uQXSZmish7KMR95SYSEKpQ',
      Title: 'Lucci by KYD JU$E',
      files: [
        {
          src: 'ipfs://QmP4FyS1AUuNDv67vQxS71PC6dKa5YWX3t41Pe8KYjouWW',
          name: 'KYD JU$E - Lucci #240',
          mediaType: 'audio/mpeg',
        },
      ],
      Artist: 'KYD JU$E',
      Twitter: 'https://twitter.com/kydjuse',
      Quantity: '250',
      Copyright: 'JU$E Music ©',
      Publisher: 'JU$E Music',
      Royalties: '5%',
      mediaType: 'image/png',
      'Use Rights': 'This NFT is a non-exclusive license to use in perpetuity.',
      Description:
        'Use the link to unlock private link to stream via Soundcloud',
      description: 'Lucci is the first single released by KYD JUSE on Cardano.',
      'Unlock Feature': 'https://tinyurl.com/jusedrops',
      'Publishers Website': 'https://www.jusemusic.com',
    },
    metadata: null,
  },
  {
    asset:
      '63df49056617dd14034986cf7c250bad6552fd2f0f9c71d79793200843617264616e6f537061636553657373696f6e',
    policy_id: '63df49056617dd14034986cf7c250bad6552fd2f0f9c71d797932008',
    asset_name: '43617264616e6f537061636553657373696f6e',
    fingerprint: 'asset1936h4ft75wf6aqm3plhy82lzq64p3e8mxcr060',
    quantity: '24',
    initial_mint_tx_hash:
      '8e99c12421acd1eca1d8d417c75d8e3beab77b7a7625dd2f4c9d6e8aaa3ac11d',
    mint_or_burn_count: 24,
    onchain_metadata: {
      name: 'Cardano Space Session',
      image: 'ipfs://QmNwTqgma1rH9gqp19MEZgDoD79VA7Kh45R9jJAHcvqtTN',
      files: [
        {
          src: 'ipfs://QmaRv4eUD4jZEMS4tHzi1sz9Jbaugmy2dtHfztFixZFFz7',
          name: 'Friendly Infinity',
          arweaveId: 'OjpDmnZp4ULQ7hrq-cKWeaLM4iaaYU_fRiIc_f5-gvU',
          mediaType: 'audio/mpeg',
        },
        {
          src: 'ipfs://QmbxUMezinJSZguMcsNPTUu9MF3oij1muaStEP8LUt1ZEB',
          name: 'Intersection',
          arweaveId: 'xExNs3M27dZZU_5aaUcUaiiG0mPGn9fdSY_IlOIi0Uk',
          mediaType: 'audio/mpeg',
        },
        {
          src: 'ipfs://QmWpZV91kQ3hwk7YvFWvfCDXqgmt2dDjeaiZozBij4FmL2',
          name: 'Save Place',
          arweaveId: 'NU3Yq-lFthH6WTsfNlzo08GZcXacorX8AcLU3mgjfEs',
          mediaType: 'audio/mpeg',
        },
        {
          src: 'ipfs://QmZZVk4NA6XBP4qv9dQ6KsVGeD1o2Pv96MVNdkEk6o4mCa',
          name: 'Spacebeam',
          arweaveId: 'x8NT2SQuPjaomqNdIrW31s3ASWD1tqReR2stypjpHWo',
          mediaType: 'audio/mpeg',
        },
      ],
      author: "Phil z'viel",
      arweaveId: 'EmLzkeapcv8JNuwUgDAUW-GRO1UMN1K9Gp6H4iLLJ5M',
      publisher: ['CardanoSounds.com'],
      description: [
        'The Cardano Space Session is a Music CNFT Album performed and re',
        "corded in one take by Phil z'viel, an instrumental Live-Looping ",
        'Artist. The artwork is designed in collaboration with a dear ',
        'friend who wants to stay anonymous. 250 pieces are minted',
        " with Cardanosounds.com. 50 pieces are kept by Phil z'viel ",
        'and the profit of the first 200 sold pieces will go to Carda',
        'nosounds to support further developing of the platform.',
        'www.philzvielcnft.com',
      ],
    },
    metadata: null,
  },
  {
    asset:
      '6ddd6503e0ab63538c77bd51f679b9ed84998af89901b01ce3dace885369636b43697479333333',
    policy_id: '6ddd6503e0ab63538c77bd51f679b9ed84998af89901b01ce3dace88',
    asset_name: '5369636b43697479333333',
    fingerprint: 'asset1yv9lggxl5f5va9r76nsp45thd7fytphex4p003',
    quantity: '25067',
    initial_mint_tx_hash:
      '099d4d4b9953ea8933cdcc77ca0d930b102b0c826b5f14fe6ea17d4ab85afa94',
    mint_or_burn_count: 68,
    onchain_metadata: {
      name: 'SickCity333-SchhhArt',
      image: 'ipfs://QmXWtWSFMKMmMwcixh4x6nNPVfCqDazo4Lon6MZdRVit4H',
      files: [
        {
          src: 'ipfs://QmYpvuikXCnSk4zRt6PaeidhZwytcmqPn6Lx1zcFJTf3gF',
          mediaType: 'audio/mp3',
        },
      ],
      '3. Genre': 'Rock',
      '5. Twitter': '@SchhhArt',
      '6. Discord': 'https://discord.gg/MD7W5KkVj2',
      '8. Website': 'https://www.michaelschulbaum.com/',
      Collection: 'Epoch Genesis',
      '4. Sub-Genre': 'Funk',
      '9. Copyright': 'SchhhArt',
      '2. Song Title': '2 Damn Ruggy',
      '1. Artist Name': 'SchhhArt',
      '7. Discord User': 'SchhhArt#6887',
    },
    metadata: null,
  },
  {
    asset:
      '6ddd6503e0ab63538c77bd51f679b9ed84998af89901b01ce3dace885369636b43697479333332',
    policy_id: '6ddd6503e0ab63538c77bd51f679b9ed84998af89901b01ce3dace88',
    asset_name: '5369636b43697479333332',
    fingerprint: 'asset1cfmj7qdqmadl2lt7nuawqy0z5r7ec3ph37d3d0',
    quantity: '25061',
    initial_mint_tx_hash:
      '361dbb11fe49af849053b0630a48231e6ddf270ac862dd079ae067190f592e53',
    mint_or_burn_count: 62,
    onchain_metadata: {
      name: 'SickCity332-The Holy Binns',
      image: 'ipfs://QmTWwQajnLDZYA3qEtBbLsXA7Ua9NRFXPfhLnyYECe746U',
      files: [
        {
          src: 'ipfs://QmRcZJH45Ha3GSRJTMMQYwSUBoZVKFKxDAqrgBfi6a1SBx',
          mediaType: 'audio/mp3',
        },
      ],
      '3. Genre': 'R&B',
      '5. Twitter': '@theholybinns',
      '6. Discord': 'none',
      '8. Website': 'https://holyhouse.io',
      Collection: 'Epoch Genesis',
      '4. Sub-Genre': 'Hip Hop',
      '9. Copyright': 'The Holy Binns',
      '2. Song Title': 'Oasis',
      '1. Artist Name': 'The Holy Binns',
      '7. Discord User': 'theholybinns#4619',
    },
    metadata: null,
  },
  {
    asset:
      '8bfaaeff1aff54d81dc81c3f7354f775cc7036cc2212bd88a55ddbaa426f62506561636530343437',
    policy_id: '8bfaaeff1aff54d81dc81c3f7354f775cc7036cc2212bd88a55ddbaa',
    asset_name: '426f62506561636530343437',
    fingerprint: 'asset1jmf8045h7ex4yju7tcwfgaw74wwg0tnz9ddp9c',
    quantity: '1',
    initial_mint_tx_hash:
      '752d8636c4a7ed91c2c997f4b88b9dc3ac88198fc538d0aaa6064e519d633a4a',
    mint_or_burn_count: 1,
    onchain_metadata: {
      name: 'Fall into the Sky 0447',
      image: 'ipfs://QmcqAtwfUCEi7rprr8f2kS5eCk1KwSvtZeUg7gAeqkdokj',
      Album: 'Life after Life',
      files: [
        {
          src: 'ipfs://QmUBmyixAw4yEmkWfSNXjkrMevzD7fpcBo1FwxNxP3wRTt',
          mediaType: 'audio/wav',
        },
      ],
      Artist: 'Bob Peace',
      Download: 'https://bit.ly/3Cw5d97',
      Copyright: 'Humble Company',
      'Visual Art': 'bolognaflapjack',
    },
    metadata: null,
  },
];

export interface Asset {
  policy_id: string;
  asset: string;
  asset_name: string;
  quantity: string;

  onchain_metadata: any;

  fingerprint: string;
  initial_mint_tx_hash: string;
  mint_or_burn_count: number;
  metadata: any;
}

export interface WalletFunds {
  stakeAddress: string;
  assets: IAssetInfo[];
  lovelace: number;
}

interface IUser {
  email?: string;
  picture?: string;
  name?: string;
  displayName?: string;
  givenName?: string;
  familyName?: string;

  walletAddress?: string;
  walletFunds?: WalletFunds;
}

const mapToAssetInfo = (asset: Asset) => {
  return {
    unit: asset.asset,
    quantity: asset.quantity,
    metadataType: 1,
    info: {
      image: asset.onchain_metadata.image,
      name: asset.onchain_metadata.name,
      file: asset.onchain_metadata.files[0],
    },
  } as IAssetInfo;
};

const useUser = (
  k?: string
): {
  user: IUser;
} => {
  const [walletAddress, setWalletAddress] = useState<string>();
  const [walletFunds, setWalletFunds] = useState<WalletFunds>();

  const getAsset = useCallback(async (addressHex?: string) => {
    if (addressHex) {
      const bech32Addr = getBech32EncodedAddress(addressHex);
      // let assets: IAssetInfo[] = tempAssets.map(mapToAssetInfo);
      let assets: IAssetInfo[] = [];
      const r = await API.WalletAssetAPI.get(bech32Addr);
      if (r != null) {
        assets = assets.concat(r.assets);
      } else {
        await API.WalletAssetAPI.resync(bech32Addr);
        const r2 = await API.WalletAssetAPI.get(bech32Addr);
        if (r2 != null) {
          assets = assets.concat(r2.assets);
        }
      }
      const lovelace = 1;
      const walletFunds: WalletFunds = {
        stakeAddress: 'stakeAddress',
        lovelace: lovelace,
        assets: assets,
      };
      return walletFunds;
    }
  }, []);

  useEffect(() => {
    Auth.onAuthStateChanged(async (authState, authData) => {
      console.log('auth', authState, authData);
      setWalletAddress(authData.address);
      if (authState === AuthState.SignedIn) {
        const walletFunds = await getAsset(authData.address);
        setWalletFunds(walletFunds);
      } else if (authState === AuthState.SignedOut) {
        setWalletFunds(undefined);
      }
    }, k ?? 'user');
    return () => {
      Auth.removeOnAuthStateChanged(k ?? 'user');
    };
  }, []);
  return {
    user: {
      displayName: walletAddress
        ? walletAddress.slice(0, 5) + '...' + walletAddress.slice(-5)
        : '',
      walletAddress,
      walletFunds,
    },
  };
};

export default useUser;
