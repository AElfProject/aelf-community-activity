import { Form, Input, Button, message, Card, InputNumber } from 'antd';
import React, {useState} from "react";
import Web3 from 'web3';
import { EXPLORER_URL, LOGIN_INFO, LOTTERY } from '../../../constant/constant';
import {useContract} from '../hooks/useContract';
import {useRegisteredDividend} from '../hooks/useRegisteredDividend';
import {useAllLotteriesCount, useBoughtLotteriesCount} from '../hooks/useLotteriesCount';
import {useAvailableTime} from '../hooks/useAvailableTime';
import {useCMSLotterySharing} from '../hooks/useCMSLotterySharing';
import { NightElfCheck } from '../../../utils/NightElf/NightElf';
import MessageTxToExplore from '../../../components/Message/TxToExplore';
import BigNumber from 'bignumber.js';
import { checkTimeAvailable, renderAvailableTime } from '../../../utils/cmsUtils';
import moment from 'moment';
import {RewardSharingStake} from './RewardSharingStake';
import './RewardSharing.less'

export const RewardSharing = ({aelfAddress}) => {

  const lotteryContract = useContract(aelfAddress, LOTTERY.CONTRACT_ADDRESS);
  const registeredDividend = useRegisteredDividend(aelfAddress, lotteryContract);
  const allLotteriesCount = useAllLotteriesCount(lotteryContract);
  const boughtLotteriesCount = useBoughtLotteriesCount(aelfAddress, lotteryContract);
  const rewardTime = useAvailableTime('lotteryRewardSharing');
  const rewardDisabled = !checkTimeAvailable(rewardTime);
  const lotterySharing = useCMSLotterySharing();

  console.log('lotterySharing: ', lotterySharing);
  // console.log('lotteryContract', aelfAddress, LOTTERY.CONTRACT_ADDRESS, lotteryContract, registeredDividend);
  // console.log('lotteryContract boughtLotteriesCount', allLotteriesCount, boughtLotteriesCount);

  const [addressErrorMsg, setAddressErrorMsg] = useState({
    type: 'success',
    msg: null
  });

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
          Estimated Available Bonus: {estimatedAvailableBonus} ELF({percentBN.toFormat(2)}%)</div>
        <div className='basic-blank'/>

        <RewardSharingStake
          aelfAddress={aelfAddress}
        />

        {registeredDividend && registeredDividend.receiver
          ? <div>Ethereum Address: {registeredDividend.receiver}</div>
          : <div>
            <Form
              layout="inline"
              name="basic"
              className="reward-sharing-form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Ethereum Address"
                name="ethAddress"
                help={addressErrorMsg.msg}
                validateStatus={addressErrorMsg.type}
              >
                <Input placeholder="please input" className="reward-eth-address-input"/>
              </Form.Item>

              <Form.Item>
                <Button
                  disabled={rewardDisabled}
                  type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        }
        <div className='basic-blank'/>
        <div>From <span>{moment(rewardTime.start).format('YYYY-MM-DD HH:mm')} to {moment(rewardTime.end).format('YYYY-MM-DD HH:mm')}, </span>
          users can fill in the information to claim the bonus.
          During this period, you can fill in the Ethereum wallet address to claim the bonus.
          Awards will be given in the order in which the information was submitted within 3 working days.</div>
        <div>Your aelf address will be bound to the Ethereum address to avoid repeat claims.</div>
      </div>
    </Card>
    <div className='next-card-blank'/>
  </>;
};
