import React from 'react';
import { Card } from 'antd';
import addressFormat from '../../../utils/addressFormat';

export default function renderSwapInfo(swapInfo) {
  const keys = Object.keys(swapInfo);
  const showList = ['swapTargetTokenMap', 'swapId', 'controller'];
  const swapInfoHTML = keys.map(key => {
    if (!showList.includes(key)) {
      return;
    }

    if (key === 'controller') {
      swapInfo[key] = addressFormat(swapInfo[key]);
    }

    let valueShow = typeof swapInfo[key] === 'object' ? JSON.stringify(swapInfo[key]): '' + swapInfo[key];

    if (key === 'swapTargetTokenMap') {
      const targetTokenKeys = Object.keys(swapInfo[key]);
      const length = targetTokenKeys.length || '';
      valueShow = length && targetTokenKeys.join(', ') + ` (You will get these ${length} token after your operation.)`;
    }
    return (
      <div className='swap-pair-container' key={key}>
        <div className='swap-pair-key'>{key}</div>
        <div className='swap-pair-value'>{valueShow}</div>
      </div>
    );
  });

  return (
    <Card
      hoverable
      title='Information of Swap'>
      <div className='section-content swap-flex-wrap'>
        {swapInfoHTML}
      </div>
    </Card>
  );
}
