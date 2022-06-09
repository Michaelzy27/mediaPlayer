import UserMain from 'components/user/UserMain';

// specific create page for big picture learning
import NotificationSettings from 'components/user/NotificationSettings';

export const ROUTES = [
  { path: '/', title: 'Home', exact: true, component: UserMain },
  { path: '/user', title: 'Account', exact: true, component: UserMain },
  {
    path: '/settings/notifications',
    title: 'Notification Settings',
    exact: true,
    component: NotificationSettings,
  },
];

export const MENU_ITEMS = [
  {
    key: 'home',
    path: '/',
    text: 'Home',
  },
  {
    key: 'settings',
    path: '/settings/notifications',
    text: 'Settings',
  },
];
