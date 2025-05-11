import {put} from '../utils/axios';

export const updateControl = async params => {  
  return await put(`/control/updateControl/${params.id_esp}/${params.controlId}`, {
    status: params.status,
    mode: params.mode,
  });
};

export const updateThreshold = async params => {  
  return await put(`/control/updateControl/${params.id_esp}/${params.controlId}`, {
    threshold_min: params.threshold_min,
    threshold_max: params.threshold_max,
  });
};

export const updateMode = async params => {  
  return await put(`/control/updateControl/${params.id_esp}/${params.controlId}`, {
    mode: params.mode,
  });
};