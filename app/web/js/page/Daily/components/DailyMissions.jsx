import React, { Component} from 'react';
import moment from 'moment';

import axios from '../../../service/axios';
import { GET_AWARD_HISTORY, GET_COUNTDOWN, GET_EFFECTIVE_TX } from '../../../constant/apis';

import CountDown from '../../../components/Countdown/Countdown';

import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as ActionsAccount from '../../../actions/account';

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
    this.getCountDown = this.getCountDown.bind(this);
    this.getEffectiveTxs = this.getEffectiveTxs.bind(this);
  }

  async componentDidMount() {
    this.getCountDown();
    this.getEffectiveTxs();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const addressChanged = prevProps.account && prevProps.account.accountInfo
      && prevProps.account.accountInfo.address !== this.props.account.accountInfo.address;
    if (addressChanged) {
      this.getEffectiveTxs();
    }
  }

  // hasAward() {
  //   function checkTimeIsEffective(time) {
  //     const startTime = moment().startOf('day');
  //     const timeNow =  moment();
  //     return moment(time).isBetween(startTime, timeNow);
  //   }
  // }

  async getCountDown(countdown) {

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
      return;
    }

    const effectiveTokenTx = await axios.get(`${GET_EFFECTIVE_TX}?address=${address}&type=token`);
    const effectiveResourceTx = await axios.get(`${GET_EFFECTIVE_TX}?address=${address}&type=resource`);

    console.log('effectiveResourceTx: ', effectiveTokenTx, effectiveResourceTx, address);
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
            {effectiveResourceTx.length
              ? <div>Effective transaction ID: {effectiveResourceTx[0].tx_id}</div>
              : <div>There are no effective transaction.</div>}
          </div>
        </section>
        <div className='basic-blank'/>
        <section className='section-basic basic-container'>
          <div className='section-title'>
            Mission 2 Token
          </div>
          <div className='section-content swap-flex-wrap'>
            <div>Rule：During the activity, transfer token can receive 100 Elf.</div>
            {effectiveTokenTx.length
              ? <div>Effective transaction ID: {effectiveTokenTx[0].tx_id}</div>
              : <div>There are no effective transaction.</div>}
          </div>
        </section>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DailyMissions);
