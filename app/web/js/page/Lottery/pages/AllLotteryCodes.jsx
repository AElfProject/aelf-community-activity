import { Select, Row, Col, Table } from 'antd';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { LOTTERY } from '../../../constant/constant';
import {useContract} from '../hooks/useContract';
import {useBoughtLotteryCountInOnePeriod} from '../hooks/useBoughtLotteryCountInOnePeriod';
import { getViewResult } from '../../../utils/NightElf/NightElf';

const { Option } = Select;
import './RewardSharing.less'

import axios from '../../../service/axios';
import { POST_DECRYPT_LIST } from '../../../constant/apis';
import { LotteryContext } from '../context/lotteryContext';
import { EXPLORER_URL } from '../../../../../../config/config.json';

const getColumns = (defaultString = '-') => {
  return [
    {
      title: 'Lottery Code',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'block',
      dataIndex: 'block',
      key: 'block',
      width: 150,
      render: block => <a href={`${EXPLORER_URL}/block/${block}`} target='_blank'>{block}</a>
    },
    {
      title: 'Reward Name (If you win)',
      dataIndex: 'rewardName',
      key: 'rewardName',
      width: 200,
      render: (value) => value || defaultString
    },
    {
      title: 'Registration Information (After Draw)',
      // dataIndex: 'registrationInformation',
      dataIndex: 'decryptInfo',
      // key: 'registrationInformation',
      key: 'decryptInfo',
      width: 300,
      render: (value) => value || defaultString
    },
  ];
};

export const AllLotteryCodes = ({
  currentPeriod,
  dataSource, historyLoading
}) => {
  return <Table
    pagination={{
      pageSize: 20,
      showSizeChanger: false
    }}
    dataSource={dataSource}
    loading={historyLoading}
    columns={getColumns(currentPeriod ? '' : '-')}
    rowKey='id'
    scroll={{x: 512}}
  />
};

async function decryptBoughtLotteries(boughtLotteriesReversed) {
  const registrationInformationList = boughtLotteriesReversed.map(item => {
    return item.registrationInformation;
  });
  const decryptedList = (await axios.post(POST_DECRYPT_LIST, {
    encryptedList: registrationInformationList
  })).data || [];

  decryptedList.forEach((item, index) => {
    if (!!item) {
      boughtLotteriesReversed[index].decryptInfo = item;
    }
  });
  return boughtLotteriesReversed;
}

async function getBoughtLotteries({
  lotteryContract,
  address,
  boughtLotteriesPre = [],
  period,
  startId = -1,
}) {
  if (!address) {
    return [];
  }

  const boughtLotteriesResult = await lotteryContract.GetBoughtLotteries.call({
    period,
    startId,
    owner: address
  });

  const boughtLotteries = getViewResult('lotteries', boughtLotteriesResult) || [];
  const boughtLotteriesReversed =[...boughtLotteries.reverse(), ...boughtLotteriesPre];

  if (boughtLotteriesPre.length && boughtLotteriesReversed[0].id === boughtLotteriesPre[0].id) {
    return boughtLotteriesPre;
  }

  const boughtLotteriesDecrypted = await decryptBoughtLotteries(boughtLotteriesReversed);

  if (boughtLotteries.length === 100) {
    const newStartId = boughtLotteries[0].id;
    return await getBoughtLotteries({
      lotteryContract,
      address,
      boughtLotteriesPre: boughtLotteriesDecrypted,
      period,
      startId: newStartId,
    });
  }
  return boughtLotteriesDecrypted;
}

export const LotteryCodeContainer = (({
  currentPeriod,
  aelfAddress
}) => {
  const lotteryContext = useContext(LotteryContext);
  const {state} = lotteryContext;
  const { refreshTime } = state;

  const [periodSelected, setPeriodSelected] = useState();
  const lotteryContract = useContract('123', LOTTERY.CONTRACT_ADDRESS);
  const [boughtLotteries, setBoughtLotteries] = useState([]);
  const [loading, setLoading] = useState(false);

  const count = useBoughtLotteryCountInOnePeriod({
    lotteryContract,
    address: aelfAddress,
    periodNumber: periodSelected,
    refreshTime: +periodSelected === +currentPeriod ? refreshTime : null
  });

  useEffect(() => {
    if (!currentPeriod) {
      return;
    }
    setPeriodSelected(currentPeriod);
  }, [currentPeriod]);

  const updateBoughtLotteries = useCallback(async () => {
    if (!periodSelected || !lotteryContract || !aelfAddress) {
      setLoading(false);
      setBoughtLotteries([]);
      return;
    }
    setBoughtLotteries([]);
    setLoading(true);
    const result = await getBoughtLotteries({
      lotteryContract,
      address: aelfAddress,
      period: periodSelected,
    });
    setLoading(false);
    setBoughtLotteries(result);
  }, [periodSelected, lotteryContract, aelfAddress]);

  useEffect(() => {
    updateBoughtLotteries();
  }, [updateBoughtLotteries]);

  useEffect(() => {
    if (!refreshTime) {
      return;
    }
    if (+periodSelected === +currentPeriod) {
      updateBoughtLotteries();
    }
  }, [refreshTime]);

  const handleChange = (value) => {
    setPeriodSelected(value);
  };

  const periodSelectedShow = periodSelected >= LOTTERY.START_PERIOD
            ? periodSelected - LOTTERY.START_PERIOD + 1 : '-';

  return <>
    <Row justify="space-between" className="lottery-code-subtitle">
      <Col>You had swapped {count} codes in Period {periodSelectedShow}</Col>
      <Col>
        <Select
          defaultValue={periodSelected}
          placeholder={`Period ${periodSelectedShow}`}
          style={{ width: 120 }}
          onChange={handleChange}
        >
          {(() => {
            let options = [];
            for (let i = currentPeriod; i >= LOTTERY.START_PERIOD; i--) {
              options.push(<Option key={i} value={i}>Period {i - LOTTERY.START_PERIOD + 1}</Option>);
            }
            return options;
          })()}
        </Select>
      </Col>
    </Row>
    <div />
    <div>
      <AllLotteryCodes
        currentPeriod={+periodSelected === +currentPeriod}
        dataSource={boughtLotteries}
        historyLoading={loading}
      />
    </div>
  </>
});
