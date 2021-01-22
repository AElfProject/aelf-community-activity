import React, {useState, useCallback, useEffect} from 'react';
import { LOTTERY } from '../../../constant/constant';

export const useAelfTokenAllowance = ({
  tokenContract, address, contractAddress, tokenName,
  refreshTime
}) => {
  const [allowance, setAllowance] = useState('0');

  const getAllowance = useCallback(async() => {
    if (!tokenContract || !address || !tokenName) {
      setAllowance('0');
      return;
    }

    const allowance = await tokenContract.GetAllowance.call({
      symbol: tokenName,
      spender: contractAddress,
      owner: address
    });
    if (!allowance || !allowance.allowance) {
      return;
    }
    setAllowance(allowance.allowance);

  }, [tokenContract, address, contractAddress, tokenName]);

  useEffect(() => {
    getAllowance();
    console.log('refreshTime: ', refreshTime);
  }, [getAllowance, refreshTime]);
  return allowance;
};
