import { randomUUID } from 'crypto';

const appIdentifier = 'SoundRig';
const serviceIdentifier = 'AuthenticationProvider';
const itemIdentifier = `${appIdentifier}.${serviceIdentifier}`;

const addressIdentifier = `${itemIdentifier}.address`;
const tokenIdentifier = `${itemIdentifier}.jwtToken`;

export enum AuthState {
  SignedIn = 'SignedIn',
  SignedOut = 'SignedOut',
}

export interface AuthData {
  address?: string;
  jwtToken?: string;
  authState: AuthState;
}

const authStateChangedCallbacks: {
  [k: string]: (authState: AuthState, authData: AuthData) => void;
} = {};

function getCurrentAuthData(): AuthData {
  const address = localStorage.getItem(addressIdentifier);
  const jwtToken = localStorage.getItem(tokenIdentifier);
  if (address && jwtToken) {
    return {
      address,
      jwtToken,
      authState: AuthState.SignedIn,
    };
  }
  return {
    authState: AuthState.SignedOut,
  };
}
function authStateChangedLoop() {
  const current = getCurrentAuthData();
  Object.values(authStateChangedCallbacks).forEach((fn) => {
    fn(current.authState, current);
  });
}

function currentSession() : Promise<{address: string, jwtToken: string}> {
  return new Promise((res, rej) => {
    const address = localStorage.getItem(addressIdentifier);
    const jwtToken = localStorage.getItem(tokenIdentifier);
    if (address && jwtToken) {
      res({
        address,
        jwtToken,
      });
    } else {
      rej({
        errorMessage: `Current session has no address or token.`,
      });
    }
  });
}

function initSession(address: string, jwtToken: string) {
  localStorage.setItem(addressIdentifier, address);
  localStorage.setItem(tokenIdentifier, jwtToken);
  authStateChangedLoop();
}

function signOut() {
  localStorage.removeItem(addressIdentifier);
  localStorage.removeItem(tokenIdentifier);
  authStateChangedLoop();
}

function onAuthStateChanged(
  fn: (authState: AuthState, authData: AuthData) => void,
  k?: string
) {
  const authData = getCurrentAuthData();
  fn(authData.authState, authData);
  if (k) {
    authStateChangedCallbacks[k] = fn;
  } else {
    authStateChangedCallbacks[randomUUID()] = fn;
  }
}

function removeOnAuthStateChanged(k: string) {
  if (authStateChangedCallbacks[k]) {
    delete authStateChangedCallbacks[k];
  }
}

const Auth = {
  currentSession,
  initSession,
  signOut,
  onAuthStateChanged,
  removeOnAuthStateChanged,
  authStateChangedLoop,
};

export default Auth;
