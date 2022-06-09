import axios from 'axios';
import { handleAPIPromise } from './utils';

const get = (token: string) => {
  return handleAPIPromise(axios.get(`/invitation/${token}`));
};

const createAccount = (
  token: string,
  inviteCode: string,
  password: string,
  confirmPassword: string,
  captchaResponse: string,
) => {
  return handleAPIPromise(
    axios.post(`/invitation/${token}/create-account`, {
      inviteCode,
      password,
      confirmPassword,
      captchaResponse,
    })
  );
};

const InvitationApi = {
  get,
  createAccount,
};

export default InvitationApi;
