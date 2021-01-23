import React, {createContext, useReducer} from 'react';
import { useAelfTokenAllowance } from '../hooks/useAelfTokenAllowance';
import { LOTTERY, TOKEN_CONTRACT_ADDRESS } from '../../../constant/constant';
import { useContract } from '../hooks/useContract';
import { useTokenBalance } from '../hooks/useTokenBalance';

const defaultLotteryState = {
  allowanceLot: 0,
  balanceLot: 0,
  refreshTime: 0,
  approveAmount: 0,
  lotBalance: 0,
  test: 2
};

const LotteryContext = createContext({
  state: defaultLotteryState,
  dispatch: () => null
});

const reducer = (state, action) => {
  switch(action.type) {
    case 'test':
      return Object.assign({}, state, {
        test: action.value
      });
    case 'refresh':
      return Object.assign({}, state, {
        refreshTime: action.value
      });
    default:
      throw new Error();
  }
};

const LotteryProvider = ({
  children,
  aelfAddress,
}) => {
  const [state, dispatch] = useReducer(reducer, defaultLotteryState);
  const {refreshTime} = state;

  const tokenContract = useContract(aelfAddress, TOKEN_CONTRACT_ADDRESS);
  const allowanceLot  = useAelfTokenAllowance({
    tokenContract,
    address: aelfAddress,
    contractAddress: LOTTERY.CONTRACT_ADDRESS,
    tokenName: 'LOT',
    refreshTime
  });
  const balanceLot = useTokenBalance({
    tokenContract,
    address: aelfAddress,
    symbol: 'LOT',
    refreshTime
  });

  return <LotteryContext.Provider
    value={{
      state: {
        ...state,
        allowanceLot,
        balanceLot,
      },
      dispatch
    }}
  >
    {children}
  </LotteryContext.Provider>
};

export { LotteryContext, LotteryProvider };
