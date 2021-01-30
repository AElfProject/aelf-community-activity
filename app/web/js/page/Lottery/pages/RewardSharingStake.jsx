import { Form, Button, InputNumber } from 'antd';
import React, {useState, useEffect, useContext} from "react";
import { LOGIN_INFO, LOTTERY, TOKEN_CONTRACT_ADDRESS, TOKEN_DECIMAL } from '../../../constant/constant';
// import {useContract} from '../hooks/useContract';
import { NightElfCheck } from '../../../utils/NightElf/NightElf';
import MessageTxToExplore from '../../../components/Message/TxToExplore';
import './RewardSharing.less'
import { LotteryContext } from '../context/lotteryContext';

export const RewardSharingStake = ({disabled, approvedLot, stakedLot, setRefreshTime}) => {

  const lotteryContext = useContext(LotteryContext);
  const {dispatch, state} = lotteryContext;
  const { balanceLot } = state;

  const initErrorMsg = {
    type: 'success',
    msg: null
  };
  const [approveErrorMsg, setApproveErrorMsg] = useState({...initErrorMsg});
  const [stakingErrorMsg, setStakingErrorMsg] = useState({...initErrorMsg});

  const onApproveFinish = async (value) => {
    if (!value.approvedLOT) {
      setApproveErrorMsg({
        type:"error",
        msg: "Please input the amount of LOT to be approved."
      });
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
      dispatch({
        type: 'refresh',
        value: new Date().getTime()
      });
    }, 3000);
  };
  const onApproveFinishFailed = () => {};

  const onStakeFinish = async (value) => {
    if (!value.stakedLot) {
      setStakingErrorMsg({
        type:"error",
        msg: "Please input the amount of LOT to be staked."
      });
      return
    }
    if (value.stakedLot > approvedLot) {
      setStakingErrorMsg({
        type: "error",
        msg: `Please input the amount of LOT less then ${approvedLot}`
      });
      return
    }
    setStakingErrorMsg({...initErrorMsg});

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
      dispatch({
        type: 'refresh',
        value: new Date().getTime()
      });
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
            {approvedLot ? 'Approve More' : 'Approve'}
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
            max={Math.min(approvedLot, balanceLot / (10**8))}
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
