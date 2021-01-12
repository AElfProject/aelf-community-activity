import {
  GET_CMS_AVAILABLE_TIMES,
  GET_CMS_COMMUNITY_LINKS,
  GET_CMS_LOTTERY_REFERENDUM_TIMES,
  GET_CMS_LOTTERY_SHARING
} from '../constant/apis';
import axios from '../service/axios';
import moment from 'moment';
import React from 'react';

export const getCommunityLink = type => {
  return axios.get(`${GET_CMS_COMMUNITY_LINKS}?_limit=20&open=true${type ? `&type=${type}` : ''} `);
}

export const getAvailableTime = type => {
  return axios.get(`${GET_CMS_AVAILABLE_TIMES}?open=true${type ? `&type=${type}` : ''}`);
}

export const checkTimeAvailable = dateInfo => {
  const timeNow = moment().unix();
  return moment(dateInfo.end).unix() > timeNow && moment(dateInfo.start).unix() < timeNow;
};

export const renderAvailableTime = dataInfo => {
  if (dataInfo.start === '') {
    return <span>Available Time: - </span>;
  }
  return <span>Available Time: {moment(dataInfo.start).format('YYYY-MM-DD HH:mm')} - {moment(dataInfo.end).format('YYYY-MM-DD HH:mm')}</span>;
};

export const getLotteryReferendumsInfo = () => {
  return axios.get(`${GET_CMS_LOTTERY_REFERENDUM_TIMES}`);
};

export const getLotterySharing = () => {
  return axios.get(`${GET_CMS_LOTTERY_SHARING}?_limit=1`);
};
