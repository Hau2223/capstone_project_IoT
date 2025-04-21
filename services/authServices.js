import {get, post, put} from '../utils/axios';

export const login = async params => {
  return await post('/user/login', {
    email: params.email,
    password: params.password,
    deviceID: params.deviceId,
  });
};

export const loginGoogle = async idToken => {
  return await post('/user/googlemobile', {idToken});
};

export const signUp = async params => {
  return await post('/user/register', {
    name: params.name,
    email: params.email,
    password: params.password,
  });
};

export const sendOTPEmail = async params => {
  console.log(params.email);
  return await get(`/user/sendCode/${params.email}`);
};

export const sendEmailReset = async params => {
  return await get(`/user/sendCode/${params.email}`);
};

export const verifyOTP = async params => {
  return await post('/user/verifyOTP', {
    email: params.email,
    code: params.code,
  });
};

export const resetPass = async params => {
  return await post('/user/resetPassword', {
    email: params.email,
    newPassword: params.newPassword,
  });
};

export const profile = async () => {
  return await get('/user/profile');
};

export const gardenId = async () => {
  return await get('/user/getGardenby');
};

export const uploadAvatar = async (form, options = {}) => {
  return await put('/user/avatar', form, options);
};

export const updateProfile = async params => {
  return await put('/user/updateProfile', {
    name: params.name,
    phone: params.phone,
    gender: params.gender,
    address: params.address,
    dob: params.dob,
  });
};

export const changePassword = async params => {
  console.log(params.currentPassword);
  
  return await put('/user/changePassword', {
    currentPassword: params.currentPassword,
    newPassword: params.newPassword,
  });
};

