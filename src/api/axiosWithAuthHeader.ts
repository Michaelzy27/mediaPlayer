import axios from 'axios';
import Auth from 'auth/Auth';
import { signOut } from '../utils/auth';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export async function post<T>(path: string, payload: any) : Promise<T> {
  const response = await axiosInstance.post(path, payload, {
    validateStatus: (status) => status < 500
  });

  if (response.status !== 200){
    throw `API Error: ${response.data ? JSON.stringify(response?.data) : response.toString()}`;
  }
  return response.data;
}

export async function get<T>(path: string): Promise<T | null> {
  const response = await axiosInstance.get(path, {
    validateStatus: (status) => status === 200 || status === 404
  });
  if (response.status === 404){
    return null;
  }
  return response.data;
}

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
  if (error.response?.status === 403) {
    await signOut();
  }
  // console.error('ERROR', JSON.stringify(error.response, null, 2))
})
