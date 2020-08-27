import { GET_CMS_COMMUNITY_LINKS, GET_CMS_AVAILABLE_TIMES, GET_CMS_LOTTERY_REFERENDUM_TIMES } from '../constant/apis';
import axios from '../service/axios';

export const getCommunityLink = type => {
  return axios.get(`${GET_CMS_COMMUNITY_LINKS}?_limit=20&open=true${type ? `&type=${type}` : ''} `);
}

export const getAvailableTime = type => {
  return axios.get(`${GET_CMS_AVAILABLE_TIMES}?open=true${type ? `&type=${type}` : ''}`);
}

export const getLotteryReferendumsInfo = () => {
  return axios.get(`${GET_CMS_LOTTERY_REFERENDUM_TIMES}`);
};
