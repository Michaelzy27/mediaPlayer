import axios from 'axios';
import Auth from 'auth/Auth';
import { signOut } from '../utils/auth';

console.log(import.meta)
const axiosInstance = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL,
});

axiosInstance.interceptors.request.use(
  function(config) {
    return Auth.currentSession().then(
      function(session) {
        config.headers['Authorization'] = 'Bearer ' + session.jwtToken;
        return Promise.resolve(config);
      },
      function(err) {
        console.log(err);
        return Promise.resolve(config);
      }
    );
  },
  function(error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(function(value) {
  return value
}, async function(error) {
  if (error.response.status === 403) {
    await signOut();
  }
  // console.error('ERROR', JSON.stringify(error.response, null, 2))
})

export default axiosInstance;