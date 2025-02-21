import {get, post} from '../utils/axios';

export const login = async params => {
  return await post('/user/login', {
    email: params.email,
    password: params.password,
    deviceID: params.deviceId,
  });
};

export const signUp = async params => {
  const data = {
    name: params.name,
    email: params.email,
    password: params.password,
  };
  console.log('data', data);
  return await post('/user/register', data);
};

export const sendOTPEmail = async params => {
  return await get(`/user/sendCode/${params.email}`);
};

export const verifyOTP = async params => {
  const data = {
    code: params.otp,
  };
  console.log('data', data);
  return await get('/user/verifyOTP', data);
};

export const profile = async id => {
  return await get(`/user/profile/${id}`);
};
