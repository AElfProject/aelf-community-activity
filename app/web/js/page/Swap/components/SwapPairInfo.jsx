import React from 'react';

export default function renderSwapPairInfo(swapPair) {
  const keys = Object.keys(swapPair);
  const swapPairsHTML = keys.map(key => {
    return (
      <div className='swap-pair-container' key={key}>
        <div className='swap-pair-key'>{key}</div>
        <div className='swap-pair-value'>{swapPair[key]}</div>
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
