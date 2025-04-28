import {put} from '../utils/axios';

export const updateControl = async params => {
  console.log(params);
  
  return await put(`/control/updateControl/${params.id_esp}/${params.controlId}`, {
    status: params.status,
    mode: params.mode,
  });
};

