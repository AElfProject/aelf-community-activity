/* From start */
import React, { Component } from 'react';
import { Table, InputNumber, Button, message, Card } from 'antd';
import axios from '../../../service/axios';

import {NightElfCheck, getViewResult} from '../../../utils/NightElf/NightElf';
import addressFormat from '../../../utils/addressFormat';
import {
  LOGIN_INFO,
  LOTTERY,
  TOKEN_CONTRACT_ADDRESS,
  EXPLORER_URL,
  TOKEN_DECIMAL,
  HTTP_PROVIDER
} from '../../../constant/constant';
import TokenContract from '../../../utils/tokenContract';
import Contract from '../../../utils/Contract';
import MessageTxToExplore from '../../../components/Message/TxToExplore';
import { POST_DECRYPT_LIST } from '../../../constant/apis';
import { checkTimeAvailable, getAvailableTime } from '../../../utils/cmsUtils';
import { sleep } from '../../../utils/utils';

import {LotteryContext} from '../context/lotteryContext';
import moment from 'moment';
import AElf from 'aelf-sdk';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  // {
  //   title: 'Random Hash',
  //   dataIndex: 'random_hash',
  //   key: 'random_hash',
  //   // render: text => <a>{text}</a>,
  //   // render: text => <a>{text}</a>,
  // },
  {
    title: 'block',
    dataIndex: 'block',
    key: 'block',
    width: 150
  },
  {
    title: 'Reward Name',
    dataIndex: 'rewardName',
    key: 'rewardName',
    width: 200
  },
  // {
  //   title: 'Registration Information (After Draw)',
  //   // dataIndex: 'registrationInformation',
  //   dataIndex: 'decryptInfo',
  //   // key: 'registrationInformation',
  //   key: 'decryptInfo',
  //   width: 300
  // },
];

function renderHistory(dataSource, historyLoading) {
  // const dataSource =  [
  //   {
  //     id: '36',
  //     owner: '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX',
  //     level: '0',
  //     block: '116371',
  //     registrationInformation: ''
  //   },
  // ];
  return <Table
    pagination={{pageSize: 20}}
    dataSource={dataSource}
    loading={historyLoading}
    columns={columns}
    rowKey='id'
    scroll={{x: 512}}
  />;
}

class PersonalDraw extends Component{
  constructor(props) {
    super(props);
    this.state = {
      tokenBalance: 0,
      tokenAllowance: 0,
      boughtLotteries: [],
      historyLoading: false,
      buyoutLoading: false,
      switchCodeDate: {
        start: '',
        end: ''
      }
    };

    this.aelf = new AElf(new AElf.providers.HttpProvider(HTTP_PROVIDER));
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
    await this.getBoughtLotteries();

    getAvailableTime().then(res => {
      const { data } = res;
      const switchCodeDate = data.find(item => item.type === 'lotterySwitchCode') || {};
      this.setState({
        switchCodeDate,
      });
    });
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const addressChanged = prevProps.address !== this.props.address;
    if (addressChanged) {
      await this.getBoughtLotteries();
    }
  }

  async decryptBoughtLotteries(boughtLotteriesReversed) {
    const registrationInformationList = boughtLotteriesReversed.map(item => {
      return item.registrationInformation;
    });
    const decryptedList = (await axios.post(POST_DECRYPT_LIST, {
      encryptedList: registrationInformationList
    })).data || [];

    decryptedList.forEach((item, index) => {
      if (!!item) {
        boughtLotteriesReversed[index].decryptInfo = item;
      }
    });

    this.setState({
      boughtLotteries: boughtLotteriesReversed,
      historyLoading: false
    });
  }

  async getBoughtLotteries(startId = -1, clearPre = true) {
    // const {currentPeriodNumber} = this.props;
    const { address } = this.props;
    const { boughtLotteries: boughtLotteriesPre } = this.state;
    if (!address) {
      this.setState({
        boughtLotteries: []
      });
      return;
    }
    this.setState({
      historyLoading: true
    });

    const lotteryContract = await NightElfCheck.initContractInstance({
      loginInfo: LOGIN_INFO,
      contractAddress: LOTTERY.CONTRACT_ADDRESS,
    });

    const boughtLotteriesResult = await lotteryContract.GetBoughtLotteries.call({
      // period: currentPeriodNumber,
      period: 0,
      startId,
      owner: address
    });

    const boughtLotteries = getViewResult('lotteries', boughtLotteriesResult) || [];
    const boughtLotteriesReversed = clearPre ? boughtLotteries.reverse() : [...boughtLotteries.reverse(), ...boughtLotteriesPre];

    await this.decryptBoughtLotteries(boughtLotteriesReversed);

    if (boughtLotteries.length === 20) {
      const newStartId = boughtLotteries[0].id;
      await this.getBoughtLotteries(newStartId, false);
    }
  }

  async onBuyClick() {

    if (this.buyCount%1) {
      message.error('Please enter a positive integer.');
      return;
    }
    this.setState({
      buyoutLoading: true
    });
    try {
      await buyLottery(this.buyCount, this.aelf);

      setTimeout(() => {
        this.getBoughtLotteries();
        const {dispatch} = this.context;
        dispatch({
          type: 'refresh',
          refreshTime: new Date().getTime()
        });
      }, 3000);
    } catch(e) {
      if (e.TransactionId) {
        MessageTxToExplore(e.TransactionId, 'error');
      } else {
        message.error(e.message || 'Failed to buy a lottery.');
      }
    }
    this.setState({
      buyoutLoading: false
    });
  }

  onApproveChange(value) {
    this.tokenApproveCount = value;
  }

  onExchangeNumberChange(value) {
    this.buyCount = value;
  }

  async onApproveClick() {
    const {dispatch} = this.context;
    try {
      await approveVote(this.tokenApproveCount);
      // message.success('Please wait for block confirmation', 10);
    } catch(e) {
      message.error(e.message || 'Failed to approve.')
    }
    setTimeout(() => {
      dispatch({
        type: 'refresh',
        refreshTime: new Date().getTime()
      });
    }, 3000);
  }

  renderNoToken() {
    // const voteUrl = EXPLORER_URL + '/vote/election';
    return 0;
  }

  render() {

    const {state: stateContext} = this.context;

    const {address, currentPeriodNumber} = this.props;
    const {
      boughtLotteries, historyLoading, switchCodeDate,
      buyoutLoading
    } = this.state;

    const switchDisabled = !checkTimeAvailable(switchCodeDate);

    const tokenBalanceActual = stateContext.balanceLot / 10 ** 8;
    const tokenAllowanceActual = stateContext.allowanceLot / 10 ** 8;

    const historyHTML = renderHistory(boughtLotteries, historyLoading);

    const noTokenHTML = this.renderNoToken();

    return (
      <Card
        className='hover-cursor-auto'
        hoverable
        title='My Lottery'>
        <div className='section-content'>
          <div className='personal-title'>Switch Lottery Code (Current Period: {
            currentPeriodNumber < LOTTERY.START_PERIOD ? '-' : currentPeriodNumber - LOTTERY.START_PERIOD + 1
          })</div>
          <div className='basic-line'/>
          <div className='basic-blank'/>
          <div>
            <div>Address: {address ? addressFormat(address) : 'Please login'}</div>
            <div className='basic-blank'/>
            <div> Balance: {stateContext.balanceLot ? tokenBalanceActual + ' ' + LOTTERY.SYMBOL : noTokenHTML}</div>
            <div className='basic-blank'/>
            <div>
              Authorized credit limit for lottery application: {stateContext.allowanceLot ? tokenAllowanceActual + ' ' + LOTTERY.SYMBOL : 0} &nbsp;&nbsp;&nbsp;
              <InputNumber min={0} max={tokenBalanceActual - tokenAllowanceActual} onChange={this.onApproveChange} />
              &nbsp;&nbsp;&nbsp;
              <Button
                disabled={switchDisabled}
                type="primary" onClick={() => this.onApproveClick()}>Increase the upper limit</Button>
            </div>
            <div className='basic-blank'/>
            <div className='personal-exchange'>
              Code Amount ({LOTTERY.RATIO} {LOTTERY.SYMBOL} = 1 Lottery Code): &nbsp;&nbsp;&nbsp;
              <InputNumber
                min={0}
                max={Math.min(Math.floor(Math.min(tokenAllowanceActual, tokenBalanceActual)/LOTTERY.RATIO), LOTTERY.MAX_BUY)}
                defaultValue={1}
                onChange={this.onExchangeNumberChange} />
              &nbsp;&nbsp;&nbsp;
              <Button
                loading={buyoutLoading}
                disabled={switchDisabled || buyoutLoading}
                type="primary" onClick={() => this.onBuyClick()}>Switch</Button>
            </div>
            <div className="text-grey">
              <div>At most 50 Lottery Code can be swapped for each switch.</div>
              <div>The Lucky Draw Function will be closed after {switchCodeDate.end ? moment(switchCodeDate.end).format('YYYY-MM-DD HH:mm') : '-'}. Please switch it in time to avoid loss.</div>
            </div>
          </div>

          <div className='basic-blank'/>
          <div className='personal-title'>All Lottery Numbers</div>
          <div className='basic-line'/>
          <div className='basic-blank'/>
          {historyHTML}
        </div>
      </Card>
    );
  }
}

async function buyLottery (buyCount, aelf) {
  if (!buyCount) {
    throw Error('Please input the amount of lottery code to be switched.');
  }

  const lotteryContract = await NightElfCheck.initContractInstance({
    loginInfo: LOGIN_INFO,
    contractAddress: LOTTERY.CONTRACT_ADDRESS,
  });

  const lotteryResult = await lotteryContract.Buy({
    value: buyCount
  });

  if (lotteryResult.error) {
    throw Error(lotteryResult.errorMessage.message || lotteryResult.errorMessage);
  }

  const {TransactionId} = lotteryResult.result || lotteryResult;

  await getBuyoutTxResult(TransactionId, aelf);
  // TODO: check transaction
  message.success('You can see ths new lottery number after the transaction is confirmed if you refresh the page', 6);
  MessageTxToExplore(TransactionId);
}

async function getBuyoutTxResult(TransactionId, aelf) {
  const txResult = await aelf.chain.getTxResult(TransactionId);

  if (!txResult) {
    throw Error('Can not get switch transaction result.');
  }

  if (txResult.Status.toLowerCase() === 'pending') {
    await sleep(1000);
    return getBuyoutTxResult(TransactionId, aelf);
  }

  if (txResult.Status.toLowerCase() === 'mined') {
    return TransactionId;
  }

  MessageTxToExplore(TransactionId, 'error');
  throw Error(txResult.Error || 'Buyout error');
}

async function approveVote(tokenApproveCount) {
  if (!tokenApproveCount) {
    throw Error('Please input the amount of LOT to be switched.');
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

  if (approveResult.error) {
    throw Error(approveResult.errorMessage.message || approveResult.errorMessage);
  }

  const {TransactionId} = approveResult.result || approveResult;
  MessageTxToExplore(TransactionId);
}

PersonalDraw.contextType = LotteryContext;

export default PersonalDraw;
