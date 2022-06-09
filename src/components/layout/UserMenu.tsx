import { UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleMenuBlur } from 'utils/accessibility';
import { getInitials } from 'utils/name';
import { signOut } from 'utils/auth';
import useUser from 'hooks/useUser';

interface IUserMenuProps {
  firstName: string;
  lastName: string;
}

const UserMenu = ({ firstName, lastName }: IUserMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { user } = useUser();

  async function doSignOut() {
    try {
      signOut().then(() => {
        // TODO: action signout
        navigate('/');
      });
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  const navigateTo = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  const initials = useMemo(() => {
    return getInitials(firstName, lastName);
  }, [firstName, lastName]);

  const avatar = useMemo(() => {
    return user ? user.picture : null;
  }, [user]);

  const menu = (
    <Menu
      id="userMenu"
      className="user-menu--dropdown"
      tabIndex={-1}
      onBlur={(e) => handleMenuBlur(e, setMenuOpen)}
    >
      <div className="px-7 py-2">
        <div className="subheading text--85">
          {user?.displayName || user?.name}
        </div>
        <div className="text--secondary">{user?.email}</div>
      </div>
      <hr style={{ borderTop: '0px' }} />
      <Menu.Item
        key="user-account-settings"
        onClick={() => navigateTo('/user')}
      >
        <Button type="text" className="user-menu--dropdown-button">
          Account settings
        </Button>
      </Menu.Item>
      <Menu.Item
        key="user-notification-settings"
        onClick={() => navigateTo('/settings/notifications')}
      >
        <Button type="text" className="user-menu--dropdown-button">
          Notification settings
        </Button>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="user-sign-out" onClick={() => doSignOut()}>
        <Button type="text" className="user-menu--dropdown-button">
          Sign out
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <div id="userMenuContainer">
      <Dropdown
        overlay={menu}
        trigger={['click']}
        placement="bottomRight"
        visible={menuOpen}
        onVisibleChange={(visible) => setMenuOpen(visible)}
        getPopupContainer={() => {
          // pop up in same container for keyboard accessibility
          return document.getElementById('userMenuContainer') as HTMLElement;
        }}
      >
        <Button
          className={`user-menu--button ${avatar ? 'avatar' : ''}`}
          shape="circle"
          size="small"
          aria-haspopup="true"
          aria-expanded={menuOpen}
          aria-label="User menu"
          aria-controls="userMenu"
          style={{ fontSize: '14px', padding: '0px' }}
        >
          {avatar && (
            <Avatar
              size={32}
              src={avatar}
              style={{ width: '100%', height: '100%' }}
            />
          )}
          {!avatar && initials}
          {!avatar && !initials && <UserOutlined />}
        </Button>
      </Dropdown>
    </div>
  );
};

export default UserMenu;
