import React from 'react';
import moment from 'moment';
import { Table } from 'antd';

export default function renderAwardHistory() {

  const columns = [
    {
      title: 'Random Hash',
      dataIndex: 'random_hash',
      key: 'random_hash',
      // render: text => <a>{text}</a>,
      // render: text => <a>{text}</a>,
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: 'level',
      dataIndex: 'level',
      key: 'level',
    },
  ];

  // TODO: get data from explore api
  const dataSource = [
    {
      random_hash: '3432e422aa802ff577722535097473f368868af6e84277496b80931f81a08cb5',
      owner: 'ELF_2Dyh4ASm6z7CaJ1J1WyvMPe2sJx5TMBW8CMTKeVoTMJ3ugQi3P_AELF',
      level: 1,
    },
    {
      random_hash: '3432e422aa802ff577722535097473f368868af6e84277496b80931f81a08cb5',
      owner: 'ELF_2Dyh4ASm6z7CaJ1J1WyvMPe2sJx5TMBW8CMTKeVoTMJ3ugQi3P_AELF',
      level: 2,
    },
  ];

  const format = 'YYYY-MM-DD';
  const timeFormatted = moment(new Date()).format(format);

  return (
    <section className='section-basic basic-container'>
      <div className='section-title'>
        History
      </div>
      <div className='section-content swap-flex-wrap'>
        <div className='history-period'>{timeFormatted}</div>
        <Table dataSource={dataSource} columns={columns} pagination={false} />

        <div className='history-period'>{timeFormatted}</div>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </div>
    </section>
  );
}
