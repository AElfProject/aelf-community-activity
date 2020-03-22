import React, { Component } from 'react';
import { message, Tabs } from 'antd';
const { TabPane } = Tabs;

import TokenContract from '../../utils/tokenContract';

import renderLotteryAward from './pages/LotteryAward';
import renderAwardHistory from './pages/AwardHistory';
import LotteryDraw from './pages/LotteryDraw';
import PersonalDraw from './pages/PersonalDraw';
import './Lottery.less';

import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as ActionsAccount from '../../actions/account';
import getSwapInfo from '../../utils/getSwapInfo';

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

class Lottery extends Component {
  constructor() {
    super();
    this.state = {
      swapInfo: {
        swapRatio: {
          originShare: 1,
          targetShare: 1
        },
        currentRound: {
          swappedAmount: 0,
        }
      },
    };
    this.tokenContract = new TokenContract();
  }

  componentDidMount() {
    getSwapInfo().then(result => {
      if (result) {
        console.log('swapInfo: ', result);
        this.setState({
          swapInfo: result,
        });
      } else {
        message.warning('Can not get the swap information.');
      }
    }).catch(error => {
      message.error(error.message);
    });
  }

  render() {

    const { account } = this.props;
    const {accountInfo} = account;
    const {address} = accountInfo;

    const {swapInfo} = this.state;

    // const lotteryDrawHTML = renderLotteryDraw();
    const lotteryAwardHTML = renderLotteryAward();
    const awardHistoryHTML = renderAwardHistory();

    return (
      <div>
        <div className='basic-blank'/>
        <div className='basic-container lottery-container'>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Lottery Draw" key="1">
              <LotteryDraw swapInfo={swapInfo}/>
              <div className='basic-blank'/>
              <PersonalDraw
                address={address}
              />
            </TabPane>
            <TabPane tab="Lottery Award" key="2">
              {lotteryAwardHTML}
              <div className='basic-blank'/>
              {awardHistoryHTML}
            </TabPane>
          </Tabs>
        </div>
      </div>
    );

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lottery);
