import { AuthState } from '@aws-amplify/ui-components';
import { Alert, Button, Card, Col, Form, Input, Row, Spin } from 'antd';
import API from 'api';
import { Auth } from 'aws-amplify';
import ValidatedPasswordField from 'components/auth/ValidatedPasswordField';
import ResponsiveContainer from 'components/common/ResponsiveContainer';
import useBreakpoints from 'hooks/useBreakpoints';
import useRecaptcha from 'hooks/useRecaptcha';
import useRouteParams from 'hooks/useRouteParams';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AMPLIFY_WEB_COMPONENT_SLOT,
  dispatchAuthStateChanged,
} from 'utils/auth';
import { requiredRule } from 'utils/validators/rules';
import { signOut } from 'utils/auth';

const AccountCreation = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [signUpError, setSignUpError] = useState<any>();
  const [signingUp, setSigningUp] = useState<boolean>(false);

  const [validatingToken, setValidatingToken] = useState<boolean>(true);
  const [tokenError, setTokenError] = useState<any>();

  const { recaptcha, initRecaptcha, recaptchaDone } = useRecaptcha(false);

  const responsiveCardStyles = {
    xs: {
      width: '90vw',
    },
    sm: {
      width: '400px',
    },
  };
  const { mappedValue: mappedWidths } = useBreakpoints(responsiveCardStyles);

  const { searchParams } = useRouteParams();
  const token = searchParams.get('token');

  const validateToken = useCallback(async () => {
    if (!token) {
      navigate('/404');
      return;
    }

    const [data, error] = await API.Invitation.get(token);
    if (error) {
      console.log('token error', error.response.data);
      setTokenError(error.response.data);
    } else {
      initRecaptcha();
      form.setFieldsValue({ fullName: data.name, username: data.username });
    }

    setValidatingToken(false);
  }, [form, initRecaptcha, navigate, token]);

  useEffect(() => {
    signOut().then(() => {
      validateToken();
    });
  }, [validateToken]);

  const confirmPasswordRule = {
    validator: (_: any, str: string) => {
      return str === form.getFieldValue('password')
        ? Promise.resolve()
        : Promise.reject('Passwords must match');
    },
  };

  const onFinish = async () => {
    setSigningUp(true);
    setSignUpError(null);

    try {
      const formData = form.getFieldsValue();
      const { inviteCode, password, confirmPassword } = formData;

      // get captcha
      const captchaResponse = await recaptcha.execute('create_account');

      // Create account for user
      const [, error] = await API.Invitation.createAccount(
        token!,
        inviteCode,
        password,
        confirmPassword,
        captchaResponse
      );
      if (error) {
        setSignUpError(error.response.data.errorMessage);
        setSigningUp(false);
        return;
      }

      // Sign in using Amplify and change auth state
      const user = await Auth.signIn({
        username: formData.username,
        password: formData.password,
      });

      recaptchaDone();
      dispatchAuthStateChanged(AuthState.SignedIn, user);
      navigate('/');
    } catch (error: any) {
      console.error('error signing up: ', error);
      setSignUpError(error?.message || error);
    }
    setSigningUp(false);
  };

  if (tokenError) {
    return (
      <div slot={AMPLIFY_WEB_COMPONENT_SLOT.SignUp}>
        <Row
          gutter={24}
          className="my-12 px-6 md:my-16 text-center flex items-center flex-col"
        >
          <Col span={24} md={{ span: 18 }} xl={{ span: 16 }}>
            {tokenError.title && (
              <div className="">
                {tokenError.title && <h2>{tokenError.title}</h2>}
                <p>{tokenError.errorMessage}</p>
              </div>
            )}
            {!tokenError.title && (
              <Alert type="error" message={tokenError.errorMessage} showIcon />
            )}
            {tokenError.code === 'LEARNER_REGISTERED' && (
              <div className="mt-6">
                <Link
                  to="/"
                  onClick={() => dispatchAuthStateChanged(AuthState.SignIn)}
                >
                  Go to Login page
                </Link>
              </div>
            )}
          </Col>
        </Row>
      </div>
    );
  }

  if (validatingToken) {
    return (
      <div slot={AMPLIFY_WEB_COMPONENT_SLOT.SignUp}>
        <div className="mt-12">
          <Spin />
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div slot={AMPLIFY_WEB_COMPONENT_SLOT.SignUp}>
      <ResponsiveContainer>
        <Row gutter={24} justify="center" className="xl:my-12">
          <Col span={24} xl={12}>
            <div className="px-8 pt-12">
              <h2 className="heading">
                Welcome to a new way of saving your{' '}
                <span className="text--primary">achievements</span>
              </h2>
              <p className="subheading text--black">
                Receive, claim and share your achievements in one place, on your
                terms
              </p>
            </div>
          </Col>
          <Col>
            <Card
              bordered={false}
              className="xl:pt-6 mb-6"
              style={mappedWidths}
            >
              <div className="flex justify-center">
                <h2 className="heading-2">Create account</h2>
              </div>
              <Form layout="vertical" form={form} onFinish={onFinish}>
                {signUpError && (
                  <Alert
                    className="mb-4"
                    type="error"
                    message={
                      <div style={{ textAlign: 'center' }}>
                        <p>An error occurred creating account</p>
                        <strong>{signUpError}</strong>
                      </div>
                    }
                  />
                )}
                <Form.Item label="Full name" name="fullName">
                  <Input disabled />
                </Form.Item>
                <Form.Item label="Email address" name="username">
                  <Input disabled />
                </Form.Item>

                <Form.Item
                  label="Invitation code"
                  name="inviteCode"
                  rules={[requiredRule]}
                >
                  <Input maxLength={4} />
                </Form.Item>

                <ValidatedPasswordField label="Create password" />

                <Form.Item
                  label="Confirm password"
                  name="confirmPassword"
                  rules={[requiredRule, confirmPasswordRule]}
                >
                  <Input.Password maxLength={128} />
                </Form.Item>
                <p className="mt-4">
                  By creating an account, you agree to the terms and conditions
                  outlined in our{' '}
                  <a
                    href="privacy-legal.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy and legal
                  </a>{' '}
                  page.
                </p>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    disabled={validatingToken}
                    loading={signingUp}
                  >
                    Create account
                  </Button>
                </Form.Item>
              </Form>
              <div className="flex justify-center">
                <p>
                  Already have an account?{' '}
                  <Link
                    to="/"
                    onClick={() => dispatchAuthStateChanged(AuthState.SignIn)}
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </Card>
          </Col>
        </Row>
      </ResponsiveContainer>
    </div>
  );
};

export default AccountCreation;
