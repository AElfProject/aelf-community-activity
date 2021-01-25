import { EXPLORER_URL, HTTP_PROVIDER } from '../../constant/constant';
import { message } from 'antd';
import React from 'react';
import { sleep } from '../../utils/utils';
import AElf from 'aelf-sdk';

const aelf = new AElf(new AElf.providers.HttpProvider(HTTP_PROVIDER));

async function getTxResult(TransactionId, reGetCount = 0) {
  const txResult = await aelf.chain.getTxResult(TransactionId);

  if (!txResult) {
    throw Error('Can not get transaction result.');
  }

  if (txResult.Status.toLowerCase() === 'pending') {
    if (reGetCount > 10) {
      return TransactionId;
    }
    await sleep(1000);
    reGetCount++;
    return getTxResult(TransactionId, reGetCount);
  }

  if (txResult.Status.toLowerCase() === 'mined') {
    return TransactionId;
  }

  throw Error(txResult.Error || 'Transaction error');
}

function messageHTML (txId, type = 'success', moreMessage = '') {
  const explorerHref = `${EXPLORER_URL}/tx/${txId}`;
  const txIdHTML = <div>
    <div>Transaction ID: {txId}</div>
    {moreMessage && <div>{moreMessage}</div>}
    <a target='_blank' href={explorerHref}>Turn to aelf explorer to get the information of this transaction</a>
  </div>;
  message[type](txIdHTML, 10);
}

export default async function MessageTxToExplore (txId, type = 'success') {
  try {
    const validTxId = await getTxResult(txId);
    messageHTML(validTxId, type);
  } catch(e) {
    if (e.TransactionId) {
      messageHTML(txId, 'error', e.Error || 'Transaction error.');
    } else {
      messageHTML(txId, 'error', e.message || 'Transaction error.');
    }
  }
}
