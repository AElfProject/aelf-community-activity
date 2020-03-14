import React from 'react';
import moment from 'moment';
import {EXPLORER_URL} from '../../../constant/constant';
import { Button, Tag } from 'antd';

export default function renderSwapHistory(historyList) {
  // TODO: get data from explore api
  // const data = [
  //   {
  //     tx_id: '3432e422aa802ff577722535097473f368868af6e84277496b80931f81a08cb5',
  //     pair_id: '3432e422aa802ff577722535097473f368868af6e84277496b80931f81a08cb5',
  //     origin_amount: '5000000000',
  //     merkle_path: '00000000000000000012312jkalfjalasjldfjkslf',
  //     receiver_address: 'ELF_2Dyh4ASm6z7CaJ1J1WyvMPe2sJx5TMBW8CMTKeVoTMJ3ugQi3P_AELF',
  //     unique_id: '3432e422aa802ff577722535097473f368868af6e84277496b80931f81a08cb5',
  //   },
  // ];
  // console.log('historyList,', historyList);

  const keys = ['merkle_path', 'receiver_address', 'unique_id'];

  const swapListHTML = historyList.map(tx => {

    const valueHTML = keys.map(key => {
      let value = tx[key];
      if (key === 'merkle_path' && value !== '-') {
        const jsonFormatted = JSON.stringify(value, null, 4);
        value = <textarea
          rows={5}
          value={jsonFormatted}
          className='textarea-code-like-content'
          disabled>
        </textarea>
      };

      return (
        <div className='swap-tx-list-container' key={key}>
          <div className='swap-tx-key'><b>{key}</b></div>
          <div className='swap-tx-value'>{value}</div>
        </div>
      );
    });

    const format = 'YYYY-MM-DD HH:mm:ss';
    const timeFormatted = moment(new Date()).format(format);

    let txStatusHTML;
    const txStatus = tx.tx_status;
    switch (txStatus) {
      case 'Failed':
        txStatusHTML = <Tag color="red">{txStatus}</Tag>;
        break;
      case 'Pending':
        txStatusHTML = <Tag color="orange">{txStatus}</Tag>;
        break;
      case 'Mined':
        txStatusHTML = <Tag color="green">{txStatus}</Tag>;
        break;
      default:
        txStatusHTML = <Tag>{txStatus}</Tag>;
    }

    return (
      <div key={tx.tx_id} className='swap-tx-container'>
        <div className='swap-tx-title'>
          <div><b>Tx ID: </b>
            <a href={`${EXPLORER_URL}/tx/${tx.tx_id}`} target='_blank'>{tx.tx_id}</a>
          </div>
          <div> <b>Origin Amount:</b> {tx.origin_amount}</div>
          <div> <b>Time:</b> {timeFormatted}</div>
          <div> <b>Status:</b> {txStatusHTML}</div>
        </div>
        <div className='swap-tx-content'>
          {valueHTML}
        </div>
      </div>
    );
  });

  return (
    <section className='section-basic basic-container'>
      <div className='section-title'>
        History of this Address (last 30 txs) <Button size='small'>Click to refresh</Button>
      </div>
      <div className='section-content swap-flex-wrap'>
        {swapListHTML}
      </div>
    </section>
  );
}
