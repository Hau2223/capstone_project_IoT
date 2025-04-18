import {get} from '../utils/axios';

export const getAllDevices = async () => {
  return await get('/device/detailDevice');
};

export const detailDevice = async params => {
  return await get(`/device/detailDeviceBy/${params.id}`);
};
