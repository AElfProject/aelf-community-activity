import React, { Component } from 'react';
import { Card, message, Tabs } from 'antd';
const { TabPane } = Tabs;

import TokenContract from '../../utils/tokenContract';

import AwardHistory from './pages/AwardHistory';
import LotteryDraw from './pages/LotteryDraw';
import GrandPrize from './pages/GrandPrize';
import PersonalDraw from './pages/PersonalDraw';
import Referendum from './pages/Referendum';
import './Lottery.less';

import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as ActionsAccount from '../../actions/account';
import Contract from '../../utils/Contract';
import { LOTTERY } from '../../constant/constant';
import axios from '../../service/axios';
import { GET_CMS_PRIZE_LIST } from '../../constant/apis';

import TutorialList from '../../components/TutorialList';
import { getCommunityLink, getLotteryReferendumsInfo } from '../../utils/cmsUtils';
import {RewardSharing} from './pages/RewardSharing';

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
      tutorial: [],
      referendumInfo: {
        isShow: false,
        start: '',
        end: '',
        communityLink: {
          instruction: {},
          proposal_1: {},
          proposal_2: {}
        }
      }
    };
    this.tokenContract = new TokenContract();
    this.getCurrentPeriodNumber = this.getCurrentPeriodNumber.bind(this);
  }

  componentDidMount() {
    getCommunityLink('lottery')
      .then((res) => {
        this.setState({
          tutorial: res.data
        })
      });

    getLotteryReferendumsInfo()
      .then(res => {
        if (res.data[0]) {
          this.setState({
            referendumInfo: res.data[0]
          });
        }
      });

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

    const {currentPeriodNumber, prizeInfo, tutorial, referendumInfo} = this.state;
    const { grandPrize, grandPrizeAmount } = prizeInfo[0];

    return (
      <div>
        <div className='basic-blank'/>
        <div className='basic-container lottery-container'>
          <Tabs defaultActiveKey="1" tabBarExtraContent={
            <TutorialList list={tutorial} />
          }>
            <TabPane tab="Lottery Draw" key="1">
              <LotteryDraw
                prizeInfo={prizeInfo}
              />
              {referendumInfo.isShow && <div className='next-card-blank'/>}
              {referendumInfo.isShow && <Referendum grandPrizeAmount={parseInt(grandPrizeAmount)} info={referendumInfo}/>}
              {grandPrize && <div className='next-card-blank'/>}
              {grandPrize && <GrandPrize grandPrizeAmount={grandPrizeAmount}/>}
              <div className='next-card-blank'/>

              <RewardSharing
                aelfAddress={address}
              />

              <PersonalDraw
                address={address}
                currentPeriodNumber={currentPeriodNumber}
              />
              <div className='next-card-blank'/>
            </TabPane>
            {/*<TabPane tab="Draw History" key="2">*/}
            {/*  <AwardHistory*/}
            {/*    currentPeriodNumber={currentPeriodNumber}*/}
            {/*    address={address}*/}
            {/*  />*/}
            {/*  <div className='next-card-blank'/>*/}
            {/*</TabPane>*/}
          </Tabs>
        </div>
      </div>
    );

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lottery);
