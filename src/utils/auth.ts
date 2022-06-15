import { Hub } from 'aws-amplify';
import {
  AuthState,
  UI_AUTH_CHANNEL,
  AUTH_STATE_CHANGE_EVENT,
} from '@aws-amplify/ui-components';
import Auth from 'auth/Auth';

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

export const signOut = async () => {
  // update last login so revocation logins stop appearing
  return Auth.signOut();
};
