import { Player } from '../player/Player';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { IAssetInfo, WalletAssetAPI } from '../../api/wallet-asset';

export const DemoPage = () => {
  const { wallet = 'addr1q9hksp2l33ump9zgsx50jzz8kxpa6gg2nkl7a6mylv9dx8rmj9yzruu59zpne7ks62vdhx86dcx9kwujazfq98zwn9kql5nct5' } = useParams<{ wallet: string }>();

  const [assets, setAssets] = useState<IAssetInfo[] | null>(null);

  useEffect(() => {
    if (wallet != null){
      const wallet_ = wallet;
      WalletAssetAPI.get(wallet_).then(async (r) => {
        if (wallet_ === wallet){
          console.log(r)
          if (r != null){
            setAssets(r.assets);
          }
          else {
            await WalletAssetAPI.resync(wallet_);
            const r2 = await WalletAssetAPI.get(wallet_);
            if (r2 != null){
              setAssets(r2.assets);
            }
          }
        }
      })
    }
  }, [wallet]);

  if (assets == null){
    return <div className={ 'flex-1 grid items-center justify-center' }>
      <div className={'text-center grid gap-2'}>
        {/*<div className={'text-6xl font-bold'}> Demo </div>*/}
        <div className={'text-xl font-bold'}> Loading demo wallet... </div>
      </div>
    </div>
  }

  return <Player assets={assets}/>
}