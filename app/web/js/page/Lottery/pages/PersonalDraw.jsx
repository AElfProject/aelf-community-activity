/* From start */
import React, { Component } from 'react';
import { InputNumber, Button, message, Card } from 'antd';

import {NightElfCheck} from '../../../utils/NightElf/NightElf';
import addressFormat from '../../../utils/addressFormat';
import {
  LOGIN_INFO,
  LOTTERY,
  TOKEN_CONTRACT_ADDRESS,
  TOKEN_DECIMAL,
  HTTP_PROVIDER
} from '../../../constant/constant';
import TokenContract from '../../../utils/tokenContract';
import MessageTxToExplore from '../../../components/Message/TxToExplore';
import { checkTimeAvailable, getAvailableTime } from '../../../utils/cmsUtils';
import { sleep } from '../../../utils/utils';

import { LotteryCodeContainer } from '../pages/AllLotteryCodes';

import {LotteryContext} from '../context/lotteryContext';
import moment from 'moment';
import AElf from 'aelf-sdk';

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
  }

  async componentDidMount() {
    getAvailableTime().then(res => {
      const { data } = res;
      const switchCodeDate = data.find(item => item.type === 'lotterySwitchCode') || {};
      this.setState({
        switchCodeDate,
      });
    });
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
        const {dispatch} = this.context;
        dispatch({
          type: 'refresh',
          value: new Date().getTime()
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
        value: new Date().getTime()
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
    const boughtLotteryCountInOnePeriod = stateContext.boughtLotteryCountInOnePeriod;

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
                max={Math.min(
                  Math.floor(
                    Math.min(tokenAllowanceActual, tokenBalanceActual)/LOTTERY.RATIO
                  ),
                  Math.min(LOTTERY.MAX_BUY, 1000 - boughtLotteryCountInOnePeriod)
                )}
                defaultValue={1}
                onChange={this.onExchangeNumberChange} />
              &nbsp;&nbsp;&nbsp;
              <Button
                loading={buyoutLoading}
                disabled={switchDisabled || buyoutLoading}
                type="primary" onClick={() => this.onBuyClick()}>Switch</Button>
            </div>
            <div className="text-grey">
              <div>At most 50 Lottery Code can be swapped for each switch. The total number of available lottery codes in a period is limited to 1000.
              </div>
              <div>The Lucky Draw Function will be closed after {switchCodeDate.end ? moment(switchCodeDate.end).format('YYYY-MM-DD HH:mm') : '-'}. Please switch it in time to avoid loss.</div>
            </div>
          </div>

          <div className='basic-blank'/>
          <div className='personal-title'>All Lottery Numbers (You can take award in Draw History Tab)</div>
          <div className='basic-line'/>
          <div className='basic-blank'/>
          <LotteryCodeContainer
            currentPeriod={currentPeriodNumber}
            aelfAddress={address}
          />
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
