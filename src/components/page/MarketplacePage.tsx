import { Link } from 'react-router-dom';
import * as React from 'react';

export const MarketplacePage = () => {
  return <div className={'flex-1 grid items-center justify-center'}>
    <div className={'text-center grid gap-2'}>
      <div className={'text-6xl font-bold'}> Marketplace Coming Soon!</div>
      <div className={'text-xl font-bold'}> Connect wallet in <Link to={'/'} className={'text-link'}>Player</Link> to start</div>
    </div>
  </div>;
};