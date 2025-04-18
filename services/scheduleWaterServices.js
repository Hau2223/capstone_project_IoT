import {get} from '../utils/axios';

export const scheduleId = async params => {    
    return await get(`/schedule/scheduleBy/${params.id_esp}/${params.name}`);
  };