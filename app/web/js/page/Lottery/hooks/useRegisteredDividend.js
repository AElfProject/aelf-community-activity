import React, {useState, useEffect} from "react";

export const useRegisteredDividend = (aelfAddress, lotteryContract) => {
  const [registeredDividend, setRegisteredDividend] = useState();

  useEffect(() => {
    if (!aelfAddress || !lotteryContract) {
      return;
    }
    async function getRegisteredDividend() {
      console.log('registeredDividend: ', aelfAddress);
      const registeredDividend = await lotteryContract.GetRegisteredDividend.call(aelfAddress);
      console.log('registeredDividend aelfAddress: ', registeredDividend);
      setRegisteredDividend(registeredDividend);
    }
    getRegisteredDividend();
  }, [aelfAddress, lotteryContract]);
  return registeredDividend;
};
