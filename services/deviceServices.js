import {get, patch, post, put} from '../utils/axios';

export const getAllDevices = async () => {
  return await get('/device/detailDevice');
};

export const getUserDevices = async () => {
  return await get('/device/userDevices');
};


export const detailDevice = async params => {
  return await get(`/device/detailDeviceBy/${params.id}`);
};

export const updateNameDevice = async params => {  
  return await patch(`/device/updateName/${params.id_esp}`, {
    name_area: params.name_area,
  });
};

export const uploadImgDevice = async (params, form, options = {}) => {
  return await put(`/device/upload-img/${params.id_esp}`, form, options);
};

