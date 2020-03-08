import React from 'react';
import moment from 'moment';
import {EXPLORER_URL} from '../../../constant/constant';

export default function renderSwapHistory() {

  const columns = [
    {
      title: 'Tx ID',
      dataIndex: 'tx_id',
      key: 'tx_id',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Pair ID',
      dataIndex: 'pair_id',
      key: 'paid_id',
    },
    {
      title: 'Origin Amount',
      dataIndex: 'origin_amount',
      key: 'origin_amount',
    },
    {
      title: 'Merkle Path',
      dataIndex: 'merkle_path',
      key: 'merkle_path',
    },
    {
      title: 'Receiver Address',
      dataIndex: 'receiver_address',
      key: 'receiver_address',
    },
    {
      title: 'Unique_ID',
      dataIndex: 'unique_id',
      key: 'unique_id',
    },
  ];

  // TODO: get data from explore api
  const data = [
    {
      tx_id: '3432e422aa802ff577722535097473f368868af6e84277496b80931f81a08cb5',
      pair_id: '3432e422aa802ff577722535097473f368868af6e84277496b80931f81a08cb5',
      origin_amount: '5000000000',
      merkle_path: '00000000000000000012312jkalfjalasjldfjkslf',
      receiver_address: 'ELF_2Dyh4ASm6z7CaJ1J1WyvMPe2sJx5TMBW8CMTKeVoTMJ3ugQi3P_AELF',
      unique_id: '3432e422aa802ff577722535097473f368868af6e84277496b80931f81a08cb5',
    },
    {
      tx_id: '3432e422aa802ff577722535097473f368868af6e84277496b80931f81a08cb51',
      pair_id: '3432e422aa802ff577722535097473f368868af6e84277496b80931f81a08cb5',
      origin_amount: '5000000000',
      merkle_path: '00000000000000000012312jkalfjalasjldfjkslf',
      receiver_address: 'ELF_2Dyh4ASm6z7CaJ1J1WyvMPe2sJx5TMBW8CMTKeVoTMJ3ugQi3P_AELF',
      unique_id: '3432e422aa802ff577722535097473f368868af6e84277496b80931f81a08cb5',
    },
  ];

  const swapListHTML = data.map(tx => {

    let keys = Object.keys(tx);
    keys = keys.slice(3);

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
        History of this Address (last 100 txs)
      </div>
      <div className='section-content swap-flex-wrap'>
        {swapListHTML}
      </div>
    </section>
  );
}
