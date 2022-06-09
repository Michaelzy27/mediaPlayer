import { useState, ReactNode } from 'react';
import { Button, Menu, Dropdown } from 'antd';
import { ButtonType } from 'antd/lib/button';
import { DownOutlined } from '@ant-design/icons';

import { handleMenuBlur } from 'utils/accessibility';
import { uniqueId } from 'lodash';

interface IAction {
  label: string;
  id?: any;
  icon?: ReactNode;
  handler: (id?: any) => void;
  divider?: boolean;
}

export enum MENU_TYPES {
  TEXT = 'text',
  PRIMARY = 'primary',
}

interface IActionMenuProps {
  id?: string;
  text?: string;
  actions: Array<IAction>;
  type?: ButtonType;
  showChevronDown?: boolean;
  ariaLabel?: string;
}

const ActionMenu = ({
  actions = [],
  id = uniqueId(),
  text = '...',
  type = MENU_TYPES.TEXT,
  showChevronDown,
  ariaLabel,
}: IActionMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuId = `actionMenu-${id}`;
  const menuContainerId = `actionMenuContainer-${id}`;

  const menu = (
    <Menu
      id={menuId}
      tabIndex={-1}
      onBlur={(e) => handleMenuBlur(e, setMenuOpen)}
    >
      {actions.map((a, i) => [
        a.divider && <Menu.Divider key={`menu-divider-${i}`} />,
        <Menu.Item
          key={i}
          onClick={(e: any) => {
            // prevent click expanding rows on tables
            e.domEvent.stopPropagation();
            a.handler(a.id);
          }}
        >
          <Button type="text" icon={a.icon}>
            <span className="text--black">{a.label}</span>
          </Button>
        </Menu.Item>,
      ])}
    </Menu>
  );

  return (
    <div id={menuContainerId}>
      <Dropdown
        overlay={menu}
        trigger={['click']}
        placement="bottomRight"
        visible={menuOpen}
        onVisibleChange={(visible) => setMenuOpen(visible)}
        getPopupContainer={() => {
          // pop up in same container for keyboard accessibility
          return document.getElementById(menuContainerId) as HTMLElement;
        }}
      >
        <Button
          type={type}
          aria-haspopup="true"
          aria-expanded={menuOpen}
          aria-label={ariaLabel || text}
          aria-controls={menuId}
          onClick={(e: any) => {
            // prevent button click from expanding rows on tables
            e.stopPropagation();
          }}
          onKeyPress={(e: any) => {
            // prevent key press from expanding rows on tables
            e.stopPropagation();
          }}
        >
          {text}
          {showChevronDown && <DownOutlined />}
        </Button>
      </Dropdown>
    </div>
  );
};

export default ActionMenu;
