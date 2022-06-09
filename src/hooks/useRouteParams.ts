import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MENU_ITEMS } from 'routes';

const useRouteParams = () => {
  const [selectedMenuKey, setSelectedMenuKey] = useState<string>();
  const { pathname } = useLocation();

  useEffect(() => {
    // derive the default menu key for highlighting nav menu on load
    // deep links must nest from one of the base menu paths
    const basePath = (/^\/([a-zA-Z0-9-_]*)\/?/.exec(pathname) || [])[1];
    const searchPath = `/${basePath || ''}`;
    const findMenuKey = (items: Array<any>): any => {
      for (let item of items) {
        if (item.paths) {
          const subTreeResult = findMenuKey(item.paths);
          if (subTreeResult) {
            return subTreeResult;
          }
        } else if (item.path.indexOf(searchPath) === 0) {
          return item.key;
        }
      }
    };

    setSelectedMenuKey(findMenuKey(MENU_ITEMS));
  }, [pathname]);

  const searchParams = new URLSearchParams(useLocation().search);

  return {
    navMenuKey: selectedMenuKey,
    searchParams,
  };
};

export default useRouteParams;
