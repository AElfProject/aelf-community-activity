/* From start */
import React, { Component } from 'react';
import { Table, InputNumber, Button, message } from 'antd';

import {NightElfCheck} from '../../../utils/NightElf/NightElf';
import addressFormat from '../../../utils/addressFormat';
import { LOGIN_INFO, LOTTERY, TOKEN_CONTRACT_ADDRESS } from '../../../constant/constant';
import TokenContract from '../../../utils/tokenContract';
import MessageTxToExplore from '../../../components/Message/TxToExplore';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: '180px'
  },
  {
    title: 'Random Hash',
    dataIndex: 'random_hash',
    key: 'random_hash',
    // render: text => <a>{text}</a>,
    // render: text => <a>{text}</a>,
  },
  // {
  //   title: 'Owner',
  //   dataIndex: 'owner',
  //   key: 'owner',
  // },
  {
    title: 'level',
    dataIndex: 'level',
    key: 'level',
  },
  {
    title: 'block',
    dataIndex: 'block',
    key: 'block',
  },
];

// TODO: get data from explore api
const dataSource = [
  {
    id: '123',
    random_hash: '3432e422aa802ff577722535097473f368868af6e84277496b80931f81a08cb5',
    // owner: 'ELF_2Dyh4ASm6z7CaJ1J1WyvMPe2sJx5TMBW8CMTKeVoTMJ3ugQi3P_AELF',
    level: 1,
    block: 2791111
  },
  {
    id:'223',
    random_hash: '3432e422aa802ff577722535097473f368868af6e84277496b80931f81a08cb5',
    // owner: 'ELF_2Dyh4ASm6z7CaJ1J1WyvMPe2sJx5TMBW8CMTKeVoTMJ3ugQi3P_AELF',
    level: 2,
    block: 2791112
  },
];

function renderHistory() {
  return <Table dataSource={dataSource} columns={columns} pagination={false} />;
}

export default class PersonalDraw extends Component{
  constructor(props) {
    super(props);
    this.state = {
      voteBalance: 0,
      voteAllowance: 0
    };
    this.voteApproveCount = 0;
    this.buyCount = 0;
    this.tokenContract = new TokenContract();
    this.onBuyClick = this.onBuyClick.bind(this);
    this.onApproveChange = this.onApproveChange.bind(this);
    this.onExchangeNumberChange = this.onExchangeNumberChange.bind(this);
    this.onApproveClick = this.onApproveClick.bind(this);
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const addressChanged = prevProps.address !== this.props.address;
    if (addressChanged) {
      await this.getVoteToken();
      await this.getVoteAllowance();
    }
  }

  async getVoteToken() {
    const { address } = this.props;

    let voteBalance = 0;
    if (address) {
      const tokenContractInstance = await this.tokenContract.getTokenContractInstance();
      const balance = await tokenContractInstance.GetBalance.call({
        symbol: 'VOTE',
        owner: address
      });
      voteBalance = balance.balance;
    }

    this.setState({
      voteBalance
    });
  }

  async getVoteAllowance() {
    const { address } = this.props;

    let voteAllowance = 0;
    if (address) {
      const tokenContractInstance = await this.tokenContract.getTokenContractInstance();
      const allowance = await tokenContractInstance.GetAllowance.call({
        symbol: 'VOTE',
        spender: LOTTERY.CONTRACT_ADDRESS,
        owner: address
      });
      voteAllowance = allowance.allowance;
    }

    this.setState({
      voteAllowance
    });
  }

  async onBuyClick() {
    try {
      await buyLottery(this.buyCount);
      const {voteBalance} = this.state;
      this.setState({
        voteBalance: voteBalance - buyCount
      });
    } catch(e) {
      message.error(e.message || 'Failed to buy a lottery.')
    }
  }

  onApproveChange(value) {
    this.voteApproveCount = value;
  }

  onExchangeNumberChange(value) {
    this.buyCount = value;
  }

  async onApproveClick() {
    try {
      await approveVote(this.voteApproveCount);
      message.success('Please wait for block confirmation', 10);
      setTimeout(() => {
        this.getVoteAllowance();
      }, 3000);
    } catch(e) {
      // console.log(e);
      message.error(e.message || 'Failed to approve.')
    }
  }

  render() {
    const {address} = this.props;
    const {voteBalance, voteAllowance} = this.state;

    const historyHTML = renderHistory();

    return (
      <section className='section-basic basic-container'>
        <div className='section-title'>
          My Lottery
        </div>
        <div className='section-content'>
          <div className='personal-title'>Exchange Lottery Code</div>
          <div className='basic-line'/>
          <div className='basic-blank'/>
          <div>
            <div>Address: {address ? addressFormat(address) : 'Please login'}</div>
            <div className='basic-blank'/>
            <div> Balance: {voteBalance ? voteBalance + ' VOTE' : '-'}</div>
            <div className='basic-blank'/>
            <div>
              The vote token you can use to exchange: {voteAllowance ? voteAllowance + ' VOTE' : '-'} &nbsp;&nbsp;&nbsp;
              <InputNumber min={1} max={voteBalance} onChange={this.onApproveChange} />
              &nbsp;&nbsp;&nbsp;
              <Button type="primary" onClick={() => this.onApproveClick()}>Increase the upper limit</Button>
            </div>
            <div className='basic-blank'/>
            <div className='personal-exchange'>
              Exchange Quantity ({LOTTERY.RATIO} VOTE = 1 Lottery Code): &nbsp;&nbsp;&nbsp;
              <InputNumber min={1} max={voteAllowance/LOTTERY.RATIO} defaultValue={1} onChange={this.onExchangeNumberChange} />
              &nbsp;&nbsp;&nbsp;
              <Button type="primary" onClick={() => this.onBuyClick()}>Exchange</Button>
            </div>
          </div>

          <div className='basic-blank'/>
          <div className='personal-title'>History</div>
          <div className='basic-line'/>
          <div className='basic-blank'/>
          {historyHTML}
        </div>
      </section>
    );
  }
}

async function buyLottery (buyCount) {
  if (!buyCount) {
    throw Error('Please input the amount to buy.');
  }

  const lotteryContract = await NightElfCheck.initContractInstance({
    loginInfo: LOGIN_INFO,
    contractAddress: LOTTERY.CONTRACT_ADDRESS,
  });

  const lotteryResult = await lotteryContract.Buy({
    value: buyCount
  });

  const {TransactionId} = lotteryResult.result;
  MessageTxToExplore(TransactionId);
}

async function approveVote(voteApproveCount) {
  if (!voteApproveCount) {
    throw Error('Please input the amount to approve.');
  }

  const tokenContract = await NightElfCheck.initContractInstance({
    loginInfo: LOGIN_INFO,
    contractAddress: TOKEN_CONTRACT_ADDRESS,
  });

  const approveResult = await tokenContract.Approve({
    symbol: 'VOTE',
    spender: LOTTERY.CONTRACT_ADDRESS,
    amount: voteApproveCount
  });

  const {TransactionId} = approveResult.result;
  MessageTxToExplore(TransactionId);
}
