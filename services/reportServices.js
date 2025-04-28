import {get} from '../utils/axios';

export const reportDevices = async params => {
  return await get(`/api/report/listReport`);
};
