// specific create page for big picture learning
import { HomePage } from '../components/page/HomePage';
import { DemoPage } from '../components/page/DemoPage';
import { MintPage } from '../components/page/MintPage';
import { MarketplacePage } from '../components/page/MarketplacePage';
import { VotePage } from '../components/page/VotePage';

export interface IRoute {
  path: string;
  title: string;
  exact: boolean;
  component: () => JSX.Element,
}

export const ROUTES : IRoute[] = [
  {
    path: '/',
    title: 'Player',
    exact: true,
    component: HomePage,
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
    path: '/vote',
    title: 'Vote for us on Catalyst',
    exact: true,
    component: VotePage
  },
  {
    path: '/mint',
    title: 'Mint ur own song',
    exact: true,
    component: MintPage
  },
  {
    path: '/marketplace',
    title: 'Marketplace',
    exact: true,
    component: MarketplacePage
  }
];
export const ROUTES_MOBILE: IRoute[] = [
  {
    path: '/',
    title: 'Player',
    exact: true,
    component: VotePage,
  },
]

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
    key: 'vote',
    path: '/vote',
    text: 'Vote'
  },
  {
    key: 'more',
    text: 'More',
    items: [
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
    ]
  }
];
