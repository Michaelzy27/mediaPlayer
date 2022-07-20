import { Button, Col, notification, Row } from 'antd';
import API from 'api';
import Auth from 'auth/Auth';
import useBreakpoints from 'hooks/useBreakpoints';
import useCardano, { CARDANO_WALLET_PROVIDER } from 'hooks/useCardano';
import useRouteParams from 'hooks/useRouteParams';
import useUser from 'hooks/useUser';
import { Link } from 'react-router-dom';
import { MENU_ITEMS } from 'routes';
import { signOut } from 'utils/auth';
import { getErrorMessageObj } from 'utils/response';
import { Menu } from '../common/Menu';
import { WalletButton } from '../common/WalletButton';

export const AppHeader = () => {
  const { breakpoints } = useBreakpoints();
  const { navMenuKey } = useRouteParams();

  // const logoSrc = breakpoints.xs
  //   ? 'sound-rig-logo-sm.svg'
  //   : 'sound-rig-logo.png';
  const logoSrc = 'SoundRig-logo-2.png';

  return (
    <div className={'flex'}>
      <div className={'flex-1'}>
        <Link to='/' aria-label='Home'>
          <img
            src={`/images/${logoSrc}`}
            alt='sound-rig logo'
            className='app-logo h-10 pl-2'
          />
        </Link>
      </div>
      <div className={'flex-1'}>
        <Menu
          selectedKey={navMenuKey}
          items={MENU_ITEMS.map((i) => {
            return {
              label: i.text,
              key: i.key,
              path: i.path
            };
          })}
        />
      </div>
      <div className={'flex-1'}>
        <WalletButton />
      </div>
    </div>
  );
};
