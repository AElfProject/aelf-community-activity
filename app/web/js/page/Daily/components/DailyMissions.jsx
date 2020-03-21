import React, { Component} from 'react';

import axios from '../../../service/axios';
import { GET_COUNTDOWN, GET_EFFECTIVE_TX } from '../../../constant/apis';

import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as ActionsAccount from '../../../actions/account';
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
      countdown: '-',
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

  componentWillUnmount() {
    this.getCountDown = () => {};
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const addressChanged = prevProps.account && prevProps.account.accountInfo
      && prevProps.account.accountInfo.address !== this.props.account.accountInfo.address;
    if (addressChanged) {
      this.getEffectiveTxs();
    }
  }

  async getCountDown(countdown) {
    if (countdown && countdown >= 0) {
      countdown--;
    } else {
      const result = await axios.get(GET_COUNTDOWN);
      countdown = result.data;
    }

    const countDownArray = getHoursMinutesSeconds(countdown);

    const countdownString = countDownArray.join(' : ');

    this.setState({
      countdown: countdownString
    });
    setTimeout(() => {
      this.getCountDown(countdown)
    }, 1000);
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

    const { account } = this.props;
    const { countdown, effectiveTokenTx, effectiveResourceTx } = this.state;

    const {accountInfo} = account;
    const {address} = accountInfo;

    console.log();
    return (
      <div>
        <section className='section-basic basic-container'>
          <div className='section-title'>
            Countdown of this round of activities：{countdown}
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
            {effectiveResourceTx.length ? <div>Effective transaction {effectiveResourceTx[0].tx_id}</div>  : null}
          </div>
        </section>
        <div className='basic-blank'/>
        <section className='section-basic basic-container'>
          <div className='section-title'>
            Mission 2 Token
          </div>
          <div className='section-content swap-flex-wrap'>
            <div>Rule：During the activity, transfer token can receive 100 Elf.</div>
            {effectiveTokenTx.length ? <div>Effective transaction {effectiveTokenTx[0].tx_id}</div> : null}
          </div>
        </section>
      </div>
    );
  }
}

function getHoursMinutesSeconds(countdown) {
  const hours = Math.floor(countdown / 3600);
  const minutes = Math.floor(countdown % 3600 / 60);
  const seconds = countdown % 60;

  return [hours, minutes, seconds].map(item => {
    if (item < 10) {
      return '0' + item;
    }
    return item;
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(DailyMissions);
