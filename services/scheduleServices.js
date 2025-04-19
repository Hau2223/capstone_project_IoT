import {get, put, post, del} from '../utils/axios';

export const scheduleId = async params => {
  return await get(`/schedule/scheduleBy/${params.id_esp}/${params.name}`);
};

export const updateSchedule = async params => {
  return await put(
    `/schedule/updateSchedule/${params.id_esp}/${params.scheduleId}`,
    params.data,
  );
};

export const addSchedule = async params => {
  return await post(
    `/schedule/addSchedule/${params.id_esp}/${params.name}`,
    params.data,
  );
};

export const delSchedule = async params => {
  return await del(
    `/schedule/delSchedule/${params.id_esp}/${params.scheduleId}`,
  );
};
