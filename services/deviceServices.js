import {get} from '../utils/axios';

export const detailDevice = async params => {
  return await get(`/device/detailDeviceBy/${params.id}`);
};
