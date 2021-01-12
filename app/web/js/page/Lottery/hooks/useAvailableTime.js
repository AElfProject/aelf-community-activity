import React, {useState, useEffect} from 'react';
import { getAvailableTime } from '../../../utils/cmsUtils';

export const useAvailableTime = (type) => {
  const [availableDate, setAvailableDate] = useState({
    start: '',
    end: '',
  });

  useEffect(() => {
    if (!type) {
      return;
    }
    getAvailableTime().then(res => {
      const { data } = res;
      const date = data.find(item => item.type === type) || {};
      setAvailableDate(date)
    });
  }, [type]);
  return availableDate;
};
