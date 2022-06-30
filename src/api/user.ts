import axiosInstance from './axiosWithAuthHeader';
import { handleAPIPromise } from './utils';

const getAuth = (walletAddress: string) => {
  return handleAPIPromise(
    axiosInstance.post('/get-auth', {
      address: walletAddress,
    })
  );
};

const sendAuth = (walletAddress: string, signature: string, key?: string) => {
  return handleAPIPromise(
    axiosInstance.post('/send-auth', {
      signature,
      address: walletAddress,
      key,
    })
  );
};

const pingAuth = () => {
  return handleAPIPromise(axiosInstance.get('/ping-auth'));
};

// add by Chau 2022-06-14 start
const getStakeAddress = (walletAddressHex: string) => {
  return handleAPIPromise(
    axiosInstance.post('/get-stakeAddress', {
      address: walletAddressHex,
    })
  );
};
// add by Chau 2022-06-14 end

const UserApi = {
  getAuth,
  sendAuth,
  pingAuth,
  // add by Chau 2022-06-14 start
  getStakeAddress,
  // add by Chau 2022-06-14 end
};

export default UserApi;
