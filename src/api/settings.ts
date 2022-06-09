import axios from 'axios';
import { ISettingsPostRequest } from 'models/settings';
import { handleAPIPromise } from './utils';

const getSettings = async () => {
  let [data, error] = await handleAPIPromise(axios.get('/holder-settings'));
  if (error) {
    if (error.response) {
      error = error.response?.data;
    } else {
      error = {
        errorMessage: error.toString(),
      };
    }
  }
  return [data, error];
};

const updateSettings = (data: ISettingsPostRequest) => {
  return handleAPIPromise(axios.post('/holder-settings', data));
};

const SettingsApi = {
  getSettings,
  updateSettings,
};

export default SettingsApi;
