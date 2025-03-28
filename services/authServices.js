import {get, post} from '../utils/axios';

export const login = async params => {
  return await post('/user/login', {
    email: params.email,
    password: params.password,
    deviceID: params.deviceId,
  });
};

export const signUp = async params => {
  return await post('/user/register', {
    name: params.name,
    email: params.email,
    password: params.password,
  });
};

export const sendOTPEmail = async params => {
  return await get(`/user/sendCode/${params.email}`);
};

export const verifyOTP = async params => {
  return await post('/user/verifyOTP', {
    email: params.email,
    code: params.code,
  });
};

export const resetPass = async params => {
  return await post('/user/register', {
    email: params.email,
    newPassword: params.newPassword,
  });
};

export const profile = async id => {
  return await get(`/user/profile/${id}`);
};
