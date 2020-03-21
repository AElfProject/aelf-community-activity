import React from 'react';
import moment from 'moment';
import { Table } from 'antd';
import { EXPLORER_URL } from '../../../constant/constant';

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
      title: 'Tx Id',
      dataIndex: 'tx_id',
      key: 'tx_id',
      width: 350,
      render: text => <a target='_blank' href={`${EXPLORER_URL}/tx/${text}`}>{text}</a>
    },
    {
      title: 'Award Id',
      dataIndex: 'award_id',
      key: 'award_id',
      width: 350,
      render: text => <a target='_blank' href={`${EXPLORER_URL}/tx/${text}`}>{text}</a>
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
        <Table
          dataSource={dailyAwardHistory}
          columns={columns}
          pagination={false}
          rowKey='id'
          scroll={{x: 1024}}
        />
      </div>
    </section>
  );
}
