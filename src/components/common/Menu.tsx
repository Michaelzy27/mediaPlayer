import classNames from 'classnames';
import { Link } from 'react-router-dom';

interface IMenuProps {
  items: IMenuItem[];
  selectedKey?: string;
}

interface IMenuItem {
  label: string;
  key: string;
  path?: string;
  items?: IMenuItem[],
}

interface IMenuItemProps extends IMenuItem {
  selected: boolean;
}

export const Menu = ({ items, selectedKey }: IMenuProps) => {
  return <div className={'flex'}>
    {items.map((i) => {
      return <MenuItem {...i} selected={i.key === selectedKey} />;
    })}
  </div>;
};

const MenuItem = ({ label, selected, path }: IMenuItemProps) => {
  return <div className={''}>
    {path != null ?
      <Link to={path} className={classNames('px-8 py-3 text-lg font-bold rounded transition-all duration-300', {
        'text-white': !selected,
        'text-primary bg-slate-900': selected
      })}>{label}</Link>
      : <div></div>}
  </div>;
};