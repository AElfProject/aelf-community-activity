import React from 'react';

export default function renderCurrentSwapInfo(swapInfo) {
  const keys = Object.keys(swapInfo);
  const swapPairsHTML = keys.map(key => {
    return (
      <div className='swap-pair-container' key={key}>
        <div className='swap-pair-key'>{key}</div>
        <div className='swap-pair-value'>{swapInfo[key]}</div>
      </div>
    );
  });

  return (
    <section className='section-basic basic-container'>
      <div className='section-title'>
        Information of the current round
      </div>
      <div className='section-content swap-flex-wrap'>
        {swapPairsHTML}
      </div>
    </section>
  );
}
