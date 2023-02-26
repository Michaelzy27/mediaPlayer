import { getBech32EncodedAddress } from 'api/utils';
import { IAssetInfo, WalletAssetAPI } from 'api/wallet-asset';
import Auth, { AuthState } from 'auth/Auth';
import { useCallback, useEffect, useState } from 'react';

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
      const r = await WalletAssetAPI.get(bech32Addr);
      if (r != null) {
        assets = assets.concat(r.assets);
      } else {
        await WalletAssetAPI.resync(bech32Addr);
        const r2 = await WalletAssetAPI.get(bech32Addr);
        if (r2 != null) {
          assets = assets.concat(r2.assets);
        }
      }
      const lovelace = parseInt(assets.find((i) => i.unit === 'lovelace')?.quantity ?? '-1');
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
