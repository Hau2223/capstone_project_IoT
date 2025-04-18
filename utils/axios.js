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

httpRequest.interceptors.request.use(
  async req => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    // Kiểm tra xem request có phải là multipart/form-data hay không
    if (req.headers['Content-Type'] === 'multipart/form-data') {
      // Nếu đúng, giữ lại content-type là 'multipart/form-data'
      req.headers['Content-Type'] = 'multipart/form-data';
    }

    return req;
  },
  err => Promise.reject(err),
);

export const get = async (path, options = {}) => {
  const response = await httpRequest.get(path, options);
  return response.data;
};

export const post = async (path, data, options = {}) => {
  const response = await httpRequest.post(CONFIG.baseUrl + path, data, options);
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
