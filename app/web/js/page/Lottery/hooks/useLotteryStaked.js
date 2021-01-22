import React, {useState, useCallback, useEffect} from 'react';

export const useLotteryStaked = ({
  lotteryContract,
  address,
  refreshTime
}) => {
  const [staked, setStaked] = useState('0');

  const getStaked = useCallback(async() => {
    if (!lotteryContract || !address) {
      setStaked('0');
      return;
    }

    const staked = await lotteryContract.GetStakingAmount.call(address);
    if (!staked &&!staked.value) {
      return;
    }
    setStaked(staked.value);

  }, [lotteryContract, address]);

  useEffect(() => {
    getStaked();
  }, [getStaked, refreshTime]);
  return staked;
};
