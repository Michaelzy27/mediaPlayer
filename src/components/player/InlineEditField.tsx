import { Button, Form, Input, Row, Space } from 'antd';
import useBreakpoints from 'hooks/useBreakpoints';
import { useState } from 'react';

interface IInlineEditFieldProps {
  name: string;
  label: string | React.ReactFragment;
  hint?: string;
  value: any;
  onSave: (value: any) => Promise<boolean>;
  rules?: any[];
  className?: string;
  maxLength?: number;
}

const InlineEditField = ({
  name,
  label,
  hint,
  value,
  onSave,
  className,
  rules,
  maxLength,
}: IInlineEditFieldProps) => {
  const { mappedValue: inputWidth } = useBreakpoints({
    xs: { width: '100%' },
    md: { width: '50%' },
    lg: { width: '33%' },
  });
  const defaultForm: any = {};
  defaultForm[name] = value;

  const [form] = Form.useForm();
  const [editing, setEditing] = useState<boolean>();

  const fieldId = `input-${name}`;

  const onEdit = () => {
    setEditing(true);
    setTimeout(() => {
      const field = document.getElementById(fieldId);
      field?.focus();
    }, 100);
  };

  const labelFragment = (
    <div className="flex flex-col">
      <label htmlFor={fieldId} className="label">
        {label}
      </label>
      {hint && <p className="footnote mb-1">{hint}</p>}
    </div>
  );

  const handleSave = async () => {
    const result = await onSave(form.getFieldValue(name));
    setEditing(!result);
  };

  return (
    <div className={className}>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSave}
        initialValues={defaultForm}
      >
        {editing && (
          <>
            <Form.Item label={labelFragment} name={name} rules={rules}>
              <Input maxLength={maxLength} id={fieldId} style={inputWidth} />
            </Form.Item>
            <Row>
              <Space>
                <Button type="primary" htmlType="submit">
                  Save changes
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                    setEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </Row>
          </>
        )}
        {!editing && (
          <>
            {labelFragment}
            <div className="value">{value}</div>
            <Button
              type="text"
              className="px-1 -ml-1"
              onClick={onEdit}
              disabled={editing}
            >
              Edit
            </Button>
          </>
        )}
      </Form>
    </div>
  );
};

export default InlineEditField;
