import axios from 'axios';
import {CONFIG} from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
const httpRequest = axios.create({
  baseURL: `${CONFIG.baseUrl}`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

httpRequest.interceptors.request.use(
  async req => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  err => Promise.reject(err),
);

httpRequest.interceptors.response.use(
  res => Promise.resolve(res),
  async error => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh_token = await AsyncStorage.getItem('authRefeshToken');
      const res = await axios.post(
        `${CONFIG.baseUrl}/v1/auth/refresh-token`,
        {refresh_token},
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
      if (res.status === 200) {
        AsyncStorage.setItem('authToken', res.data.result.data.token);
        AsyncStorage.setItem(
          'authRefeshToken',
          res.data.result.data.refesh_token,
        );
        return httpRequest(originalRequest);
      }
    }
    return Promise.reject(error);
  },
);

export const get = async (path, options = {}) => {
  const response = await httpRequest.get(path, options);
  return response.data;
};

export const post = async (path, data, options = {}) => {
  const response = await httpRequest.post(path, data, options);
  return response.data;
};
export const patch = async (path, data, options = {}) => {
  const response = await httpRequest.patch(path, data, options);
  return response.data;
};
export const put = async (path, data, options = {}) => {
  const response = await httpRequest.put(path, data, options);
  return response.data;
};

export const del = async (path, options = {}) => {
  const response = await httpRequest.delete(path, options);
  return response.data;
};

export default httpRequest;
