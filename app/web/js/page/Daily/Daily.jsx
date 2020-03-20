import React, { Component} from 'react';

import { Tabs } from 'antd';
const { TabPane } = Tabs;

import axios from '../../service/axios';
import { GET_COUNTDOWN } from '../../constant/apis';

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
    };
  }

  async componentDidMount() {
  }

  render() {

    const { account } = this.props;
    // const { countdown } = this.state;

    const {accountInfo} = account;
    const {address} = accountInfo;

    return (
      <div>
        <div className='basic-blank'/>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Daily Missions" key="1">
            <DailyMissions/>
          </TabPane>
          <TabPane tab="Award History" key="2">
            <DailyHistory address={address}/>
          </TabPane>
        </Tabs>
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

export default connect(mapStateToProps, mapDispatchToProps)(Daily);
