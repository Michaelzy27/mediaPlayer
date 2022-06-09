import axios from 'axios';
import { Auth } from 'aws-amplify';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
  function (config) {
    return Auth.currentSession().then(
      function (session) {
        config.headers['Authorization'] = 'Bearer ' + session.idToken.jwtToken;
        return Promise.resolve(config);
      },
      function (err) {
        console.log(err);
        return Promise.resolve(config);
      }
    );
  },
  function (error) {
    return Promise.reject(error);
  }
);
