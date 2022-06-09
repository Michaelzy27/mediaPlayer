import { LockFilled } from '@ant-design/icons';
import { AuthState } from '@aws-amplify/ui-components';
import { Alert, Button, Card, Form, Input, Row } from 'antd';
import { Auth } from 'aws-amplify';
import useBreakpoints from 'hooks/useBreakpoints';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AMPLIFY_WEB_COMPONENT_SLOT,
  dispatchAuthStateChanged,
} from 'utils/auth';
import { emailRule, requiredRule } from 'utils/validators/rules';

const SIGN_IN_CHALLENGE_STATES = {
  SMS_MFA: 'SMS_MFA',
  NEW_PASSWORD: 'NEW_PASSWORD_REQUIRED',
};

enum SIGN_IN_STATES {
  SIGN_IN,
  MFA,
  LOCKED,
}

const SignIn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [challengeForm] = Form.useForm();
  const [loginError, setLoginError] = useState<any>();
  const [user, setUser] = useState<any>();
  const [challengeState, setChallengeState] = useState<string>();

  const [forceResetPassword, setForceResetPassword] = useState<boolean>(false);
  const [loggingIn, setLoggingIn] = useState<boolean>(false);

  /// TODO
  const { inactive, passwordChanged } = {
    inactive: false,
    passwordChanged: false,
  };

  const responsiveCardStyles = {
    xs: {
      width: '90vw',
    },
    sm: {
      width: '475px',
    },
  };
  const { mappedValue: mappedWidths } = useBreakpoints(responsiveCardStyles);

  const resetLogin = () => {
    setLoginError(null);
    setForceResetPassword(false);
    form.setFieldsValue({ password: '' });
  };

  const onFinish = async () => {
    setLoggingIn(true);
    setLoginError(null);
    setForceResetPassword(false);
    try {
      const data = form.getFieldsValue();
      const user = await Auth.signIn({
        username: data.username,
        password: data.password,
      });

      // todo: test MFA
      if (user.challengeName === SIGN_IN_CHALLENGE_STATES.SMS_MFA) {
        setUser(user);
        setChallengeState(SIGN_IN_CHALLENGE_STATES.SMS_MFA);
      } else if (user.challengeName === SIGN_IN_CHALLENGE_STATES.NEW_PASSWORD) {
        setUser(user);
        setChallengeState(SIGN_IN_CHALLENGE_STATES.NEW_PASSWORD);
        // Set auth state to reset password for new user to change their initial password
        // todo: better change password slot component
        dispatchAuthStateChanged(AuthState.ResetPassword, user);
      } else {
        dispatchAuthStateChanged(AuthState.SignedIn, user);
        navigate(location.pathname);
      }
    } catch (error: any) {
      console.error('Error signing in: ', error);
      if (error.message === 'Password attempts exceeded') {
        setForceResetPassword(true);
      }
      setLoginError(error?.message || error);
    }
    setLoggingIn(false);
  };

  const onFinishChallenge = async () => {
    setLoginError(null);
    setLoggingIn(true);
    if (challengeState === SIGN_IN_CHALLENGE_STATES.SMS_MFA) {
      try {
        const { code } = challengeForm.getFieldsValue();

        const loggedUser = await Auth.confirmSignIn(
          user, // Return object from Auth.signIn()
          code, // Confirmation code
          'SMS_MFA' // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
        );
      } catch (error: any) {
        console.error('Error confirming MFA code: ', error);
        setLoginError(error?.message || error);
      }
    }
    setLoggingIn(false);
  };

  const signInState = useMemo(() => {
    if (forceResetPassword) {
      return SIGN_IN_STATES.LOCKED;
    }

    if (challengeState === SIGN_IN_CHALLENGE_STATES.SMS_MFA) {
      return SIGN_IN_STATES.MFA;
    }

    return SIGN_IN_STATES.SIGN_IN;
  }, [challengeState, forceResetPassword]);

  return (
    <div slot={AMPLIFY_WEB_COMPONENT_SLOT.SignIn}>
      {signInState === SIGN_IN_STATES.SIGN_IN && (
        <Row justify="center" className="mt-2 lg:mt-12 2xl:mt-24">
          <Card bordered={false} style={mappedWidths}>
            <div className="flex justify-center">
              <h2 className="heading-2">Log in</h2>
            </div>
            {inactive && (
              <Alert
                type="info"
                message="You have been logged out due to inactivity. Please log in again."
                className="mb-4"
                showIcon
              />
            )}
            {passwordChanged && (
              <Alert
                type="info"
                message="Password successfully changed. Please log in again."
                className="mb-4"
                showIcon
              />
            )}
            <Form layout="vertical" form={form} onFinish={onFinish}>
              {loginError && (
                <Alert
                  className="mb-4"
                  type="error"
                  showIcon={true}
                  message={
                    <>
                      <span>{loginError}</span>{' '}
                      {forceResetPassword ? (
                        <Button
                          type="text"
                          onClick={() => {
                            dispatchAuthStateChanged(AuthState.ForgotPassword);
                            resetLogin();
                          }}
                        >
                          Reset your password
                        </Button>
                      ) : (
                        ''
                      )}
                    </>
                  }
                />
              )}
              <Form.Item
                label="Email address"
                name="username"
                rules={[requiredRule, emailRule]}
              >
                <Input maxLength={256} />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[requiredRule]}
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
                  loading={loggingIn}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
            <div className="flex justify-center">
              <Button
                type="link"
                onClick={() =>
                  dispatchAuthStateChanged(AuthState.ForgotPassword)
                }
              >
                Forgot password?
              </Button>
            </div>
          </Card>
        </Row>
      )}
      {signInState === SIGN_IN_STATES.MFA && (
        <Row justify="center">
          <Card bordered={false} className="pt-6 my-3" style={mappedWidths}>
            <div className="flex justify-center">
              <h2 className="heading-2">Two-factor authentication</h2>
              <p>Enter the authentication code we sent to ******1234</p>
            </div>
            <Form
              layout="vertical"
              form={challengeForm}
              onFinish={onFinishChallenge}
            >
              {loginError && (
                <Alert
                  className="mb-4"
                  type="error"
                  showIcon={true}
                  message={loginError}
                />
              )}
              <Form.Item
                label="Authentication code"
                name="code"
                rules={[requiredRule]}
              >
                <Input maxLength={10} />
              </Form.Item>

              <Form.Item>
                <Button
                  className="mt-4"
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                >
                  Confirm
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Row>
      )}
      {signInState === SIGN_IN_STATES.LOCKED && (
        <Row justify="center">
          <Card bordered={false} className="pt-6 my-3" style={mappedWidths}>
            <Row justify="center" className="mb-6">
              <LockFilled style={{ color: '#D9D9D9', fontSize: 56 }} />
            </Row>
            <Row justify="center">
              <h2 className="heading-2">Account locked</h2>
            </Row>
            <Row justify="center">
              <p className="text-center">
                Your account was locked after too many failed log in attempts.
                Reset your password to unlock your account.
              </p>
            </Row>
            <Row justify="center">
              <Button
                className="mt-4"
                type="primary"
                size="large"
                onClick={() => {
                  dispatchAuthStateChanged(AuthState.ForgotPassword);
                  resetLogin();
                }}
              >
                Reset password
              </Button>
            </Row>
          </Card>
        </Row>
      )}
    </div>
  );
};

export default SignIn;
