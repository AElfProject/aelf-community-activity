import React, { Component} from 'react';

import { Tabs, message } from 'antd';
const { TabPane } = Tabs;

import renderSwapHistory from './components/SwapHistory';
import Web3Info from './components/Web3Info';
import {getSwapPair} from '../../utils/getSwapInfo';
import {Web3Plugin} from '../../utils/Web3Plugin';

import axios from '../../service/axios';
import { GET_SWAP_HISTORY } from '../../constant/apis';

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
      swapInfo: {
        swapTargetTokenMap: {},
        swapId: '',
        controller: '',
      },
      swapPairInfo: {
        pairId: '-',
        originTokenSizeInByte: '-',
        originTokenNumericBigEndian: '-',
        targetTokenSymbol: '-',
        swapRatio: '-',
        controller: '-',
        swappedAmount: '-',
        swappedTimes: '-',
        currentRound: {
          pairId: '-',
          merkleTreeRoot: '-',
          startTime: '-',
          swappedAmount: '-',
          swappedTimes: '-',
        },
        depositAmount: '-'
      },
      swapPairInformation: {}, // swapPairInformation: {ELF: swapPairInfo, LOT: swapPairInfo, ...}
      swapHistory: [],
      web3PluginInstance: {},
      tutorial: []
    };

    this.aelf = new AElf(new AElf.providers.HttpProvider(HTTP_PROVIDER));
    this.getSwapHistory = this.getSwapHistory.bind(this);
    this.initWeb3Plugin = this.initWeb3Plugin.bind(this);
  }

  async componentDidMount() {
    getCommunityLink('swap').then(result => {
      const { data: tutorial } = result;
      this.setState({
        tutorial
      })
    });

    const {swapPairInformation} = this.state;
    getSwapPair().then(result => {
      if (result) {
        console.log('swapPairInfo: ', result);
        swapPairInformation.ELF = result;
        this.setState({
          swapPairInfo: result,
          swapPairInformation
        });
      } else {
        message.warning('Can not get the swap pair information.');
      }

    }).catch(error => {
      // console.log('swapPairInfo error: ', error);
      if (error.Error && error.Error.Message) {
        message.error(error.Error.Message);
      } else {
        message.error(error.message);
      }
    });

    this.initWeb3Plugin();
    await this.getSwapHistory();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const addressChanged = prevProps.account && prevProps.account.accountInfo
      && prevProps.account.accountInfo.address !== this.props.account.accountInfo.address;
    if (addressChanged) {
      await this.getSwapHistory();
    }
  }

  initWeb3Plugin() {
    const web3PluginInstance = new Web3Plugin();
    web3PluginInstance.install();
    this.setState({
      web3PluginInstance,
    });
  }

  async getSwapHistory() {

    const refreshTransaction = (transaction, index) => {
      let newParamForHistory = {
        origin_amount: '-',
        receiver_address: '-',
        unique_id: '-',
        merkle_path: '-',
      };

      if (transaction.Transaction && transaction.Transaction.Params) {
        const txParam = JSON.parse(transaction.Transaction.Params);
        newParamForHistory = {
          origin_amount: txParam.originAmount,
          receiver_address: txParam.receiverAddress,
          unique_id: txParam.uniqueId,
          merkle_path: txParam.merklePath,
        };
      }
      const { swapHistory }  = this.state;
      swapHistory[index] = {
        ...swapHistory[index],
        ...newParamForHistory
      };
      this.setState({
        swapHistory
      })
    };

    const getSwapTxDetail = (transactions) => {
      if (Array.isArray(transactions)) {
        transactions.forEach((transaction, index) => {
          this.aelf.chain.getTxResult(transaction.tx_id).then(txResult => {
            refreshTransaction(txResult, index);
            console.log('txResult', txResult);
          }).catch(error => {
            refreshTransaction(error, index); // failed Transactions
          });
        });
      } else {
        throw new Error('Input is not Array.');
      }
    };

    const { account } = this.props;
    const { accountInfo } = account;
    const { address } = accountInfo;

    if (!address) {
      this.setState({
        swapHistory: []
      });
      return;
    }

    try {
      const result = await axios.get(`${GET_SWAP_HISTORY}?method=swapToken&limit=30&address_from=${address}`);

      getSwapTxDetail(result.data.txs);

      this.setState({
        swapHistory: result.data.txs
      });
    } catch (e) {
      console.log('swapToken: ', e);
      message.warning('Get swap history failed.');
    }
  }

  render() {

    const {swapPairInfo, swapHistory, web3PluginInstance, tutorial} = this.state;

    const swapHistoryHTML = renderSwapHistory(swapHistory, swapPairInfo);

    return (
      <div>
        <div className='basic-blank'/>
        <Tabs defaultActiveKey="1" tabBarExtraContent={
          <TutorialList list={tutorial}/>
        }>
          <TabPane tab="Claim Token" key="1">

            <Web3Info
              swapPairInfo={swapPairInfo}
              web3PluginInstance={web3PluginInstance}
            />

            <div className='next-card-blank'/>
            {swapHistoryHTML}

          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Swap);
