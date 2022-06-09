import { useEffect } from 'react';

import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import { Layout } from 'antd';
import AccountCreation from 'components/auth/AccountCreation';
import ForgotPassword from 'components/auth/ForgotPassword';
import SignIn from 'components/auth/SignIn';
import PublicFooter from 'components/layout/PublicFooter';
import PublicHeader from 'components/layout/PublicHeader';

import { useLocation } from 'react-router';

import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { dispatchAuthStateChanged } from 'utils/auth';

import '../../App.less';
import 'styles/login.less';

const LoginApp = () => {
  const location = useLocation();

  const initialAuthState =
    location.pathname === '/account-creation'
      ? AuthState.SignUp
      : AuthState.SignIn;

  useEffect(() => {
    dispatchAuthStateChanged(initialAuthState);
  }, [initialAuthState, location]);

  useEffect(() => {
    onAuthUIStateChange((nextAuthState) => {
      let title = 'Sound Rig';
      let autoFocusEl: any;
      if (nextAuthState === AuthState.SignIn) {
        title = 'Log In - Sound Rig';
        autoFocusEl = document.getElementById('username');
      }

      if (nextAuthState === AuthState.ForgotPassword) {
        title = 'Forgot Password - Sound Rig';
        autoFocusEl = document.getElementById('email');
      }

      if (nextAuthState === AuthState.SignUp) {
        title = 'Create Account - Sound Rig';
      }

      document.title = title;

      setTimeout(() => {
        if (autoFocusEl) {
          (autoFocusEl as HTMLElement)?.focus();
        }
      }, 300);
    });
  }, []);

  return (
    <div className="App">
      <Layout className="login">
        <Layout.Header
          style={{
            top: 0,
            width: '100vw',
            height: '64px',
          }}
        >
          <PublicHeader />
        </Layout.Header>
        <Layout.Content>
          <AmplifyAuthenticator
            usernameAlias="email"
            initialAuthState={initialAuthState}
          >
            <SignIn />
            <ForgotPassword />
            {initialAuthState === AuthState.SignUp && <AccountCreation />}
          </AmplifyAuthenticator>
        </Layout.Content>
        <Layout.Footer
          style={{
            bottom: 0,
            width: '100%',
          }}
        >
          <PublicFooter />
        </Layout.Footer>
      </Layout>
    </div>
  );
};

export default LoginApp;
