import useBreakpoints from 'hooks/useBreakpoints';
import useRouteParams from 'hooks/useRouteParams';
import { Link } from 'react-router-dom';
import { MENU_ITEMS } from 'routes/routes';
import { Menu } from '../common/Menu';
import { WalletButton } from '../common/WalletButton';

export const AppHeader = () => {
  const { navMenuKey } = useRouteParams();

  const logoSrc = 'SoundRig-logo-2.png';

  return (
    <div className={'flex'}>
      <div className={'pl-2 min-w-[260px]'}>
        <Link to='/' aria-label='Home'>
          <img
            src={`/images/${logoSrc}`}
            alt='sound-rig logo'
            className='app-logo h-16'
          />
        </Link>
      </div>
      <div className={'flex-1 flex justify-center'}>
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
      <div className={'pr-4 min-w-[260px] flex justify-end'}>
        <WalletButton />
      </div>
    </div>
  );
};
