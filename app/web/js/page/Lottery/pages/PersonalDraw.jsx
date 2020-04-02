/* From start */
import React, { Component } from 'react';
import { Table, InputNumber, Button, message } from 'antd';

import {NightElfCheck} from '../../../utils/NightElf/NightElf';
import addressFormat from '../../../utils/addressFormat';
import { LOGIN_INFO, LOTTERY, TOKEN_CONTRACT_ADDRESS, EXPLORER_URL, TOKEN_DECIMAL } from '../../../constant/constant';
import TokenContract from '../../../utils/tokenContract';
import Contract from '../../../utils/Contract';
import MessageTxToExplore from '../../../components/Message/TxToExplore';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: '180px'
  },
  // {
  //   title: 'Random Hash',
  //   dataIndex: 'random_hash',
  //   key: 'random_hash',
  //   // render: text => <a>{text}</a>,
  //   // render: text => <a>{text}</a>,
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

function renderHistory(dataSource) {
  // const dataSource =  [
  //   {
  //     id: '36',
  //     owner: '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX',
  //     level: '0',
  //     block: '116371',
  //     registrationInformation: ''
  //   },
  // ];
  return <Table dataSource={dataSource} columns={columns} pagination={false} rowKey='block'/>;
}

export default class PersonalDraw extends Component{
  constructor(props) {
    super(props);
    this.state = {
      voteBalance: 0,
      voteAllowance: 0,
      boughtLotteries: []
    };
    this.voteApproveCount = 0;
    this.buyCount = 0;
    this.tokenContract = new TokenContract();
    this.onBuyClick = this.onBuyClick.bind(this);
    this.onApproveChange = this.onApproveChange.bind(this);
    this.onExchangeNumberChange = this.onExchangeNumberChange.bind(this);
    this.onApproveClick = this.onApproveClick.bind(this);
    this.getBoughtLotteries = this.getBoughtLotteries.bind(this);
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const addressChanged = prevProps.address !== this.props.address;
    if (addressChanged) {
      await this.getVoteToken();
      await this.getVoteAllowance();
      await this.getBoughtLotteries();
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
      voteBalance = parseInt(balance.balance, 10);
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

  async getBoughtLotteries() {
    const {currentPeriodNumber} = this.props;
    const { address } = this.props;
    if (!address) {
      this.setState({
        boughtLotteries: []
      });
      return;
    }

    const lotteryContract = await NightElfCheck.getContractInstance({
      loginInfo: LOGIN_INFO,
      contractAddress: LOTTERY.CONTRACT_ADDRESS,
    });

    const boughtLotteries = await lotteryContract.GetBoughtLotteries.call({
      period: currentPeriodNumber,
      startIndex: 0,
      owner: address
    });

    this.setState({
      boughtLotteries: boughtLotteries.lotteries ? boughtLotteries.lotteries.reverse() : []
    });
  }

  async onBuyClick() {
    try {
      await buyLottery(this.buyCount);
      const {voteBalance} = this.state;
      this.setState({
        voteBalance: voteBalance - buyCount
      });
      setTimeout(() => {
        this.getBoughtLotteries();
      }, 3000);
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
      message.error(e.message || 'Failed to approve.')
    }
  }

  renderNoVoteToken() {
    const voteUrl = EXPLORER_URL + '/vote/election';
    return <>
      Please vote in the <a href={voteUrl} target='_blank'>browser</a> to get the vote token
    </>;
  }

  render() {
    const {address, currentPeriodNumber} = this.props;
    const {voteBalance, voteAllowance, boughtLotteries} = this.state;

    const voteBalanceActual = voteBalance / 10 ** 8;
    const voteAllowanceActual = voteAllowance / 10 ** 8;

    const historyHTML = renderHistory(boughtLotteries);

    const noVoteTokenHTML = this.renderNoVoteToken();

    return (
      <section className='section-basic basic-container'>
        <div className='section-title'>
          My Lottery
        </div>
        <div className='section-content'>
          <div className='personal-title'>Exchange Lottery Code (Current Period: {currentPeriodNumber})</div>
          <div className='basic-line'/>
          <div className='basic-blank'/>
          <div>
            <div>Address: {address ? addressFormat(address) : 'Please login'}</div>
            <div className='basic-blank'/>
            <div> Balance: {voteBalance ? voteBalanceActual + ' VOTE' : noVoteTokenHTML}</div>
            <div className='basic-blank'/>
            <div>
              The vote token you can use to exchange: {voteAllowance ? voteAllowanceActual + ' VOTE' : 0} &nbsp;&nbsp;&nbsp;
              <InputNumber min={0} max={voteBalanceActual} onChange={this.onApproveChange} />
              &nbsp;&nbsp;&nbsp;
              <Button type="primary" onClick={() => this.onApproveClick()}>Increase the upper limit</Button>
            </div>
            <div className='basic-blank'/>
            <div className='personal-exchange'>
              Exchange Quantity ({LOTTERY.RATIO} VOTE = 1 Lottery Code): &nbsp;&nbsp;&nbsp;
              <InputNumber min={0} max={voteAllowanceActual/LOTTERY.RATIO} defaultValue={1} onChange={this.onExchangeNumberChange} />
              &nbsp;&nbsp;&nbsp;
              <Button type="primary" onClick={() => this.onBuyClick()}>Exchange</Button>
            </div>
          </div>

          <div className='basic-blank'/>
          <div className='personal-title'>Current Period Lottery Numbers</div>
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
  message.success('You can see ths new lottery number after the transaction is confirmed if you refresh the page', 6);
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
    amount: voteApproveCount * 10 ** TOKEN_DECIMAL
  });

  const {TransactionId} = approveResult.result;
  MessageTxToExplore(TransactionId);
}
