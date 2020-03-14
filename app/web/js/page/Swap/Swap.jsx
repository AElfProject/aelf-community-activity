import React, { Component} from 'react';

import {message} from 'antd';

import renderSwapPairInfo from './components/SwapPairInfo';
import renderCurrentSwapInfo from './components/CurrentSwapInfo';
import renderSwapElf from './components/SwapElf';
import renderSwapHistory from './components/SwapHistory';

import getSwapInfo from '../../utils/getSwapInfo';

import axios from '../../service/axios';

import AElf from 'aelf-sdk';
import {HTTP_PROVIDER} from '../../constant/constant';

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
      swapHistory: []
    };

    this.aelf = new AElf(new AElf.providers.HttpProvider(HTTP_PROVIDER));
    this.getSwapHistory = this.getSwapHistory.bind(this);
  }

  async componentDidMount() {
    getSwapInfo().then(result => {
      // console.log('swapInfo: ', result);
      this.setState({
          swapInfo: result,
      });
    }).catch(error => {
      message.error(error.message);
      // console.log('swapInfo error: ', error);
    });

    await this.getSwapHistory();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    const addressChanged = prevProps.account && prevProps.account.accountInfo
    && prevProps.account.accountInfo.address !== this.props.account.accountInfo.address;
    if (addressChanged) {
      await this.getSwapHistory();
    }
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
    }

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
      const result = await axios.get(`/api/swap/history?method=swapToken&limit=30&address_from=${address}`);

      getSwapTxDetail(result.data.txs);

      this.setState({
        swapHistory: result.data.txs
      });
    } catch (e) {
      message.warning('Get swap history failed.');
    }
  }

  render() {

    const {swapInfo, swapHistory} = this.state;
    const { account } = this.props;

    const swapPairsInfoHTML = renderSwapPairInfo(swapInfo);
    const currentSwapInfoHTML = renderCurrentSwapInfo(swapInfo.currentRound);
    const swapElfHTML = swapInfo.pairId === '-' ? null : renderSwapElf(swapInfo);
    const swapHistoryHTML = renderSwapHistory(swapHistory);

    console.log('re render', account);
    return (
      <div>
        <div className='basic-blank'/>
        <a href='/#'>Click to get the swapping tutorial</a>

        <div className='basic-blank'/>
        {swapPairsInfoHTML}

        <div className='basic-blank'/>
        {currentSwapInfoHTML}

        <div className='basic-blank'/>
        {swapElfHTML}

        <div className='basic-blank'/>
        {swapHistoryHTML}

        <div className='basic-blank'/>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Swap);
