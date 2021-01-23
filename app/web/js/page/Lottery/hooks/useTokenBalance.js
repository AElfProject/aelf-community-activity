import React, {useState, useCallback, useEffect} from 'react';

export const useTokenBalance = ({
  tokenContract,
  address,
  symbol,
  refreshTime
}) => {
  const [balance, setBalance] = useState('0');

  const getBalance = useCallback(async() => {
    if (!tokenContract || !address || !symbol) {
      setBalance('0');
      return;
    }

    const balance = await tokenContract.GetBalance.call({
      symbol,
      owner: address
    });
    if (!balance || !balance.balance) {
      return;
    }
    setBalance(balance.balance);

  }, [tokenContract, address, symbol]);

  useEffect(() => {
    getBalance();
  }, [getBalance, refreshTime]);
  return balance;
};
