const appIdentifier = 'SoundRig';
const serviceIdentifier = 'AuthenticationProvider';
const itemIdentifier = `${appIdentifier}.${serviceIdentifier}`;

const addressIdentifier = `${itemIdentifier}.address`;
const tokenIdentifier = `${itemIdentifier}.jwtToken`;

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
}

function signOut() {
  localStorage.removeItem(addressIdentifier);
  localStorage.removeItem(tokenIdentifier);
}

const Auth = {
  currentSession,
  initSession,
  signOut,
};

export default Auth;
