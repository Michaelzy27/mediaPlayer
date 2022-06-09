import { useEffect, useMemo, useState } from 'react';
import { Button } from 'antd';
import { ButtonType } from 'antd/lib/button';

interface IToggleButtonProps {
  value?: boolean;
  controlled?: boolean; // toggled state will be controlled by attribute 'value'
  onClick: (toggleState: boolean) => void;
}

const ToggleButton: React.FunctionComponent<IToggleButtonProps> = ({
  value,
  onClick,
  controlled,
  ...props
}) => {
  const [toggleState, setToggleState] = useState<boolean>(value || false);

  const handleClick = () => {
    onClick(!toggleState);
    if (!controlled) {
      setToggleState(!toggleState);
    }
  };

  const buttonProps = useMemo(() => {
    const type = toggleState ? 'primary' : null;
    return {
      type,
    };
  }, [toggleState]);

  useEffect(() => {
    setToggleState(value || false);
  }, [value]);

  return (
    <Button
      shape="round"
      onClick={handleClick}
      type={buttonProps.type as ButtonType}
      aria-pressed={toggleState ? 'true' : 'false'}
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default ToggleButton;
