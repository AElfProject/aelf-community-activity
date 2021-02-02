import React, {useState, useCallback, useEffect} from 'react';

export const useBoughtLotteryCountInOnePeriod = ({
  lotteryContract,
  address,
  periodNumber,
  refreshTime
}) => {
  const [count, setCount] = useState(0);

  const getBoughtLotteryCountInOnePeriod = useCallback(async() => {
    if (!lotteryContract || !address || !periodNumber) {
      setCount(0);
      return;
    }

    const count = await lotteryContract.GetBoughtLotteryCountInOnePeriod.call({
      owner: address,
      periodNumber
    });
    if (!count || !count.value) {
      setCount(0);
      return;
    }
    setCount(count.value);

  }, [lotteryContract, periodNumber, address]);

  useEffect(() => {
    getBoughtLotteryCountInOnePeriod();
  }, [getBoughtLotteryCountInOnePeriod, refreshTime]);
  return count;
};
