import { Player } from '../player/Player';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { IAssetInfo, WalletAssetAPI } from '../../api/wallet-asset';
import { DEMO_WALLET } from 'utils/constants';


export const DemoPage = () => {
  let { wallet } = useParams<{ wallet: string }>();
  const isDemo = wallet == null;
  wallet ??= DEMO_WALLET;

  const [assets, setAssets] = useState<IAssetInfo[] | null>(null);

  useEffect(() => {
    if (wallet != null) {
      const wallet_ = wallet;
      Promise.all([
        WalletAssetAPI.get(wallet_),
      ])
        .then(async ([audio]) => {
          if (wallet_ === wallet) {
            const assets = [...(audio?.assets ?? [])];
            if (assets.length > 0) {
              setAssets(assets);
            } else {
              await WalletAssetAPI.resync(wallet_);
              const r2 = await WalletAssetAPI.get(wallet_);
              if (r2 != null) {
                setAssets(r2.assets);
              }
            }
          }
        });
    }
  }, [wallet]);

  if (assets == null) {
    return <div className={'flex-1 grid items-center justify-center'}>
      <div className={'text-center grid gap-2'}>
        {/*<div className={'text-6xl font-bold'}> Demo </div>*/}
        <div className={'text-xl font-bold'}> Loading demo wallet...</div>
      </div>
    </div>;
  }

  return <Player assets={assets} random={isDemo} />;
};