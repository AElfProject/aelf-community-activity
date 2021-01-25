import React, {useState, useEffect} from "react";

export const useRegisteredDividend = (aelfAddress, lotteryContract, refresh) => {
  const [registeredDividend, setRegisteredDividend] = useState();

  useEffect(() => {
    if (!aelfAddress || !lotteryContract) {
      return;
    }
    async function getRegisteredDividend() {
      const registeredDividend = await lotteryContract.GetRegisteredDividend.call(aelfAddress);
      setRegisteredDividend(registeredDividend);
    }
    getRegisteredDividend();
  }, [aelfAddress, lotteryContract, refresh]);
  return registeredDividend;
};
