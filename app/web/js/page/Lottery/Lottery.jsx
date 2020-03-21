import React, { Component } from 'react';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

import TokenContract from '../../utils/tokenContract';

import renderLotteryAward from './pages/LotteryAward';
import renderAwardHistory from './pages/AwardHistory';
import renderLotteryDraw from './pages/LotteryDraw';
import renderPersonalDraw from './pages/PersonalDraw';
import PersonalDraw from './pages/PersonalDraw';
import './Lottery.less';

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

class Lottery extends Component {
  constructor() {
    super();
    this.state = {
      voteBalance: 0
    };
    this.tokenContract = new TokenContract();
    this.getVoteToken = this.getVoteToken.bind(this);
  }

  async componentDidMount() {
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const addressChanged = prevProps.account && prevProps.account.accountInfo
      && prevProps.account.accountInfo.address !== this.props.account.accountInfo.address;
    if (addressChanged) {
      await this.getVoteToken();
    }
  }

  async getVoteToken() {
    const { account } = this.props;

    const {accountInfo} = account;
    const {address} = accountInfo;

    let voteBalance = 0;
    if (address) {
      const tokenContractInstance = await this.tokenContract.getTokenContractInstance();
      const balance = await tokenContractInstance.GetBalance.call({
        symbol: 'VOTE',
        owner: address
      });
      voteBalance = balance.balance;
    }
    this.setState({
      voteBalance
    });
  }

  render() {

    const { account } = this.props;
    const { voteBalance } = this.state;
    //
    const {accountInfo} = account;
    const {address} = accountInfo;

    const lotteryDrawHTML = renderLotteryDraw();
    // const personalDrawHTML = renderPersonalDraw();
    const lotteryAwardHTML = renderLotteryAward();
    const awardHistoryHTML = renderAwardHistory();

    return (
      <div>
        <div className='basic-blank'/>
        <div className='basic-container lottery-container'>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Lottery Draw" key="1">
              {lotteryDrawHTML}
              <div className='basic-blank'/>
              {/*{personalDrawHTML}*/}
              <PersonalDraw
                voteBalance={voteBalance}
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
