import { Form, Input, Modal, notification } from 'antd';
import API from 'api';
import ValidatedPasswordField from 'components/auth/ValidatedPasswordField';
import { useEffect } from 'react';
import { signOut } from 'utils/auth';
import { requiredRule } from 'utils/validators/rules';

interface IChangePasswordModalProps {
  showModal: boolean;
  onCancel: () => void;
  onSaved: () => void;
}

const ChangePasswordModal = ({
  showModal,
  onCancel,
  onSaved,
}: IChangePasswordModalProps) => {
  const [form] = Form.useForm();

  const focusPassword = () => {
    setTimeout(() => {
      const currentPassword = document.getElementById(
        'currentPassword'
      ) as HTMLInputElement;
      currentPassword?.focus();
      currentPassword?.select();
    }, 150);
  };

  const changePassword = async () => {
    await form.validateFields();

    const formValues = form.getFieldsValue();

    const [_, err] = await API.User.changePassword(
      formValues.currentPassword,
      formValues.password
    );

    if (err) {
      const resp = err.response.data || err;
      if (resp.code === 'NotAuthorizedException') {
        notification['error']({ message: 'Incorrect password.' });
        focusPassword();
      } else {
        notification['error']({
          message: resp.errorMessage || err.message,
        });
      }
      return;
    }

    form.resetFields();
    signOut().then(() => {
      // TODO: add action password change signout
    });
    onSaved();
  };

  const confirmPasswordRule = {
    validator: (_: any, str: string) => {
      return str === form.getFieldValue('password')
        ? Promise.resolve()
        : Promise.reject('Passwords must match');
    },
  };

  const newPasswordRule = {
    validator: (_: any, str: string) => {
      return str !== form.getFieldValue('currentPassword')
        ? Promise.resolve()
        : Promise.reject('New password cannot be the same as current password');
    },
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  useEffect(() => {
    if (showModal) {
      focusPassword();
    }
  }, [showModal]);

  return (
    <Modal
      title="Change password"
      visible={showModal}
      onCancel={handleCancel}
      okText="Change password"
      onOk={changePassword}
      okButtonProps={{
        htmlType: 'submit',
      }}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Current password"
          name="currentPassword"
          rules={[requiredRule]}
        >
          <Input.Password maxLength={128} />
        </Form.Item>

        <ValidatedPasswordField
          label="New password"
          rules={[newPasswordRule]}
        />

        <Form.Item
          label="Confirm new password"
          name="confirmPassword"
          rules={[requiredRule, confirmPasswordRule]}
        >
          <Input.Password maxLength={128} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
