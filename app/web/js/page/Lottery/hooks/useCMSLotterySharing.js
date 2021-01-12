import React, {useState, useEffect} from 'react';
import { getLotterySharing } from '../../../utils/cmsUtils';

export const useCMSLotterySharing = (type) => {
  const [lotterySharing, setLotterySharing] = useState([{
    amount: null,
    start: '',
    end: '',
  }]);

  useEffect(() => {
    getLotterySharing().then(res => {
      const { data } = res;
      setLotterySharing(data)
    });
  }, []);
  return lotterySharing;
};
