import React, { Component} from 'react';
import moment from 'moment';

import axios from '../../../service/axios';
import { GET_AWARD, GET_COUNTDOWN, GET_EFFECTIVE_TX } from '../../../constant/apis';

import CountDown from '../../../components/Countdown/Countdown';

import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as ActionsAccount from '../../../actions/account';
import { Button, message } from 'antd';
import { EXPLORER_URL } from '../../../constant/constant';

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
    return moment()
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
      message.warning('There are no effective transaction.');
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

  renderMission (effectiveTx, type) {
    const effectiveTxId = effectiveTx.length ? effectiveTx[0].tx_id : null;
    const hasAward = this.hasAward(type);
    const awardedButton =  <Button type="primary" disabled>Had awarded</Button>;
    const awardButton = <Button type="primary" onClick={() => this.getAward(effectiveTxId, type)}>GO!</Button>;
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
          : <div>There are no effective transaction.</div>}
        {buttonShow}
      </div>
    );
  }

  render() {

    const { account, dailyAwardHistory } = this.props;
    const { effectiveTokenTx, effectiveResourceTx, countdown } = this.state;

    const {accountInfo} = account;
    const {address} = accountInfo;

    console.log('dailyAwardHistory: ', dailyAwardHistory);
    return (
      <div>
        <section className='section-basic basic-container'>
          <div className='section-title'>
            Countdown of this round of activities：<CountDown countdown={countdown} />
          </div>
          <div className='section-title'>
            Current Address: {address || 'Please login'}
          </div>
        </section>
        <div className='basic-blank'/>
        <section className='section-basic basic-container'>
          <div className='section-title'>
            Mission 1 Resource
          </div>
          <div className='section-content'>
            <div>Rule: During the activity period, you can get 100 elf for buying and selling resource token.</div>
            {this.renderMission(effectiveResourceTx, 'resource')}
          </div>
        </section>
        <div className='basic-blank'/>
        <section className='section-basic basic-container'>
          <div className='section-title'>
            Mission 2 Token
          </div>
          <div className='section-content swap-flex-wrap'>
            <div>Rule：During the activity, transfer token can receive 100 Elf.</div>
            {this.renderMission(effectiveTokenTx, 'token')}
          </div>
        </section>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DailyMissions);
