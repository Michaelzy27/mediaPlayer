import { Player } from 'components/player/Player';

// specific create page for big picture learning
import { DemoWallet } from '../components/player/DemoWallet';
import { HomePage } from '../components/page/HomePage';

export const ROUTES = [
  { path: '/', title: 'Home', exact: true, component: HomePage },
  {
    path: '/demo/:wallet',
    title: 'Demo Wallet',
    exact: true,
    component: DemoWallet,
  },
];

export const MENU_ITEMS = [
  {
    key: 'home',
    path: '/',
    text: 'Home',
  },
  {
    key: 'demo',
    path: '/demo/addr1q9hksp2l33ump9zgsx50jzz8kxpa6gg2nkl7a6mylv9dx8rmj9yzruu59zpne7ks62vdhx86dcx9kwujazfq98zwn9kql5nct5',
    text: 'Demo',
  },
];
