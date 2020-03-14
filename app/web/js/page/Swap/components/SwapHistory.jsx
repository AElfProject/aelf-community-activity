import React from 'react';
import moment from 'moment';
import {EXPLORER_URL} from '../../../constant/constant';
import { Button } from 'antd';

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

  const keys = ['merkle_path', 'receiver_address', 'unique_id', 'tx_status'];

  const swapListHTML = historyList.map(tx => {

    const valueHTML = keys.map(key => {
      return (
        <div className='swap-tx-list-container' key={key}>
          <div className='swap-tx-key'><b>{key}</b></div>
          <div className='swap-tx-value'>{tx[key]}</div>
        </div>
      );
    });

    const format = 'YYYY-MM-DD HH:mm:ss';
    const timeFormatted = moment(new Date()).format(format);

    return (
      <div key={tx.tx_id} className='swap-tx-container'>
        <div className='swap-tx-title'>
          <div><b>Tx ID: </b>
            <a href={`${EXPLORER_URL}/tx/${tx.tx_id}`} target='_blank'>{tx.tx_id}</a>
            &nbsp;&nbsp;&nbsp; <b>Origin Amount:</b> {tx.origin_amount}
          </div>
          <div> <b>Time:</b> {timeFormatted}</div>
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
