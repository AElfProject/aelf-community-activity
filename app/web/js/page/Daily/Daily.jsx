import React, { Component} from 'react';

import { Tabs } from 'antd';
const { TabPane } = Tabs;

import axios from '../../service/axios';
import { GET_AWARD_HISTORY } from '../../constant/apis';

import DailyMissions  from './components/DailyMissions';
import DailyHistory  from './components/DailyHistory';

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
      dailyAwardHistory: []
    };
    this.getDailyAwardHistory = this.getDailyAwardHistory.bind(this);
  }

  async componentDidMount() {
    this.getDailyAwardHistory();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const addressChanged = prevProps.account && prevProps.account.accountInfo
      && prevProps.account.accountInfo.address !== this.props.account.accountInfo.address;
    if (addressChanged) {
      await this.getDailyAwardHistory();
    }
  }

  async getDailyAwardHistory() {
    const { account } = this.props;
    const {accountInfo} = account;
    const {address} = accountInfo;

    if (!address) {
      return;
    }
    const result = await axios.get(`${GET_AWARD_HISTORY}?address=${address}&limit=100`);

    this.setState({
      dailyAwardHistory: result.data
    });
  }

  render() {

    const { account } = this.props;
    const { dailyAwardHistory } = this.state;

    const {accountInfo} = account;
    const {address} = accountInfo;

    return (
      <div>
        <div className='basic-blank'/>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Daily Tasks" key="1">
            <DailyMissions dailyAwardHistory={dailyAwardHistory} getDailyAwardHistory={this.getDailyAwardHistory}/>
          </TabPane>
          <TabPane tab="Award History" key="2">
            <DailyHistory address={address} dailyAwardHistory={dailyAwardHistory}/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Daily);
