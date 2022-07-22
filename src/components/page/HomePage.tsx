import { Player } from '../player/Player';
import useUser from '../../hooks/useUser';
import { useMemo } from 'react';
import { IAssetInfo } from '../../api/wallet-asset';

export const HomePage = () => {
  const { user } = useUser('user-main');
  const filteredAssets: IAssetInfo[] = useMemo(() => {
    return (
      user.walletFunds?.assets.filter((asset) => asset?.info?.file?.src) ?? []
    );
  }, [user]);

  return <Player assets={filteredAssets}/>
}