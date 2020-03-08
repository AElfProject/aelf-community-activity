import React, { Component} from 'react';

import {message} from 'antd';

import renderSwapPairInfo from './components/SwapPairInfo';
import renderCurrentSwapInfo from './components/CurrentSwapInfo';
import renderSwapElf from './components/SwapElf';
import renderSwapHistory from './components/SwapHistory';

import getSwapInfo from '../../utils/getSwapInfo';

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
      }
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
  }

  render() {

    console.log('re render');
    const {swapInfo} = this.state;

    const swapPairsInfoHTML = renderSwapPairInfo(swapInfo);
    const currentSwapInfoHTML = renderCurrentSwapInfo(swapInfo.currentRound);
    const swapElfHTML = swapInfo.pairId === '-' ? null : renderSwapElf(swapInfo);
    const swapHistoryHTML = renderSwapHistory();

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
