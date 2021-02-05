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
  const [refreshRegisteredInfo , setRefreshRegisteredInfo] = useState(0);
  const registeredDividend = useRegisteredDividend(aelfAddress, lotteryContract, refreshRegisteredInfo);
  const allLotteriesCount = useAllLotteriesCount(lotteryContract);
  const boughtLotteriesCount = useBoughtLotteriesCount(aelfAddress, lotteryContract);

  const rewardTime = useAvailableTime('lotteryRewardSharing');
  const stakedTime = useAvailableTime('lotteryRewardSharingStaking');
  // const {lotteryRewardSharing: rewardTime, lotteryRewardSharingStaking: stakedTime} = useAvailableTime(['lotteryRewardSharing', 'lotteryRewardSharingStaking'])
  // const stakedTime = useAvailableTime('lotteryRewardSharingStaking')
  const stakedDisabled = !checkTimeAvailable(stakedTime);
  const rewardDisabled = !checkTimeAvailable(rewardTime);
  const lotterySharing = useCMSLotterySharing();

  console.log('lotterySharing: ', lotterySharing);
  // console.log('lotteryContract', aelfAddress, LOTTERY.CONTRACT_ADDRESS, lotteryContract, registeredDividend);
  // console.log('lotteryContract boughtLotteriesCount', allLotteriesCount, boughtLotteriesCount);

  const [addressErrorMsg, setAddressErrorMsg] = useState({
    type: 'success',
    msg: null
  });
  // const tokenContract = useContract(aelfAddress, TOKEN_CONTRACT_ADDRESS);
  const [refreshTime, setRefreshTime]= useState(1);

  // const allowance  = useAelfTokenAllowance({
  //   tokenContract,
  //   address: aelfAddress,
  //   contractAddress: LOTTERY.CONTRACT_ADDRESS,
  //   tokenName: 'LOT',
  //   refreshTime: refreshTime
  // });
  const staked = useLotteryStaked({
    lotteryContract,
    address: aelfAddress,
    refreshTime: refreshTime
  });
  const allowanceShow = allowance / (10 ** TOKEN_DECIMAL);
  const stakedShow = staked / (10 ** TOKEN_DECIMAL);

  const onFinish = async (value) => {
    if(!Web3.utils.isAddress(value.ethAddress)) {
      setAddressErrorMsg({
        type: 'error',
        msg: 'Invalid Address',
      });
      return;
    }
    setAddressErrorMsg({
      type: 'success',
      msg: null
    });

    const lotteryContract = await NightElfCheck.initContractInstance({
      loginInfo: LOGIN_INFO,
      contractAddress: LOTTERY.CONTRACT_ADDRESS,
    });
    if (!lotteryContract) {
      message.error('Lottery Contract not ready');
      return;
    }

    const registerDividendResult = await lotteryContract.RegisterDividend({
      receiver: value.ethAddress
    });

    if (registerDividendResult.error) {
      throw Error(registerDividendResult.errorMessage.message || registerDividendResult.errorMessage);
    }

    const {TransactionId} = registerDividendResult.result || registerDividendResult;
    message.success('You can see ths new lottery number after the transaction is confirmed if you refresh the page', 6);
    MessageTxToExplore(TransactionId);
    const explorerHref = `${EXPLORER_URL}/tx/${TransactionId}`;
    setAddressErrorMsg({
      type: 'success',
      msg: <span>
        aelf Tx Hash (Chain: tDVV): <a target='_blank' href={explorerHref}>{TransactionId}</a>
      </span>
    });
    setRefreshRegisteredInfo(new Date().getTime());
  };
  const onFinishFailed = () => {};

  const percentBN = new BigNumber(boughtLotteriesCount.value).div(allLotteriesCount.value).times(100);
  const amount = lotterySharing[0].amount;
  const estimatedBonus = amount ? new BigNumber(amount).toFormat(2) : '-';
  const estimatedAvailableBonus = amount ? percentBN.times(amount).div(100).toFormat(2) : '-';
  const showLotterySharing = checkTimeAvailable({
    start: lotterySharing[0].start,
    end: lotterySharing[0].end,
  });

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
          Total Estimated Bonus: {estimatedBonus}ELF &nbsp;&nbsp;&nbsp;
          Estimated Available Bonus: {estimatedAvailableBonus} ELF({percentBN.toFormat(2)}%)&nbsp;&nbsp;&nbsp;
          My LOT Balance: {balanceLot ? new BigNumber(balanceLot).div(10 ** 8).toFormat() : '-'} LOT
        </div>
        <div className='basic-blank'/>

        <RewardSharingStake
          disabled={stakedDisabled}
          setRefreshTime={setRefreshTime}
          approvedLot={allowanceShow}
          stakedLot={stakedShow}
        />

        {/*{registeredDividend && registeredDividend.receiver*/}
        {/*  ? <div>Ethereum Address: {registeredDividend.receiver}</div>*/}
        {/*  : <div>*/}
        {/*    <Form*/}
        {/*      layout="inline"*/}
        {/*      name="basic"*/}
        {/*      className="reward-sharing-form"*/}
        {/*      initialValues={{ remember: true }}*/}
        {/*      onFinish={onFinish}*/}
        {/*      onFinishFailed={onFinishFailed}*/}
        {/*    >*/}
        {/*      <Form.Item*/}
        {/*        label="Ethereum Address"*/}
        {/*        name="ethAddress"*/}
        {/*        help={addressErrorMsg.msg}*/}
        {/*        validateStatus={addressErrorMsg.type}*/}
        {/*      >*/}
        {/*        <Input placeholder="please input" className="reward-eth-address-input"/>*/}
        {/*      </Form.Item>*/}

        {/*      <Form.Item>*/}
        {/*        <Button*/}
        {/*          disabled={rewardDisabled ? rewardDisabled : (+stakedShow) === 0}*/}
        {/*          type="primary" htmlType="submit">*/}
        {/*          Submit*/}
        {/*        </Button>*/}
        {/*      </Form.Item>*/}
        {/*    </Form>*/}
        {/*  </div>*/}
        {/*}*/}
        <div className='basic-blank'/>
        <div>From {moment(stakedTime.start).format('YYYY-MM-DD HH:mm')} to {moment(stakedTime.end).format('YYYY-MM-DD HH:mm')}, users can stake LOT. After {moment(stakedTime.end).format('YYYY-MM-DD HH:mm')}, the ELF awards of the prize pool will be divided in proportion according to the number of LOT token.</div>
        <div>You can collect your bonus after {moment(stakedTime.end).format('YYYY-MM-DD HH:mm')}, and the more details will be announced.</div>
      </div>
    </Card>
    <div className='next-card-blank'/>
  </>;
};
