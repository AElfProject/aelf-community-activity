import React, {useState, useEffect} from "react";

export const useAllLotteriesCount = (lotteryContract) => {
  const [allLotteriesCount, setAllLotteriesCount] = useState({value: '1'});

  useEffect(() => {
    if (!lotteryContract) {
      return;
    }
    async function getAllLotteriesCount() {
      const allLotteriesCount = await lotteryContract.GetAllLotteriesCount.call();
      setAllLotteriesCount(allLotteriesCount);
    }
    getAllLotteriesCount();
  }, [lotteryContract]);
  return allLotteriesCount;
};

export const useBoughtLotteriesCount = (aelfAddress, lotteryContract) => {
  const [boughtLotteriesCount, setBoughtLotteriesCount] = useState({value: '0'});

  useEffect(() => {
    if (!lotteryContract || !aelfAddress) {
      return;
    }
    async function getBoughtLotteriesCount() {
      const boughtLotteriesCount = await lotteryContract.GetBoughtLotteriesCount.call(aelfAddress);
      console.log('boughtLotteriesCount: ', boughtLotteriesCount);
      setBoughtLotteriesCount(boughtLotteriesCount);
    }
    getBoughtLotteriesCount();
  }, [lotteryContract, aelfAddress]);
  return boughtLotteriesCount;
};
