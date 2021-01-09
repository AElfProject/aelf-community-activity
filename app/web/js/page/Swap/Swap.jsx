import React, { Component} from 'react';

import { Tabs } from 'antd';
const { TabPane } = Tabs;

import Web3Info from './components/Web3Info';

import {Web3Plugin} from '../../utils/Web3Plugin';
import AElf from 'aelf-sdk';
import { HTTP_PROVIDER } from '../../constant/constant';

import TutorialList from '../../components/TutorialList';
import { getCommunityLink } from '../../utils/cmsUtils';

import './Swap.less';


import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as ActionsCounter from '../../actions/counter';
import * as ActionsAccount from '../../actions/account';

function mapStateToProps(state) {
  return {
    counter: state.counter.toJS(),
    account: state.account.toJS()
  }
}
function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(ActionsCounter, dispatch),
    ...bindActionCreators(ActionsAccount, dispatch)
  }
}

class Swap extends Component {
  constructor() {
    super();
    this.state = {
      web3PluginInstance: {},
      tutorial: []
    };

    this.aelf = new AElf(new AElf.providers.HttpProvider(HTTP_PROVIDER));
    this.initWeb3Plugin = this.initWeb3Plugin.bind(this);
  }

  async componentDidMount() {
    getCommunityLink('swap').then(result => {
      const { data: tutorial } = result;
      this.setState({
        tutorial
      })
    });

    this.initWeb3Plugin();
  }

  initWeb3Plugin() {
    const web3PluginInstance = new Web3Plugin();
    web3PluginInstance.install();
    this.setState({
      web3PluginInstance,
    });
  }

  render() {

    const {web3PluginInstance, tutorial} = this.state;

    return (
      <div>
        <div className='basic-blank'/>
        <Tabs defaultActiveKey="1" tabBarExtraContent={
          <TutorialList list={tutorial}/>
        }>
          <TabPane tab="Claim Token" key="1">

            <Web3Info
              web3PluginInstance={web3PluginInstance}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Swap);
