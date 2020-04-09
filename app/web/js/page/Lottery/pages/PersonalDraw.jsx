/* From start */
import React, { Component } from 'react';
import { Table, InputNumber, Button, message, Card } from 'antd';

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
      tokenBalance: 0,
      tokenAllowance: 0,
      boughtLotteries: []
    };
    this.tokenApproveCount = 0;
    this.buyCount = 0;
    this.tokenContract = new TokenContract();
    this.onBuyClick = this.onBuyClick.bind(this);
    this.onApproveChange = this.onApproveChange.bind(this);
    this.onExchangeNumberChange = this.onExchangeNumberChange.bind(this);
    this.onApproveClick = this.onApproveClick.bind(this);
    this.getBoughtLotteries = this.getBoughtLotteries.bind(this);
  }

  async componentDidMount() {
    await this.getVoteToken();
    await this.getVoteAllowance();
    await this.getBoughtLotteries();
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

    let tokenBalance = 0;
    if (address) {
      const tokenContractInstance = await this.tokenContract.getTokenContractInstance();
      const balance = await tokenContractInstance.GetBalance.call({
        symbol: LOTTERY.SYMBOL,
        owner: address
      });
      tokenBalance = parseInt(balance.balance, 10);
    }

    this.setState({
      tokenBalance
    });
  }

  async getVoteAllowance() {
    const { address } = this.props;

    let tokenAllowance = 0;
    if (address) {
      const tokenContractInstance = await this.tokenContract.getTokenContractInstance();
      const allowance = await tokenContractInstance.GetAllowance.call({
        symbol: LOTTERY.SYMBOL,
        spender: LOTTERY.CONTRACT_ADDRESS,
        owner: address
      });
      tokenAllowance = allowance.allowance;
    }

    this.setState({
      tokenAllowance
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
      const {tokenBalance} = this.state;
      this.setState({
        tokenBalance: tokenBalance - buyCount
      });
      setTimeout(() => {
        this.getBoughtLotteries();
      }, 3000);
    } catch(e) {
      message.error(e.message || 'Failed to buy a lottery.')
    }
  }

  onApproveChange(value) {
    this.tokenApproveCount = value;
  }

  onExchangeNumberChange(value) {
    this.buyCount = value;
  }

  async onApproveClick() {
    try {
      await approveVote(this.tokenApproveCount);
      message.success('Please wait for block confirmation', 10);
      setTimeout(() => {
        this.getVoteAllowance();
      }, 3000);
    } catch(e) {
      message.error(e.message || 'Failed to approve.')
    }
  }

  renderNoToken() {
    // const voteUrl = EXPLORER_URL + '/vote/election';
    return null;
    // return <>
    //   Please vote in the <a href={voteUrl} target='_blank'>browser</a> to get the {LOTTERY.SYMBOL} token
    // </>;
  }

  render() {
    const {address, currentPeriodNumber} = this.props;
    const {tokenBalance, tokenAllowance, boughtLotteries} = this.state;

    const tokenBalanceActual = tokenBalance / 10 ** 8;
    const tokenAllowanceActual = tokenAllowance / 10 ** 8;

    const historyHTML = renderHistory(boughtLotteries);

    const noTokenHTML = this.renderNoToken();

    return (
      <Card
        hoverable
        title='My Lottery'>
        <div className='section-content'>
          <div className='personal-title'>Exchange Lottery Code (Current Period: {currentPeriodNumber})</div>
          <div className='basic-line'/>
          <div className='basic-blank'/>
          <div>
            <div>Address: {address ? addressFormat(address) : 'Please login'}</div>
            <div className='basic-blank'/>
            <div> Balance: {tokenBalance ? tokenBalanceActual + ' ' + LOTTERY.SYMBOL : noTokenHTML}</div>
            <div className='basic-blank'/>
            <div>
              The {LOTTERY.SYMBOL} token you can use to exchange: {tokenAllowance ? tokenAllowanceActual + ' ' + LOTTERY.SYMBOL : 0} &nbsp;&nbsp;&nbsp;
              <InputNumber min={0} max={tokenBalanceActual} onChange={this.onApproveChange} />
              &nbsp;&nbsp;&nbsp;
              <Button type="primary" onClick={() => this.onApproveClick()}>Increase the upper limit</Button>
            </div>
            <div className='basic-blank'/>
            <div className='personal-exchange'>
              Exchange Quantity ({LOTTERY.RATIO} {LOTTERY.SYMBOL} = 1 Lottery Code): &nbsp;&nbsp;&nbsp;
              <InputNumber min={0} max={tokenAllowanceActual/LOTTERY.RATIO} defaultValue={1} onChange={this.onExchangeNumberChange} />
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
      </Card>
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

async function approveVote(tokenApproveCount) {
  if (!tokenApproveCount) {
    throw Error('Please input the amount to approve.');
  }

  const tokenContract = await NightElfCheck.initContractInstance({
    loginInfo: LOGIN_INFO,
    contractAddress: TOKEN_CONTRACT_ADDRESS,
  });

  const approveResult = await tokenContract.Approve({
    symbol: LOTTERY.SYMBOL,
    spender: LOTTERY.CONTRACT_ADDRESS,
    amount: tokenApproveCount * 10 ** TOKEN_DECIMAL
  });

  const {TransactionId} = approveResult.result;
  MessageTxToExplore(TransactionId);
}
