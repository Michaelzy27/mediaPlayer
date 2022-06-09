import { Space, Button, Row, RowProps, ButtonProps } from 'antd';

interface ISubmitCancelButtonsProps extends ButtonProps {
  justify?: RowProps['justify'];
  order?: 'default' | 'reverse';
  buttonClassName?: string;
  cancelText?: string;
  submitText?: string;
  submitting?: boolean;
  onCancel(): void;
  onSubmit?(event: any): void;
}

const SubmitCancelButtons = ({
  justify = 'end',
  order = 'default',
  buttonClassName,
  cancelText = 'Cancel',
  submitText = 'Submit',
  submitting = false,
  onCancel,
  onSubmit,
  ...props
}: ISubmitCancelButtonsProps) => {
  const ButtonCancel = <Button
            className={buttonClassName}
            onClick={onCancel}
            disabled={submitting}
          >
            {cancelText}
          </Button>
  return (
    <Row justify={justify}>
      <Space>
        {order === 'default' && ButtonCancel}
        <Button
          className={buttonClassName}
          type="primary"
          htmlType="submit"
          loading={submitting}
          onClick={(e) => {
            if (onSubmit) {
              e.preventDefault();
              onSubmit(e);
            }
          }}
          {...props}
        >
          {submitText}
        </Button>
        {order === 'reverse' && ButtonCancel}
      </Space>
    </Row>
  );
};

export default SubmitCancelButtons;
