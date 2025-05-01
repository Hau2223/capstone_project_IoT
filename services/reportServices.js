import {get, post} from '../utils/axios';

export const reportDevices = async () => {
  return await get(`/listReport`);
};

export const reportbyIdDevices = async params => {
  return await get(`/report/detailReport/${params.id_esp}`);
};

export const reportByDate = async ({ id_esp, date }) => {
  return await post(`/report/detailReportByDate/${id_esp}`, { date });
};

export const reportByWeek = async ({ id_esp, week }) => {
  return await post(`/report/detailReportByWeek/${id_esp}`, { week });
};

export const reportByMonth = async ({ id_esp, month }) => {
  return await post(`/report/detailReportByMonth/${id_esp}`, { month });
};