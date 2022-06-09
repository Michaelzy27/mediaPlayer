import { Form, Input } from 'antd';
import { Rule } from 'antd/lib/form';
import { ReactEventHandler, useState } from 'react';
import './countingLengthInput.less';

interface ICountingLengthInput {
  name?: string;
  label?: string;
  maxLength: number;
  className?: string;
  ariaLabel?: string;
  rules?: Rule[];
  onChange?: ReactEventHandler<HTMLInputElement>;
}

const CountingLengthInput = ({
  name,
  label,
  maxLength,
  className,
  ariaLabel,
  rules = [],
  onChange,
}: ICountingLengthInput) => {
  const [internalValue, setInternalValue] = useState<string>('');

  const internalLength = internalValue.length;
  let extraClassname = '';
  if (internalLength > maxLength) {
    extraClassname = 'extra-error';
  }
  return (
    <Form.Item
      className={`sound-rig-counting-length-input ${extraClassname} ${className}`}
      name={name}
      label={label}
      extra={`${internalLength} of ${maxLength} characters used`}
      rules={[
        ...rules,
        {
          max: maxLength,
          message: '',
        },
      ]}
    >
      <Input
        ref={(ref) => {
          setInternalValue(ref?.input?.value ?? '');
        }}
        onChange={onChange}
        allowClear
        aria-label={ariaLabel}
      />
    </Form.Item>
  );
};

export default CountingLengthInput;
