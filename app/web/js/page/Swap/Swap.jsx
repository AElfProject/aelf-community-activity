import React, { Component} from 'react';

import { Card, message, Tabs } from 'antd';
const { TabPane } = Tabs;

import renderSwapInfo from './components/SwapInfo';
import renderSwapPairInfo from './components/SwapPairInfo';
import renderCurrentSwapInfo from './components/CurrentSwapInfo';
import renderSwapElf from './components/SwapElf';
import renderSwapHistory from './components/SwapHistory';
import Web3Info from './components/Web3Info';

import {getSwapPair, getSwapInfo} from '../../utils/getSwapInfo';
import {Web3Plugin} from '../../utils/Web3Plugin';

import axios from '../../service/axios';
import { GET_SWAP_HISTORY } from '../../constant/apis';

import AElf from 'aelf-sdk';
import { HTTP_PROVIDER, SWAP_PAIR } from '../../constant/constant';

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
    this.renderSwapPairTokens = this.renderSwapPairTokens.bind(this);
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

    // getSwapPair('LOT').then(result => {
    //   if (result) {
    //     console.log('swapPairInfo LOT: ', result);
    //     swapPairInformation.LOT = result;
    //     this.setState({
    //       swapPairInfo: result,
    //       swapPairInformation
    //     });
    //   } else {
    //     message.warning('Can not get the swap pair information.');
    //   }
    //
    // }).catch(error => {
    //   // console.log('swapPairInfo error: ', error);
    //   if (error.Error && error.Error.Message) {
    //     message.error(error.Error.Message);
    //   } else {
    //     message.error(error.message);
    //   }
    // });

    getSwapInfo().then(result => {
      if (result) {
        console.log('getSwapInfo: ', result);
        this.setState({
          swapInfo: result,
        });
      } else {
        message.warning('Can not get the swap information.');
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
    // if web3PluginInstance === null wait
    // if === 'undefined', warning.
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
      message.warning('Get swap history failed.');
    }
  }

  renderSwapPairTokens() {
    const {swapPairInformation} = this.state;

    const reducer = (accumulator, currentValue) => {
      if (Array.isArray(accumulator)) {
        const currentValueHTML = renderSwapPairInfo(JSON.parse(JSON.stringify(swapPairInformation[currentValue])));
        accumulator.push(<div className='basic-blank'/>);
        accumulator.push(currentValueHTML);
        return accumulator;
      } else {
        const accumulatorHTML = renderSwapPairInfo(JSON.parse(JSON.stringify(swapPairInformation[accumulator])));
        const currentValueHTML = renderSwapPairInfo(JSON.parse(JSON.stringify(swapPairInformation[currentValue])));
        return [accumulatorHTML, <div className='next-card-blank' key={accumulator + currentValue}/>, currentValueHTML];
      }
    };
    const pairKeys = Object.keys(swapPairInformation);
    if (pairKeys.length > 1) {
      return pairKeys.reduce(reducer);
    } else if (pairKeys.length === 1) {
      return renderSwapPairInfo(JSON.parse(JSON.stringify(swapPairInformation[pairKeys[0]])));
    }
    return null;
    // return Object.keys(swapPairInformation).map(key => {
    //   return renderSwapPairInfo(JSON.parse(JSON.stringify(swapPairInformation[key])));
    // });
  }

  render() {

    const {swapInfo, swapPairInfo, swapHistory, web3PluginInstance, tutorial} = this.state;
    // const { account } = this.props;

    const swapInfoHTML = renderSwapInfo(JSON.parse(JSON.stringify(swapInfo)));
    const swapPairTokensHTML = this.renderSwapPairTokens();
    // const currentSwapInfoHTML = renderCurrentSwapInfo(JSON.parse(JSON.stringify(swapPairInfo.currentRound)));
    // const swapElfHTML = swapInfo.swapId === '-' ? null : renderSwapElf(JSON.parse(JSON.stringify(swapInfo)));
    // const swapElfHTML = swapInfo.swapId === '-' ? null : renderSwapElf({
    //   swapId: SWAP_PAIR
    // });
    const swapHistoryHTML = renderSwapHistory(swapHistory, swapPairInfo);

    // console.log('re render', swapPairInfo);
    return (
      <div>
        <div className='basic-blank'/>
        <Tabs defaultActiveKey="1" tabBarExtraContent={
          <TutorialList list={tutorial}/>
        }>
          <TabPane tab="Token Swap" key="1">

            <Web3Info
              swapPairInfo={swapPairInfo}
              web3PluginInstance={web3PluginInstance}
            />

            {/*<div className='next-card-blank'/>*/}
            {/*{swapElfHTML}*/}

            <div className='next-card-blank'/>
            {swapHistoryHTML}

            <div className='next-card-blank'/>
          </TabPane>
          <TabPane tab="Swap Information" key="2">
            <div className='basic-blank'/>
            {swapInfoHTML}

            {/*<div className='next-card-blank'/>*/}
            {/*{currentSwapInfoHTML}*/}

            <div className='next-card-blank'/>
            {swapPairTokensHTML}

            <div className='next-card-blank'/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Swap);
