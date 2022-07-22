import { Player } from 'components/player/Player';

// specific create page for big picture learning
import { HomePage } from '../components/page/HomePage';
import { DemoPage } from '../components/page/DemoPage';
import { MintPage } from '../components/page/MintPage';
import { MarketplacePage } from '../components/page/MarketplacePage';

export const ROUTES = [
  {
    path: '/',
    title: 'Player',
    exact: true,
    component: HomePage
  },
  {
    path: '/demo/:wallet',
    title: 'Demo Wallet',
    exact: true,
    component: DemoPage
  },
  {
    path: '/demo',
    title: 'Demo Wallet',
    exact: true,
    component: DemoPage
  },
  {
    path: '/mint',
    title: 'Mint ur own song',
    exact: true,
    component: MintPage,
  },
  {
    path: '/marketplace',
    title: 'Marketplace',
    exact: true,
    component: MarketplacePage,
  }
];

export const MENU_ITEMS = [
  {
    key: 'home',
    path: '/',
    text: 'Player'
  },
  {
    key: 'demo',
    path: '/demo',
    text: 'Demo'
  },
  {
    key: 'mint',
    path: '/mint',
    text: 'Mint'
  },
  {
    key: 'marketplace',
    path: '/marketplace',
    text: 'Marketplace'
  }
];
