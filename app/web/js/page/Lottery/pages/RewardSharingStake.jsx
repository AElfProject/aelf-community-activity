import { Form, Button, InputNumber } from 'antd';
import React, {useState, useEffect} from "react";
import { LOGIN_INFO, LOTTERY, TOKEN_CONTRACT_ADDRESS, TOKEN_DECIMAL } from '../../../constant/constant';
// import {useContract} from '../hooks/useContract';
import { NightElfCheck } from '../../../utils/NightElf/NightElf';
import MessageTxToExplore from '../../../components/Message/TxToExplore';
import './RewardSharing.less'

export const RewardSharingStake = ({disabled, approvedLot, stakedLot, setRefreshTime}) => {

  // const lotteryContract = useContract(aelfAddress, LOTTERY.CONTRACT_ADDRESS);
  // const tokenContract = useContract(aelfAddress, TOKEN_CONTRACT_ADDRESS);
  // const [refreshTime, setRefreshTime]= useState(1);
  const initErrorMsg = {
    type: 'success',
    msg: null
  }
  const [approveErrorMsg, setApproveErrorMsg] = useState({...initErrorMsg});
  const [stakingErrorMsg, setStakingErrorMsg] = useState({...initErrorMsg})
  // const allowance  = useAelfTokenAllowance({
  //   tokenContract,
  //   address: aelfAddress,
  //   contractAddress: LOTTERY.CONTRACT_ADDRESS,
  //   tokenName: 'LOT',
  //   refreshTime: refreshTime
  // });

  // const staked = useLotteryStaked({
  //   lotteryContract,
  //   address: aelfAddress,
  //   refreshTime: refreshTime
  // });

  const onApproveFinish = async (value) => {
    if (!value.approvedLOT) {
      setApproveErrorMsg({
        type:"error",
        msg: "Please input the amount of LOT to be approved."
      })
      return
    }
    if (value.approvedLOT > approvedLot) {
      setApproveErrorMsg({
        type: "error",
        msg: `Please input the amount of LOT less then ${approvedLot}`
      })
      return
    }
    setApproveErrorMsg({...initErrorMsg})

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
    // if (!value.stakedLot) {
    //   throw Error('Please input the amount of LOT to be staked.');
    // }
    if (!value.stakedLot) {
      setStakingErrorMsg({
        type:"error",
        msg: "Please input the amount of LOT to be staked."
      })
      return
    }
    if (value.stakedLot > stakedLot) {
      setStakingErrorMsg({
        type: "error",
        msg: `Please input the amount of LOT less then ${stakedLot}`
      })
      return
    }
    setStakingErrorMsg({...initErrorMsg})

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
          label={`Approved LOT : ${approvedLot}`}
          name="approvedLOT"
          colon={false}
          help={approveErrorMsg.msg}
          validateStatus={approveErrorMsg.type}
        >
          <InputNumber
            min={0}
            placeholder="please input" className="reward-sharing-approved"
            type="number"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary" htmlType="submit" disabled={disabled}>
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
          label={`Staked LOT : ${stakedLot}`}
          name="stakedLot"
          colon={false}
          help={stakingErrorMsg.msg}
          validateStatus={stakingErrorMsg.type}
        >
          <InputNumber
            max={approvedLot}
            min={0}
            placeholder="please input" className="reward-sharing-staked"/>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary" htmlType="submit" disabled={disabled}>
            Staking
          </Button>
        </Form.Item>
      </Form>
    </div>
    <div className='basic-blank'/>
  </>;
};
