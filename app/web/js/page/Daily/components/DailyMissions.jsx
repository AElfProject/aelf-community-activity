import React, { Component} from 'react';
import moment from 'moment';

import axios from '../../../service/axios';
import { GET_AWARD, GET_COUNTDOWN, GET_EFFECTIVE_TX } from '../../../constant/apis';

import CountDown from '../../../components/Countdown/Countdown';

import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as ActionsAccount from '../../../actions/account';
import { Button, Card, message } from 'antd';
import { EXPLORER_URL, WALLET_WEB_URL, WALLET_IOS_URL, WALLET_ANDROID_URL } from '../../../constant/constant';
import addressFormat from '../../../utils/addressFormat';
import { add } from '../../../actions/counter';

function mapStateToProps(state) {
  return {
    account: state.account.toJS()
  }
}
function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(ActionsAccount, dispatch)
  }
}

class DailyMissions extends Component {
  constructor() {
    super();
    this.state = {
      countdown: 0,
      effectiveTokenTx: [],
      effectiveResourceTx: []
    };
    this.getCountdown = this.getCountdown.bind(this);
    this.hasAward = this.hasAward.bind(this);
    this.getAward = this.getAward.bind(this);
    this.onGetAward = this.onGetAward.bind(this);
    this.renderMission = this.renderMission.bind(this);
    this.getEffectiveTxs = this.getEffectiveTxs.bind(this);
  }

  async componentDidMount() {
    this.getCountdown();
    this.getEffectiveTxs();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const addressChanged = prevProps.account && prevProps.account.accountInfo
      && prevProps.account.accountInfo.address !== this.props.account.accountInfo.address;
    if (addressChanged) {
      this.getEffectiveTxs();
    }
  }

  hasAward(type) {
    const { dailyAwardHistory } = this.props;
    const firstTx = dailyAwardHistory[0] || {};
    const secondTx = dailyAwardHistory[1] || {};
    const typeArray = [firstTx.type, secondTx.type];
    // check type
    const index = typeArray.indexOf(type);
    if (index < 0) {
      return false;
    }
    // check Time
    const transaction = dailyAwardHistory[index] || {
      end_time: 0
    };

    return moment.utc()
      .startOf('day')
      .unix() <= transaction.end_time;
  }

  async getCountdown(countdown) {

    const result = await axios.get(GET_COUNTDOWN);
    countdown = result.data;

    this.setState({
      countdown
    });
  }

  async getEffectiveTxs() {
    const { account } = this.props;
    const {accountInfo} = account;
    const {address} = accountInfo;

    if (!address) {
      this.setState({
        effectiveTokenTx: []
      });
      return;
    }

    const effectiveTokenTx = await axios.get(`${GET_EFFECTIVE_TX}?address=${address}&type=token`);
    const effectiveResourceTx = await axios.get(`${GET_EFFECTIVE_TX}?address=${address}&type=resource`);

    if (effectiveTokenTx.data.length) {
      this.setState({
        effectiveTokenTx: effectiveTokenTx.data
      });
    }

    if (effectiveResourceTx.data.length) {
      this.setState({
        effectiveResourceTx: effectiveResourceTx.data
      });
    }
  }

  async getAward(txId, type) {
    if (!txId) {
      message.warning('There are no valid transactions.');
      return;
    }
    const {address} = this.props.account.accountInfo;

    const awardId = await axios.get(`${GET_AWARD}`, {
      params: {
        address,
        tx_id: txId,
        type
      }
    });

    const {TransactionId} = awardId.data;

    const explorerHref = `${EXPLORER_URL}/tx/${TransactionId}`;
    const txIdHTML = <div>
      <span>Award ID: {TransactionId}</span>
      <br/>
      <a target='_blank' href={explorerHref}>Turn to aelf explorer to get the information of this transaction</a>
    </div>;

    message.success(txIdHTML);
    setTimeout(() => {
      this.props.getDailyAwardHistory();
    });
  }

  async onGetAward(txId, type) {
    try {
      await this.getAward(txId, type);
    } catch {
      // do nothing
      // console.log('onGetAward', e);
    }
  }

  renderMission (effectiveTx, type) {
    const effectiveTxId = effectiveTx.length ? effectiveTx[0].tx_id : null;
    const hasAward = this.hasAward(type);
    const awardedButton =  <Button type="primary" disabled>Had awarded</Button>;
    const awardButton = <Button type="primary" onClick={() => this.onGetAward(effectiveTxId, type)}>Collect</Button>;
    const buttonShow = hasAward ? awardedButton : awardButton;
    return (
      <div>
        {effectiveTx.length
          ? <div>Effective transaction ID:&nbsp;&nbsp;&nbsp;
              <a target='_blank'
                 href={`${EXPLORER_URL}/tx/${effectiveTxId}`}>
                {effectiveTxId}
              </a>
            </div>
          : <div>If you have completed the task, you can click 'collect' to receive your test token reward.</div>}
        {buttonShow}
      </div>
    );
  }

  render() {

    const { account, dailyAwardHistory } = this.props;
    const { effectiveTokenTx, effectiveResourceTx, countdown } = this.state;

    const {accountInfo} = account;
    const {address} = accountInfo;

    // console.log('dailyAwardHistory: ', dailyAwardHistory);
    return (
      <div>
        <p>During the event, you can get test tokens by completing daily tasks. </p>
        <Card
          className='hover-cursor-auto'
          hoverable
          title={[
              <span key='1'>Countdown (UTC +0 23:59:59)：</span>,
              <CountDown key='2' countdown={countdown} />
            ]}>
          <div className='section-title'>
            Current Address: {address ? addressFormat(address) : 'Please login'}
          </div>
        </Card>

        <div className='next-card-blank'/>
        <Card
          className='hover-cursor-auto'
          hoverable
          title='Task 1 Resource'>
          <div className='section-content'>
            <div>
              During the event, you can collect 100 ELF test tokens each day through the resource token trading function.
            </div>
            <a href={EXPLORER_URL + '/resource'} target='_blank'>Turn to aelf explorer</a>
            {this.renderMission(effectiveResourceTx, 'resource')}
          </div>
        </Card>

        <div className='next-card-blank'/>
        <Card
          className='hover-cursor-auto'
          hoverable
          title='Task 2 Token'>
          <div className='section-content swap-flex-wrap'>
            <div>Rule：During the event, you can collect 100 ELF test tokens each day by transferring tokens. </div>
            <div>
              <a href={WALLET_WEB_URL} target='_blank'>Web wallet, </a>
              <a href={WALLET_ANDROID_URL} target='_blank'>Android wallet, </a>
              <a href={WALLET_IOS_URL} target='_blank'>iOS wallet</a>
            </div>

            {this.renderMission(effectiveTokenTx, 'token')}
          </div>
        </Card>

        <div className='next-card-blank'/>
        <div>Users who participate in the following two tasks need to register with the aelf community staff.</div>
        <div>Contact information： WeChat: a439714 (big fish) Telegram：Doris Guo (@dorisYG)</div>
        <div className='next-card-blank'/>
        <Card
          className='hover-cursor-auto'
          hoverable
          title='Task 3 Bug Bounty'>
          <div className='section-content swap-flex-wrap'>
            <div>Complete a bug submission on the aelf chain to collect test token rewards:</div>
            <div>Reward Range: 1,000-5,000 Test Tokens,</div>
            <div>Bug Bonus Levels: Minor = 1,000 test tokens, Major = 3,000 test tokens, Critical = 5,000 test tokens.</div>
          </div>
        </Card>
        <div className='next-card-blank'/>

        <Card
          className='hover-cursor-auto'
          hoverable
          title='Task 4 DApp Develop'>
          <div className='section-content swap-flex-wrap'>
            <div>Develop a DApp on the aelf Enterprise Blockchain and collect a large reward: 20,000 test tokens for each DAPP.</div>
          </div>
        </Card>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DailyMissions);
