import React from 'react';
import addressFormat from '../../../utils/addressFormat';
import { TOKEN_DECIMAL } from '../../../constant/constant'

export default function renderSwapPairInfo(swapPair) {
  const keys = Object.keys(swapPair);
  const swapPairsHTML = keys.map(key => {
    if (key === 'currentRound') {
      return;
    }

    if (key === 'swapRatio' && typeof swapPair[key] === 'object') {
      const swapRatio = swapPair[key];
      const {originShare, targetShare} = swapRatio;
      const ratio = parseInt(originShare, 10) / parseInt(targetShare, 10)
        + ' ' + JSON.stringify(swapPair[key]);
      swapPair[key] = ratio;
    }

    if (['swappedAmount', 'depositAmount'].includes(key)) {
      swapPair[key] = swapPair[key] / (10 ** TOKEN_DECIMAL);
    }

    if (key === 'controller') {
      swapPair[key] = addressFormat(swapPair[key]);
    }

    const valueShow = typeof swapPair[key] === 'object' ? JSON.stringify(swapPair[key]): '' + swapPair[key];
    return (
      <div className='swap-pair-container' key={key}>
        <div className='swap-pair-key'>{key}</div>
        <div className='swap-pair-value'>{valueShow}</div>
      </div>
    );
  });

  return (
    <section className='section-basic basic-container'>
      <div className='section-title'>
        Information of SwapPair
      </div>
      <div className='section-content swap-flex-wrap'>
        {swapPairsHTML}
      </div>
    </section>
  );
}
