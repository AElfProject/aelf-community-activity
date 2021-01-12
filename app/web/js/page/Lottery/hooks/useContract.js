import React, {useState, useEffect} from "react";
import Contract from '../../../utils/Contract';
import { NightElfCheck } from '../../../utils/NightElf/NightElf';
import { LOGIN_INFO, LOTTERY } from '../../../constant/constant';

export const useContract = (aelfAddress, contractAddress) => {
  const [contract, setContract] = useState();

  useEffect(() => {
    if (!contractAddress || !aelfAddress) {
      return;
    }
    async function getContract() {

      // const lotteryContract = await NightElfCheck.initContractInstance({
      //   loginInfo: LOGIN_INFO,
      //   contractAddress: LOTTERY.CONTRACT_ADDRESS,
      // });
      //
      // const takeRewardResult = await lotteryContract.TakeReward({
      //   lotteryId: parseInt(lotteryId, 10),
      //   registrationInformation: crytoyRegTrationInfo + '',
      //   period: parseInt(period, 10),
      // });

      const aelfContract = new Contract();
      const contractInstance = await aelfContract.getContractInstance(contractAddress);
      setContract(contractInstance);
      // setContract(lotteryContract);
    }
    getContract();
  }, [aelfAddress, contractAddress]);
  return contract;
};
