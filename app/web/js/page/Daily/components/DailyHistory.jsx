import React from 'react';
import moment from 'moment';
import { Table } from 'antd';

export default function renderDailyHistory(props) {

  const {dailyAwardHistory} = props;

  const columns = [
    {
      title: 'End Time',
      dataIndex: 'end_time',
      key: 'end_time',
      render: text => <div>{ moment(text * 1000).format('YYYY-MM-DD HH:mm') }</div>,
    },
    {
      title: 'Tx id',
      dataIndex: 'tx_id',
      key: 'tx_id',
    },
    {
      title: 'type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: text => <div>{ moment(text).format('YYYY-MM-DD HH:mm:ss') }</div>,
    },
  ];

  return (
    <section className='section-basic basic-container'>
      <div className='section-title'>
        History
      </div>
      <div className='section-content swap-flex-wrap'>
        <Table dataSource={dailyAwardHistory} columns={columns} pagination={false} rowKey='id'/>
      </div>
    </section>
  );
}
