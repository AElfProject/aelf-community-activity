import { GET_CMS_OTHER_LINKS, GET_CMS_AVAILABLE_TIMES } from '../constant/apis';
import axios from '../service/axios';

export const getLinkByType = type => {
  return axios.get(`${GET_CMS_OTHER_LINKS}?_limit=20&open=true&type=${type}`);
}

export const getAvailableTime = () => {
  return axios.get(`${GET_CMS_AVAILABLE_TIMES}?open=true`);
}