import Auth from 'auth/Auth';

export const signOut = async () => {
  await Auth.signOut();
};
