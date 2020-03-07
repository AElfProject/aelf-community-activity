import React from 'react';
import moment from 'moment';

export default function renderCurrentSwapInfo(swapInfo) {
  const keys = Object.keys(swapInfo);
  const swapPairsHTML = keys.map(key => {

    if (key === 'startTime' && swapInfo[key].seconds) {
      const format = 'YYYY-MM-DD HH:mm:ss';
      swapInfo[key] = moment(new Date(swapInfo[key].seconds * 1000)).format(format);
    }
    const valueShow = typeof swapInfo[key] === 'object' ? JSON.stringify(swapInfo[key]): '' + swapInfo[key];

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
        Information of the current round
      </div>
      <div className='section-content swap-flex-wrap'>
        {swapPairsHTML}
      </div>
    </section>
  );
}
