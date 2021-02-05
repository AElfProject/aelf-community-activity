import React, {useState, useEffect} from "react";
import Bignumber from 'bignumber.js';
import { getAmountByInvitor } from '../../Charts/graphs/graph';

export const ReferralLinkStakingInfo = ({wethAddress, aelfAddress, web3PluginInstance}) => {

  const [totalAmount, setTotalAmount] = useState(0);
  const [staked, setStaked] = useState(0);
  const [percent, setPercent] = useState('-');
  useEffect(() => {
    if (!web3PluginInstance || !web3PluginInstance.getTotalAmountInReceipts) {
      return;
    }
    const getAmount = async () => {
      const totalAmount = await web3PluginInstance.getTotalAmountInReceipts();
      if (totalAmount) {
        setTotalAmount(new Bignumber(totalAmount).div(10 ** 18));
      }
    };
    const getStake = async () => {
      // const staked = await getAmountByInvitor(aelfAddress);
      const staked = await getAmountByInvitor(aelfAddress);
      const { amount = 0} = staked || {};
      setStaked(amount);
    };
    getAmount();
    if (aelfAddress) {
      getStake();
    }
  }, [wethAddress, aelfAddress, web3PluginInstance]);

  useEffect(() => {
    if (!totalAmount || !staked) {
      return;
    }
    setPercent(new Bignumber(staked).div(totalAmount).times(100).toFormat(2));
  }, [totalAmount, staked]);

  return <div>
    <span>Total Staking: {totalAmount ? totalAmount.toFormat() : '-'} ERC20 ELF</span>&nbsp;&nbsp;&nbsp;
    <span>ERC20 ELF Staking of My Referral: {staked || '-'} ELF ({percent}%)</span>
  </div>;
};
