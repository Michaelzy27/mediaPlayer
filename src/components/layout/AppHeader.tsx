import useBreakpoints from 'hooks/useBreakpoints';
import useRouteParams from 'hooks/useRouteParams';
import { Link } from 'react-router-dom';
import { MENU_ITEMS } from 'routes/routes';
import { Menu } from '../common/Menu';
import { WalletButton } from '../common/WalletButton';

export const AppHeader = () => {
  const { navMenuKey } = useRouteParams();

  const logoSrc = 'SRHorizontalWebsiteCompressed.png';

  return (
    <div className={'flex'}>
      <div className={'pl-2 min-w-[160px] lg:min-w-[260px]'}>
        <a href="https://www.soundrig.io" aria-label='Home'>
          <img
            src={`/images/${logoSrc}`}
            alt='sound-rig logo'
            className='app-logo h-16 object-contain'
          />
        </a>
      </div>
      <div className={'flex-1  justify-center hidden md:flex'}>
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
      <div className={'pr-4 hidden md:flex  min-w-[160px] lg:min-w-[260px] justify-end'}>
        <WalletButton />
      </div>
    </div>
  );
};
