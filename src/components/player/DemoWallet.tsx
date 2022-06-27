import ResponsiveContainer from '../common/ResponsiveContainer';
import BackLink from '../common/BackLink';
import { Button, Card } from 'antd';
import { AssetsList } from './AssetsList';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IAssetInfo, WalletAssetAPI } from '../../api/wallet-asset';

export const DemoWallet = () => {
  const { wallet } = useParams<{ wallet: string }>();
  const [assets, setAssets] = useState<IAssetInfo[]>([]);

  useEffect(() => {
    if (wallet != null){
      WalletAssetAPI.get(wallet).then((r) => {
        if (r != null){
          setAssets(r.assets);
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
