import {get, post} from '../utils/axios';

export const getAllDevices = async () => {
  return await get('/device/detailDevice');
};

export const detailDevice = async params => {
  return await get(`/device/detailDeviceBy/${params.id}`);
};

// export const createDevice = async params => {
//   console.log(params);

//   return await post(`/device/createDevice`, {
//     id_esp: params.id_esp,
//   });
// };
