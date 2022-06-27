import ResponsiveContainer from '../common/ResponsiveContainer';
import { Card } from 'antd';
import { AssetsList } from './AssetsList';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IAssetInfo, WalletAssetAPI } from '../../api/wallet-asset';

export const DemoWallet = () => {
  const { wallet } = useParams<{ wallet: string }>();
  const [assets, setAssets] = useState<IAssetInfo[]>([]);

  useEffect(() => {
    if (wallet != null){
      WalletAssetAPI.get(wallet).then(async (r) => {
        console.log(r)
        if (r != null){
          setAssets(r.assets);
        }
        else {
          await WalletAssetAPI.resync(wallet);
          const r2 = await WalletAssetAPI.get(wallet);
          if (r2 != null){
            setAssets(r2.assets);
          }
        }
      })
    }
  }, [wallet]);
  console.log(assets);

  return <>
    <ResponsiveContainer className="my-6">
      <Card title={`Wallet ${wallet}`}>
        {/*<div>*/}
        {/*  <h3>Wallet ${wallet}</h3>*/}
        {/*</div>*/}
      </Card>
      <Card title="List assest" >
        <AssetsList assets={assets} />
      </Card>
    </ResponsiveContainer>
  </>
}
