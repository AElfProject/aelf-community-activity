import React from 'react';
import { Card } from 'antd';
import moment from 'moment';
import { SelectOutlined } from '@ant-design/icons'

import './Referendum.less';

const classPrefix = 'referendum';

function ReferendumCard({ info, grandPrizeAmount }) {
  const { communityLink } = info;

  return (
    <Card
      className={`hover-cursor-auto ${classPrefix}`}
      hoverable
      extra={
        <span>Available Time: {moment(info.start).format('YYYY-MM-DD HH:mm')} - {moment(info.end).format('YYYY-MM-DD HH:mm')}</span>
      }
      title={
        (
          <div>
            Referendum
            <a
              className={`${classPrefix}-instruction-link`}
              href={communityLink['instruction'].link}
              target="_blank"
            >
              {communityLink['instruction'].name}
            </a>
          </div>
        )
      }
    >
      <div className={`${classPrefix}-content`}>
        {!!grandPrizeAmount && `The amount of grand prize will be ${grandPrizeAmount} ELF. `}
        Community users vote in a referendum to determine how the final prize will be distributed (Sharing by one person / sharing by all people). Vote for a proposal directly from one of the following:

        <div className={`${classPrefix}-proposal`}>
          <div>
            <a href={communityLink['proposal_1'].link} target="_blank">Proposal 1: {communityLink['proposal_1'].name} <SelectOutlined /></a>
            <p>Draw one lottery code at random to win the grand prize.</p>
          </div>
          <div>
            <a href={communityLink['proposal_2'].link} target="_blank">Proposal 2: {communityLink['proposal_2'].name} <SelectOutlined /></a>
            <p>Share out the Grand prize equally according to your holding of the Lottery Code Accounting Weight.</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ReferendumCard;
