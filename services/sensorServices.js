import {get} from '../utils/axios';

export const detailSensor = async params => {
  return await get(`/sensor/detailSensorBy/${params.id}`);
};
