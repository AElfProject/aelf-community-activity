import React, { Component } from 'react';
import { message, Tabs } from 'antd';
const { TabPane } = Tabs;

import TokenContract from '../../utils/tokenContract';

import AwardHistory from './pages/AwardHistory';
import LotteryDraw from './pages/LotteryDraw';
import PersonalDraw from './pages/PersonalDraw';
import './Lottery.less';

import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as ActionsAccount from '../../actions/account';
import getSwapInfo from '../../utils/getSwapInfo';
import Contract from '../../utils/Contract';
import { LOTTERY } from '../../constant/constant';

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
      currentPeriodNumber: 0,
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
    this.getCurrentPeriodNumber = this.getCurrentPeriodNumber.bind(this);
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
    this.getCurrentPeriodNumber();
  }

  async getCurrentPeriodNumber() {
    const aelfContract = new Contract();
    const lotteryContractInstance = await aelfContract.getContractInstance(LOTTERY.CONTRACT_ADDRESS);
    const periodNumber = await lotteryContractInstance.GetCurrentPeriodNumber.call();
    this.setState({
      currentPeriodNumber: periodNumber.value
    });
  }


  render() {

    const { account } = this.props;
    const {accountInfo} = account;
    const {address} = accountInfo;

    const {swapInfo, currentPeriodNumber} = this.state;

    return (
      <div>
        <div className='basic-blank'/>
        <div className='basic-container lottery-container'>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Lottery Draw" key="1">
              <LotteryDraw
                swapInfo={swapInfo}
                currentPeriodNumber={currentPeriodNumber}
              />
              <div className='basic-blank'/>
              <PersonalDraw
                address={address}
                currentPeriodNumber={currentPeriodNumber}
              />
            </TabPane>
            <TabPane tab="Lottery Award" key="2">
              <AwardHistory
                currentPeriodNumber={currentPeriodNumber}
                address={address}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lottery);
