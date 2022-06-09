import axios from 'axios';
import { handleAPIPromise } from './utils';

const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = process.env.REACT_APP_API_URL;

const validateToken = (token: string) => {
  return handleAPIPromise(axiosInstance.get(`/create/${token}`));
};

const createAccount = (token: string, password: string) => {
  return handleAPIPromise(
    axiosInstance.post(`/create/`, {
      token,
      password,
    })
  );
};

const AccountApi = {
  validateToken,
  createAccount,
};

export default AccountApi;
