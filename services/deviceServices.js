import {get} from '../utils/axios';

export const detailDevice = async params => {
  return await get(`/device/detailDeviceBy/${params.id}`);
};

export const detailDeviceIdEsp = async params => {
  return await get(`/device/detailDeviceBy/${params.id_esp}`);
};

export const getAllDevices = async () => {
  return await get(`/device/detailDevice`);
};