import { Form, Button, InputNumber } from 'antd';
import React, {useState} from "react";
import { LOGIN_INFO, LOTTERY, TOKEN_CONTRACT_ADDRESS, TOKEN_DECIMAL } from '../../../constant/constant';
import {useContract} from '../hooks/useContract';
import {useAelfTokenAllowance} from '../hooks/useAelfTokenAllowance';
import {useLotteryStaked} from '../hooks/useLotteryStaked';
import { NightElfCheck } from '../../../utils/NightElf/NightElf';
import MessageTxToExplore from '../../../components/Message/TxToExplore';
import './RewardSharing.less'

export const RewardSharingStake = ({aelfAddress}) => {

  const lotteryContract = useContract(aelfAddress, LOTTERY.CONTRACT_ADDRESS);
  const tokenContract = useContract(aelfAddress, TOKEN_CONTRACT_ADDRESS);
  const [refreshTime, setRefreshTime]= useState(1);
  const allowance  = useAelfTokenAllowance({
    tokenContract,
    address: aelfAddress,
    contractAddress: LOTTERY.CONTRACT_ADDRESS,
    tokenName: 'LOT',
    refreshTime: refreshTime
  });

  const staked = useLotteryStaked({
    lotteryContract,
    address: aelfAddress,
    refreshTime: refreshTime
  });

  const onApproveFinish = async (value) => {
    if (!value.approvedLOT) {
      throw Error('Please input the amount of LOT to be approved.');
    }

    const tokenContract = await NightElfCheck.initContractInstance({
      loginInfo: LOGIN_INFO,
      contractAddress: TOKEN_CONTRACT_ADDRESS,
    });

    const approveResult = await tokenContract.Approve({
      symbol: LOTTERY.SYMBOL,
      spender: LOTTERY.CONTRACT_ADDRESS,
      amount: value.approvedLOT * 10 ** TOKEN_DECIMAL
    });

    if (approveResult.error) {
      throw Error(approveResult.errorMessage.message || approveResult.errorMessage);
    }

    const {TransactionId} = approveResult.result || approveResult;
    MessageTxToExplore(TransactionId);
    setTimeout(() => {
      setRefreshTime(new Date().getTime());
    }, 3000);
  };
  const onApproveFinishFailed = () => {};

  const onStakeFinish = async (value) => {
    if (!value.stakedLot) {
      throw Error('Please input the amount of LOT to be staked.');
    }

    const lotteryContract = await NightElfCheck.initContractInstance({
      loginInfo: LOGIN_INFO,
      contractAddress: LOTTERY.CONTRACT_ADDRESS,
    });

    const approveResult = await lotteryContract.Stake({
      value: value.stakedLot * 10 ** TOKEN_DECIMAL
    });

    if (approveResult.error) {
      throw Error(approveResult.errorMessage.message || approveResult.errorMessage);
    }

    const {TransactionId} = approveResult.result || approveResult;
    MessageTxToExplore(TransactionId);
    setTimeout(() => {
      setRefreshTime(new Date().getTime());
    }, 3000);
  };
  const onStakeFinishFailed = () => {};

  const allowanceShow = allowance / (10 ** TOKEN_DECIMAL);
  const stakedShow = staked / (10 ** TOKEN_DECIMAL);

  return <>
    <div>
      <Form
        layout="inline"
        name="basic"
        className="reward-sharing-form"
        onFinish={onApproveFinish}
        onFinishFailed={onApproveFinishFailed}
      >
        <Form.Item
          label={`Approved LOT: ${allowanceShow}`}
          name="approvedLOT"
        >
          <InputNumber
            min={0}
            placeholder="please input" className="reward-eth-address-input"/>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary" htmlType="submit">
            Approve
          </Button>
        </Form.Item>
      </Form>
    </div>
    <div className='basic-blank'/>

    <div>
      <Form
        layout="inline"
        name="basic"
        className="reward-sharing-form"
        onFinish={onStakeFinish}
        onFinishFailed={onStakeFinishFailed}
      >
        <Form.Item
          label={`Staked LOT: ${stakedShow}`}
          name="stakedLot"
        >
          <InputNumber
            max={allowanceShow}
            min={0}
            placeholder="please input" className="reward-eth-address-input"/>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary" htmlType="submit">
            Staking
          </Button>
        </Form.Item>
      </Form>
    </div>
    <div className='basic-blank'/>
  </>;
};
