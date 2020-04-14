import React from 'react';
import moment from 'moment';
import { Card, Table } from 'antd';
import { EXPLORER_URL } from '../../../constant/constant';

export default function renderDailyHistory(props) {

  const {dailyAwardHistory} = props;

  const columns = [
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
      title: 'Award Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: text => <div>{ moment.utc(text).local().format('YYYY-MM-DD HH:mm') }</div>,
    },
    {
      title: 'Round End Time',
      dataIndex: 'end_time',
      key: 'end_time',
      width: 150,
      render: text => <div>{ moment.utc(text * 1000).local().format('YYYY-MM-DD HH:mm') }</div>,
    }
  ];

  return (
    <Card
      className='hover-cursor-auto'
      hoverable
      title='History'>
      <div className='section-content swap-flex-wrap overflow-x-scroll'>
        <span>Time is local time</span>
        <Table
          dataSource={dailyAwardHistory}
          columns={columns}
          pagination={false}
          rowKey='id'
          scroll={{x: 1024}}
        />
      </div>
    </Card>
  );
}
