import { Player } from '../player/Player';
import useUser from '../../hooks/useUser';
import { useMemo } from 'react';
import { IAssetInfo } from '../../api/wallet-asset';

export const MarketplacePage = () => {
  return <div className={'flex-1 grid items-center justify-center'}>
    <div className={'text-center grid gap-2'}>
      <div className={'text-6xl font-bold'}> Marketplace coming Soon!</div>
      <div className={'text-xl font-bold'}> Connect wallet in Player to start</div>
    </div>
  </div>;
};