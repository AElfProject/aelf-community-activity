import React from 'react';
import moment from 'moment';
import { Card } from 'antd';
import { TOKEN_DECIMAL } from '../../../constant/constant';

export default function renderCurrentSwapInfo(swapInfo) {
  const keys = Object.keys(swapInfo);
  const swapPairsHTML = keys.map(key => {

    if (key === 'startTime' && swapInfo[key].seconds) {
      const format = 'YYYY-MM-DD HH:mm:ss';
      swapInfo[key] = moment.utc(new Date(swapInfo[key].seconds * 1000)).local().format(format);
    }

    if (['swappedAmount', 'depositAmount'].includes(key)) {
      swapInfo[key] = swapInfo[key] / (10 ** TOKEN_DECIMAL);
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
    <Card
      className='hover-cursor-auto'
      hoverable
      title='Information of the current round'>
      <div className='section-content swap-flex-wrap'>
        {swapPairsHTML}
      </div>
    </Card>
  );
}
