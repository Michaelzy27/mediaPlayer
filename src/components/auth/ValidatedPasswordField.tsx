import { useState } from 'react';
import { Form, Input } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { requiredRule } from 'utils/validators/rules';

interface IPasswordFieldProps {
  label: string;
  passwordConditions?: any[];
  rules?: any[];
  onChange?: (p: string) => void;
}

const defaultPasswordConditions = [
  {
    description: '10 characters',
    regexValidator: /^.{10,}/,
  },
  {
    description: '1 lowercase letter',
    regexValidator: /[a-z]/,
  },
  {
    description: '1 uppercase letter',
    regexValidator: /[A-Z]/,
  },
  {
    description: '1 special character (e.g. ! @ # ? )',
    regexValidator: /[^a-zA-Z0-9]/,
  },
  {
    description: '1 number',
    regexValidator: /[0-9]/,
  },
];

const PasswordField = ({
  label,
  passwordConditions = defaultPasswordConditions,
  rules = [],
  onChange,
}: IPasswordFieldProps) => {
  const [password, setPassword] = useState<string>();

  const passwordRule = {
    validator: (_: any, str: string) => {
      const valid = passwordConditions.every((c) => {
        return c.regexValidator.test(str);
      });
      return valid
        ? Promise.resolve()
        : Promise.reject('Passwords conditions not met');
    },
  };

  const handlePasswordChanged = (e: any) => {
    setPassword(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <>
      <Form.Item
        label={label}
        name="password"
        rules={[requiredRule, passwordRule, ...rules]}
        style={{ marginBottom: '8px' }}
      >
        <Input.Password maxLength={128} onChange={handlePasswordChanged} />
      </Form.Item>

      <ul className="pl-4">
        {passwordConditions.map((c: any, i: number) => {
          const valid = c.regexValidator.test(password || '');
          return (
            <div
              key={i}
              role="listitem"
              className={`flex items-center ${valid ? 'text--secondary' : ''}`}
            >
              {valid ? (
                <CheckOutlined />
              ) : (
                <div style={{ lineHeight: '1rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>&bull;</span>
                </div>
              )}
              <span className="ml-2">{c.description}</span>
            </div>
          );
        })}
      </ul>
    </>
  );
};

export default PasswordField;
