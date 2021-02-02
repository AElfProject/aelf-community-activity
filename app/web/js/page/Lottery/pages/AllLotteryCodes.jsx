import { Select, Row, Col, Table } from 'antd';
import React, {useState, useEffect} from "react";
import { LOTTERY } from '../../../constant/constant';
import {useContract} from '../hooks/useContract';
import {useBoughtLotteryCountInOnePeriod} from '../hooks/useBoughtLotteryCountInOnePeriod';
import { getViewResult } from '../../../utils/NightElf/NightElf';

const { Option } = Select;
import './RewardSharing.less'

import axios from '../../../service/axios';
import { POST_DECRYPT_LIST } from '../../../constant/apis';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: 'block',
    dataIndex: 'block',
    key: 'block',
    width: 150
  },
  {
    title: 'Reward Name',
    dataIndex: 'rewardName',
    key: 'rewardName',
    width: 200
  },
  {
    title: 'Registration Information (After Draw)',
    // dataIndex: 'registrationInformation',
    dataIndex: 'decryptInfo',
    // key: 'registrationInformation',
    key: 'decryptInfo',
    width: 300
  },
];

export const AllLotteryCodes = ({
  dataSource, historyLoading
}) => {
  return <Table
    pagination={{
      pageSize: 20,
      showSizeChanger: false
    }}
    dataSource={dataSource}
    loading={historyLoading}
    columns={columns}
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

  const boughtLotteriesDecrypted = await decryptBoughtLotteries(boughtLotteriesReversed);

  if (boughtLotteries.length === 20) {
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
  const [periodSelected, setPeriodSelected] = useState();
  const lotteryContract = useContract('123', LOTTERY.CONTRACT_ADDRESS);
  const [boughtLotteries, setBoughtLotteries] = useState([]);
  const [loading, setLoading] = useState(false);

  const count = useBoughtLotteryCountInOnePeriod ({
    lotteryContract,
    address: aelfAddress,
    periodNumber: periodSelected,
  });

  useEffect(() => {
    if (!currentPeriod) {
      return;
    }
    setPeriodSelected(currentPeriod);
  }, [currentPeriod]);

  useEffect(() => {
    if (!periodSelected || !lotteryContract || !aelfAddress) {
      setLoading(false);
      setBoughtLotteries([]);
      return;
    }
    const getData = async () => {
      setBoughtLotteries([]);
      setLoading(true);
      const result = await getBoughtLotteries({
        lotteryContract,
        address: aelfAddress,
        period: periodSelected,
      });
      setLoading(false);
      setBoughtLotteries(result);
    };
    getData();
  }, [periodSelected, lotteryContract, aelfAddress]);

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
        dataSource={boughtLotteries}
        historyLoading={loading}
      />
    </div>
  </>
});
