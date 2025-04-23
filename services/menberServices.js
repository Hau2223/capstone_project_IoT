import {get} from '../utils/axios';

export const memberId = async params => {
  return await get(`/device/membersDetail/${params.id}`);
};

export const memberBys = async params => {
  return await get(`/device/membersBy/${params.id_esp}`);
};

export const addMembertoDevice = async params => {
  return await post(`/device/addMember/${params.id_esp}`);
};
