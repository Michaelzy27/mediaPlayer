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

const authStateChangedCallbacks: {
  [k: string]: (authState: AuthState) => void;
} = {};

function getCurrentAuthState() {
  const address = localStorage.getItem(addressIdentifier);
  const jwtToken = localStorage.getItem(tokenIdentifier);
  if (address && jwtToken) {
    return AuthState.SignedIn;
  }
  return AuthState.SignedOut;
}
function authStateChangedLoop() {
  const current = getCurrentAuthState();
  Object.values(authStateChangedCallbacks).forEach((fn) => {
    fn(current);
  });
}

function currentSession() {
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

function onAuthStateChanged(fn: (authState: AuthState) => void, k?: string) {
  fn(getCurrentAuthState());
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
