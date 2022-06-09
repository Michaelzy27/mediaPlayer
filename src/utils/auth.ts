import { Hub } from 'aws-amplify';
import {
  AuthState,
  UI_AUTH_CHANNEL,
  AUTH_STATE_CHANGE_EVENT,
} from '@aws-amplify/ui-components';
import { Auth } from 'aws-amplify';
import API from 'api';

/**
 * Dispatch AuthState change so that AmplifyAuthenticator wrapper can handle the event
 * and display relevant UI component
 * */
export const dispatchAuthStateChanged = (
  nextState: AuthState,
  data: any = {}
) => {
  Hub.dispatch(UI_AUTH_CHANNEL, {
    event: AUTH_STATE_CHANGE_EVENT,
    message: nextState,
    data: data,
  });
};

/**
 * https://docs.amplify.aws/ui/auth/authenticator/q/framework/react#props-slots-amplify-authenticator
 */
export const AMPLIFY_WEB_COMPONENT_SLOT = {
  SignIn: 'sign-in',
  SignUp: 'sign-up',
  ForgotPassword: 'forgot-password',
};

// __type
export const AMPLIFY_ERROR_CODES = {
  INCORRECT_CODE: 'CodeMismatchException',
  CODE_EXPIRED: 'ExpiredCodeException',
  LIMIT_EXCEEDED: 'LimitExceededException',
};

export const signOut = async () => {
  // update last login so revocation logins stop appearing
  await API.User.updateUser('custom:last_login', new Date().toISOString());
  return Auth.signOut();
};
