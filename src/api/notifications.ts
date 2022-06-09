import axios from 'axios';
import { handleAPIPromise } from './utils';

const get = (lastLogin: string) => {
  return handleAPIPromise(
    axios.get(
      `/notification/revocation${lastLogin ? `?last_login=${lastLogin}` : ''}`
    )
  );
};

const NotificationsApi = {
  get,
};

export default NotificationsApi;
