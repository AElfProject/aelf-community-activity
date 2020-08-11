import React, { Component } from 'react';
import { message, Tabs } from 'antd';
const { TabPane } = Tabs;

import TokenContract from '../../utils/tokenContract';

import AwardHistory from './pages/AwardHistory';
import LotteryDraw from './pages/LotteryDraw';
import GrandPrize from './pages/GrandPrize';
import PersonalDraw from './pages/PersonalDraw';
import './Lottery.less';

import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as ActionsAccount from '../../actions/account';
import {getSwapPair} from '../../utils/getSwapInfo';
import Contract from '../../utils/Contract';
import { LOTTERY } from '../../constant/constant';
import axios from '../../service/axios';
import { GET_CMS_PRIZE_LIST } from '../../constant/apis';

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
      prizeInfo: [{
        prizeList: {
          list: []
        },
        start: 0,
        next: 0,
        grandPrize: false,
        grandPrizeAmount: 0
      }],
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
    this.getSwapPair();
    this.getCurrentPeriodNumber();
    this.getPrizeList();
  }

  async getPrizeList() {
    const prizeInfo = (await axios.get(`${GET_CMS_PRIZE_LIST}`)).data;
    console.log('prizeList: ', prizeInfo);
    this.setState({
      prizeInfo
    })
  }

  async getSwapPair() {
    try {
      const swapInfo = await getSwapPair();
      console.log('swapInfo: ', swapInfo);
      if (swapInfo) {
        this.setState({
          swapInfo,
        });
      } else {
        message.warning('Can not get the swap information.');
      }
    } catch(error) {
        message.error(error.Error && error.Error.Message ? error.Error.Message : error.message);
    }
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

    const {swapInfo, currentPeriodNumber, prizeInfo} = this.state;
    const { grandPrize, grandPrizeAmount } = prizeInfo[0];

    return (
      <div>
        <div className='basic-blank'/>
        <div className='basic-container lottery-container'>
          <Tabs defaultActiveKey="1" tabBarExtraContent={<a href='#' target='_blank'>Lottery Tutorial</a>}>
            <TabPane tab="Lottery Draw" key="1">
              <LotteryDraw
                prizeInfo={prizeInfo}
                swapInfo={swapInfo}
                currentPeriodNumber={currentPeriodNumber}
              />
              {grandPrize && <div className='next-card-blank'/>}
              {grandPrize && <GrandPrize grandPrizeAmount={grandPrizeAmount}/>}
              <div className='next-card-blank'/>
              <PersonalDraw
                address={address}
                currentPeriodNumber={currentPeriodNumber}
              />
              <div className='next-card-blank'/>
            </TabPane>
            <TabPane tab="Draw History" key="2">
              <AwardHistory
                currentPeriodNumber={currentPeriodNumber}
                address={address}
              />
              <div className='next-card-blank'/>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lottery);
