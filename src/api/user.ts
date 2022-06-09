import axios from 'axios';
import { handleAPIPromise } from './utils';

const updateUser = (field: string, value: string) => {
  return handleAPIPromise(axios.post('/holder/update', { [field]: value }));
};

const uploadPicture = async (pictureBase64String: string) => {
  return handleAPIPromise(
    axios.post(`/holder/upload`, {
      data: pictureBase64String,
    })
  );
};

const changePassword = (currentPass: string, newPass: string) => {
  return handleAPIPromise(
    axios.post('/holder/change-password', {
      oldPassword: currentPass,
      newPassword: newPass,
    })
  );
};

const UserApi = {
  updateUser,
  uploadPicture,
  changePassword,
};

export default UserApi;
