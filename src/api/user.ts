import axios from 'axios';
import { handleAPIPromise } from './utils';

const getAuth = (walletAddress: string) => {
  return handleAPIPromise(
    axios.post('/get-auth', {
      address: walletAddress,
    })
  );
};

const sendAuth = (walletAddress: string, signature: string, key?: string) => {
  return handleAPIPromise(
    axios.post('/send-auth', {
      signature,
      address: walletAddress,
      key,
    })
  );
};

const pingAuth = () => {
  return handleAPIPromise(axios.get('/ping-auth'));
};

const UserApi = {
  getAuth,
  sendAuth,
  pingAuth,
};

export default UserApi;
