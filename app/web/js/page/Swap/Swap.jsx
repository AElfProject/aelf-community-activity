import React, { Component} from 'react';

import {message} from 'antd';

import renderSwapPairInfo from './components/SwapPairInfo';
import renderCurrentSwapInfo from './components/CurrentSwapInfo';
import renderSwapElf from './components/SwapElf';
import renderSwapHistory from './components/SwapHistory';

import getSwapInfo from '../../utils/getSwapInfo';

import axios from '../../service/axios';

import './Swap.less';

export default class Swap extends Component {
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
  }

  async componentDidMount() {
    getSwapInfo().then(result => {
      console.log('swapInfo: ', result);
      this.setState({
          swapInfo: result,
      });
    }).catch(error => {
      message.error(error.message);
      console.log('swapInfo error: ', error);
    });

    await this.getSwapHistory();
  }

  async getSwapHistory() {
    const result = await axios.get('/api/swap/history?method=swapToken&limit=30&address_from=2RCLmZQ2291xDwSbDEJR6nLhFJcMkyfrVTq1i1YxWC4SdY49a6');
    console.log('result: ', result);
    this.setState({
      swapHistory: result.data.txs
    });
  }

  render() {

    console.log('re render');
    const {swapInfo, swapHistory} = this.state;

    const swapPairsInfoHTML = renderSwapPairInfo(swapInfo);
    const currentSwapInfoHTML = renderCurrentSwapInfo(swapInfo.currentRound);
    const swapElfHTML = swapInfo.pairId === '-' ? null : renderSwapElf(swapInfo);
    const swapHistoryHTML = renderSwapHistory(swapHistory);

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
