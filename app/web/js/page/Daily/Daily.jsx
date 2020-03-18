import React, { Component} from 'react';

import { Button, message } from 'antd';

import './Daily.less';

import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as ActionsAccount from '../../actions/account';

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

class Daily extends Component {
  constructor() {
    super();
    this.state = {
    };

  }

  async componentDidMount() {
  }

  render() {

    const { account } = this.props;

    const {accountInfo} = account;
    const {address} = accountInfo;

    console.log('Daily render', account);
    return (
      <div>
        <div className='basic-blank'/>
        <section className='section-basic basic-container'>
          <div className='section-title'>
            Countdown of this round of activities：get time from server
          </div>
          <div className='section-title'>
            Current Address: {address || 'Please login'}
          </div>
        </section>
        <div className='basic-blank'/>
        <section className='section-basic basic-container'>
          <div className='section-title'>
            1.Resource
          </div>
          <div className='section-content'>
            Rule: During the activity period, you can get 100 elf for buying and selling resource token.
          </div>
        </section>
        <div className='basic-blank'/>
        <section className='section-basic basic-container'>
          <div className='section-title'>
            2.Token
          </div>
          <div className='section-content swap-flex-wrap'>
            Rule：During the activity, transfer token can receive 100 Elf
          </div>
        </section>
        {/*<a href='/#'>Click to get the swapping tutorial</a>*/}

        {/*<div className='basic-blank'/>*/}
        {/*{swapPairsInfoHTML}*/}

        {/*<div className='basic-blank'/>*/}
        {/*{currentSwapInfoHTML}*/}

        {/*<div className='basic-blank'/>*/}
        {/*{swapElfHTML}*/}

        {/*<div className='basic-blank'/>*/}
        {/*{swapHistoryHTML}*/}

        {/*<div className='basic-blank'/>*/}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Daily);
