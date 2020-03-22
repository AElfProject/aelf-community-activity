import { EXPLORER_URL } from '../../constant/constant';
import { message } from 'antd';
import React from 'react';

export default function MessageTxToExplore (txId, type = 'success') {
  const explorerHref = `${EXPLORER_URL}/tx/${txId}`;
  const txIdHTML = <div>
    <span>Transaction ID: {txId}</span>
    <br/>
    <a target='_blank' href={explorerHref}>Turn to aelf explorer to get the information of this transaction</a>
  </div>;
  message[type](txIdHTML, 16);
}
