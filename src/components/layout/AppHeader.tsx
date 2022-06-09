import { Col, Menu, Row } from 'antd';
import useBreakpoints from 'hooks/useBreakpoints';
import useRouteParams from 'hooks/useRouteParams';
import useUser from 'hooks/useUser';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MENU_ITEMS } from 'routes';
import { deriveFirstLastName } from 'utils/name';
import UserMenu from './UserMenu';

const AppHeader = () => {
  const { breakpoints } = useBreakpoints();
  const { navMenuKey } = useRouteParams();

  const { user } = useUser();

  const logoSrc = breakpoints.xs
    ? 'sound-rig-logo-sm.svg'
    : 'sound-rig-logo.svg';

  const firstLastName = useMemo(() => {
    return deriveFirstLastName(user);
  }, [user]);

  return (
    <Row align="middle" justify="space-between" className="px-4 md:pl-8">
      <Row align="middle">
        <Col>
          <Link to="/" aria-label="Home">
            <img
              src={`/images/${logoSrc}`}
              alt="sound-rig logo"
              className="app-logo"
            />
          </Link>
        </Col>
        <Col className="pl-4" style={{ paddingTop: '2px' }}>
          <Menu
            mode="horizontal"
            selectedKeys={navMenuKey ? [navMenuKey] : []}
            disabledOverflow
          >
            {MENU_ITEMS.map((m) => {
              return (
                <Menu.Item key={m.key}>
                  <Link to={m.path}>{m.text}</Link>
                </Menu.Item>
              );
            })}
          </Menu>
        </Col>
      </Row>
      <Row justify="end">
        {user && (
          <UserMenu
            firstName={firstLastName.first}
            lastName={firstLastName.last}
          />
        )}
      </Row>
    </Row>
  );
};

export default AppHeader;
