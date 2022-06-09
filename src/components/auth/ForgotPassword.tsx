import { useState, ReactFragment } from 'react';

import { AuthState } from '@aws-amplify/ui-components';
import { Auth } from 'aws-amplify';
import { Form, Input, Button, Card, Row, Alert, notification } from 'antd';

import { requiredRule, emailRule } from 'utils/validators/rules';

import {
  AMPLIFY_WEB_COMPONENT_SLOT,
  AMPLIFY_ERROR_CODES,
  dispatchAuthStateChanged,
} from 'utils/auth';
import useBreakpoints from 'hooks/useBreakpoints';
import ValidatedPasswordField from 'components/auth/ValidatedPasswordField';

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [sendingCode, setSendingCode] = useState<boolean>(false);
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();

  // error with the send reset code form
  const [sendResetCodeError, setSendResetCodeError] = useState<string | null>();

  // error with the reset password form
  const [resetPasswordError, setResetPasswordError] =
    useState<ReactFragment | null>();

  const responsiveCardStyles = {
    xs: {
      width: '90vw',
    },
    sm: {
      width: '475px',
    },
  };
  const { mappedValue: mappedWidths } = useBreakpoints(responsiveCardStyles);

  const setFocusCodeField = (timeout = 300) => {
    setTimeout(() => {
      const codeField = document.getElementById('code') as HTMLInputElement;
      if (codeField) {
        codeField.focus();
        codeField.select();
      }
    }, timeout);
  };

  const onSendCode = async () => {
    setSendResetCodeError(null);
    setResetPasswordError(null);
    setSendingCode(true);

    try {
      const data = form.getFieldsValue();
      const email = data.email.trim();

      await Auth.forgotPassword(email);
      setEmail(email);
      form.resetFields();
      setCodeSent(true);
      setFocusCodeField();
    } catch (error: any) {
      console.error('Error sending code: ', error, error.code);
      setSendResetCodeError(error?.message || error);
    }
    setSendingCode(false);
  };

  const onResetPassword = async () => {
    setSendResetCodeError(null);
    setResetPasswordError(null);
    try {
      const data = form.getFieldsValue();

      await Auth.forgotPasswordSubmit(email!, data.code, data.password);

      form.resetFields();
      setCodeSent(false);
      notification['success']({
        message: 'Password has been successfully reset.',
      });
      dispatchAuthStateChanged(AuthState.SignIn);
    } catch (error: any) {
      console.error('Error resetting password: ', error, error.code);
      if (error.code === AMPLIFY_ERROR_CODES.CODE_EXPIRED) {
        setSendResetCodeError(
          'Your password reset code has expired. Please request a new code.'
        );
        // return back to request code state.
        form.resetFields(['code']);
        setCodeSent(false);
      } else if (error.code === AMPLIFY_ERROR_CODES.INCORRECT_CODE) {
        setResetPasswordError(
          <div>
            The code you entered is incorrect. Please re-enter the code or{' '}
            <Button
              type="text"
              onClick={restartResetPassword}
              className="px-0 py-0"
              style={{ height: 'auto' }}
            >
              request a new code.
            </Button>
          </div>
        );

        setFocusCodeField(100);
      } else {
        setResetPasswordError(error?.message || error);
      }
    }
  };

  const confirmPasswordRule = {
    validator: (_: any, str: string) => {
      return str === form.getFieldValue('password')
        ? Promise.resolve()
        : Promise.reject('Passwords must match');
    },
  };

  const restartResetPassword = () => {
    setCodeSent(false);
    form.resetFields();
    // set the email back
    form.setFieldsValue({ email });
    setSendResetCodeError(null);
    setResetPasswordError(null);
  };

  return (
    <div slot={AMPLIFY_WEB_COMPONENT_SLOT.ForgotPassword}>
      <Row justify="center">
        {/* Get verification code form */}
        {!codeSent && (
          <Card bordered={false} className="pt-6 my-3" style={mappedWidths}>
            <div className="flex justify-center">
              <h2 className="heading-2">Forgot your password?</h2>
            </div>
            <div className="flex justify-center mb-6">
              <p>We'll email you a code to reset your password.</p>
            </div>

            {sendResetCodeError && (
              <Alert
                className="mb-4"
                type="error"
                showIcon={true}
                message={sendResetCodeError}
              />
            )}

            <Form layout="vertical" form={form} onFinish={onSendCode}>
              <Form.Item
                label="Email address"
                name="email"
                rules={[emailRule, requiredRule]}
              >
                <Input maxLength={128} />
              </Form.Item>

              <Form.Item>
                <Button
                  className="mt-4"
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  disabled={sendingCode}
                >
                  Send code
                </Button>
              </Form.Item>

              <Row justify="center">
                <Button
                  className="mt-4"
                  type="text"
                  onClick={() => {
                    dispatchAuthStateChanged(AuthState.SignIn);
                  }}
                >
                  Back to login
                </Button>
              </Row>
            </Form>
          </Card>
        )}

        {/* Reset password form */}
        {codeSent && (
          <Card bordered={false} className="pt-6 my-3" style={mappedWidths}>
            <div className="flex justify-center">
              <h2 className="heading-2">Check your email</h2>
            </div>
            <div className="flex justify-center mb-6">
              <p className="text-center">
                Enter the code we sent to <strong>{email}</strong> and create a
                new password.
              </p>
            </div>

            {resetPasswordError && (
              <>
                <Alert
                  className="mb-4"
                  type="error"
                  showIcon={true}
                  message={resetPasswordError}
                />
              </>
            )}

            <Form layout="vertical" form={form} onFinish={onResetPassword}>
              <Form.Item label="Code" name="code" rules={[requiredRule]}>
                <Input maxLength={6} />
              </Form.Item>

              <ValidatedPasswordField label="New password" />

              <Form.Item
                label="Confirm new password"
                name="confirmPassword"
                rules={[requiredRule, confirmPasswordRule]}
              >
                <Input.Password maxLength={128} />
              </Form.Item>

              <Form.Item>
                <Button
                  className="mt-4"
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                >
                  Reset password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}
      </Row>
    </div>
  );
};

export default ForgotPassword;
