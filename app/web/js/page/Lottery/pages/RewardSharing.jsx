import { Form, Input, Button, message, Card } from 'antd';
import React, {useState, useContext} from "react";
import Web3 from 'web3';
import { EXPLORER_URL, LOGIN_INFO, LOTTERY,TOKEN_CONTRACT_ADDRESS, TOKEN_DECIMAL } from '../../../constant/constant';
import {useContract} from '../hooks/useContract';
import {useRegisteredDividend} from '../hooks/useRegisteredDividend';
import {useAllLotteriesCount, useBoughtLotteriesCount} from '../hooks/useLotteriesCount';
import {useAvailableTime} from '../hooks/useAvailableTime';
import {useCMSLotterySharing} from '../hooks/useCMSLotterySharing';
import {useAelfTokenAllowance} from '../hooks/useAelfTokenAllowance';
import {useLotteryStaked} from '../hooks/useLotteryStaked';
import { NightElfCheck } from '../../../utils/NightElf/NightElf';
import MessageTxToExplore from '../../../components/Message/TxToExplore';
import BigNumber from 'bignumber.js';
import { checkTimeAvailable, renderAvailableTime, getAvailableTime} from '../../../utils/cmsUtils';
import moment from 'moment';
import {RewardSharingStake} from './RewardSharingStake';
import './RewardSharing.less'

import { LotteryContext, LotteryProvider } from '../context/lotteryContext';

export const RewardSharing = ({aelfAddress}) => {

  const lotteryContext = useContext(LotteryContext);
  const {state, dispatch} = lotteryContext;
  const {
    allowanceLot: allowance,
    balanceLot
  } = state;

  const lotteryContract = useContract(aelfAddress, LOTTERY.CONTRACT_ADDRESS);
  // const [refreshRegisteredInfo , setRefreshRegisteredInfo] = useState(0);
  // const registeredDividend = useRegisteredDividend(aelfAddress, lotteryContract, refreshRegisteredInfo);
  const allLotteriesCount = useAllLotteriesCount(lotteryContract);
  const boughtLotteriesCount = useBoughtLotteriesCount(aelfAddress, lotteryContract);

  const rewardTime = useAvailableTime('lotteryRewardSharing');
  const stakedTime = useAvailableTime('lotteryRewardSharingStaking');
  const stakedDisabled = !checkTimeAvailable(stakedTime);
  // const rewardDisabled = !checkTimeAvailable(rewardTime);
  const lotterySharing = useCMSLotterySharing();

  // const [addressErrorMsg, setAddressErrorMsg] = useState({
  //   type: 'success',
  //   msg: null
  // });
  // const tokenContract = useContract(aelfAddress, TOKEN_CONTRACT_ADDRESS);
  const [refreshTime, setRefreshTime]= useState(1);

  const staked = useLotteryStaked({
    lotteryContract,
    address: aelfAddress,
    refreshTime: refreshTime
  });

  const allowanceShow = allowance / (10 ** TOKEN_DECIMAL);
  const stakedShow = staked / (10 ** TOKEN_DECIMAL);

  const percentBN = new BigNumber(boughtLotteriesCount.value).div(allLotteriesCount.value).times(100);
  const amount = lotterySharing[0].amount;
  const estimatedBonus = amount ? new BigNumber(amount).toFormat(2) : '-';
  const estimatedAvailableBonus = amount ? percentBN.times(amount).div(100).toFormat(2) : '-';
  const showLotterySharing = checkTimeAvailable({
    start: lotterySharing[0].start,
    end: lotterySharing[0].end,
  });
  const collectNotAvailable = checkTimeAvailable({
    start: lotterySharing[0].start,
    end: moment(lotterySharing[0].end).add(18, 'hours'),
  });
  const [collectLoading, setCollectLoading] = useState(false);

  if (!showLotterySharing) {
    return null;
  }

  return <>
    <Card
      className='hover-cursor-auto'
      hoverable
      title='Reward sharing'
      extra={renderAvailableTime(rewardTime)}
    >
      <div className='section-content swap-flex-wrap reward-sharing'>
        <div>
          <b>The maximum share of the prize amount is 600000 ELF！</b>
        </div>
        <div>
          Total Estimated Bonus: {estimatedBonus}ELF &nbsp;&nbsp;&nbsp;
          My LOT Balance: {balanceLot ? new BigNumber(balanceLot).div(10 ** 8).toFormat() : '-'} LOT
        </div>
        <div className='basic-blank'/>

        <div>
          My Available Bonus: {estimatedAvailableBonus} ELF({percentBN.toFormat(2)}%)&nbsp;&nbsp;&nbsp;
          <Button
            type="primary" htmlType="submit"
            disabled={collectNotAvailable || !staked || +staked === 0 || collectLoading}
            loading={collectLoading}
            onClick={async () => {
              setCollectLoading(true);
              const lotteryContract = await NightElfCheck.initContractInstance({
                loginInfo: LOGIN_INFO,
                contractAddress: LOTTERY.CONTRACT_ADDRESS,
              });
              if (!lotteryContract) {
                message.error('Lottery Contract not ready');
                setCollectLoading(false);
                return;
              }

              const takeDividResult = await lotteryContract.TakeDividend();

              if (takeDividResult.error) {
                setCollectLoading(false);
                throw Error(takeDividResult.errorMessage.message || takeDividResult.errorMessage);
              }

              const {TransactionId} = takeDividResult.result || takeDividResult;
              MessageTxToExplore(TransactionId);

              setTimeout(() => {
                setRefreshTime(new Date().getTime());
                setCollectLoading(false);
              }, 3000);
            }}
          >
            Collect
          </Button>
        </div>

        <div className='basic-blank'/>

        <RewardSharingStake
          disabled={stakedDisabled}
          setRefreshTime={setRefreshTime}
          approvedLot={allowanceShow}
          stakedLot={stakedShow}
        />

        <div className='basic-blank'/>
        <div>From {moment(stakedTime.start).format('YYYY-MM-DD HH:mm')} to {moment(stakedTime.end).format('YYYY-MM-DD HH:mm')}, users can stake LOT. After {moment(stakedTime.end).format('YYYY-MM-DD HH:mm')}, the ELF awards of the prize pool will be divided in proportion according to the number of LOT token.</div>
        <div>You can collect your bonus after {moment(stakedTime.end).add(18, 'hours').format('YYYY-MM-DD HH:mm')}, and the more details will be announced.</div>
      </div>
    </Card>
    <div className='next-card-blank'/>
  </>;
};
