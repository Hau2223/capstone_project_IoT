import axios from 'axios';
import {CONFIG} from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
const httpRequest = axios.create({
  baseURL: `${CONFIG.baseUrl}`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});


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
