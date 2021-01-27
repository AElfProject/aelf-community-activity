import React, { useCallback, useState } from 'react';
import {Input, InputNumber} from 'antd';
import * as echarts from 'echarts';

import {
  getDepositByInvitor,
  getDeposit,
  getUserDeposit
} from '../graphs/graph';

import {initDepositByInvitorSeries} from '../charts/depositByInvitor';

export default function App() {
  const [info, setInfo] = useState({});
  const [userAddress, setUserAddress] = useState('');
  const [pageSize, setPageSize] = useState(100);
  const [pageNum, setPageNum] = useState(1);

  const [seriesStyle, setSeriesStyle] = useState({});
  const handleDepositByInvitor = useCallback(async () => {
    // todo: error handle
    // todo: 空白的字符串，考虑如何处理
    const list = await getDepositByInvitor(pageSize, pageNum);
    console.log(list);
    setInfo(list);

    setSeriesStyle({width: '1000px', height: '800px'});
    initDepositByInvitorSeries({
      elementId: 'depositByInvitor',
      listData: list,
      titleName: 'Deposit ByI Invitor'
    });
  }, [pageSize, pageNum]);
  const handleDepositByUser = useCallback(async () => {
    const list = await getDeposit(pageSize, pageNum);
    console.log(list);
    setInfo(list);

    setSeriesStyle({width: '1000px', height: '800px'});
    initDepositByInvitorSeries({
      elementId: 'depositByInvitor',
      listData: list,
      titleName: 'Deposit By User'
    });
  }, [pageSize, pageNum]);
  const handleUserDeposit = useCallback(async () => {
    const list = await getUserDeposit(
      // "0x5684A52f9DA88610D99dEEc1823b759B1d2c088b"
      userAddress
    );
    console.log(list);
    setInfo(list);
  }, [userAddress]);
  return (
    <div className="App">
      <div>
        Page size(default 100): <InputNumber
          placeholder="Page size"
          onChange={value => {
            setPageSize(value);
          }}
        />
        &nbsp; Page number(default 1)<InputNumber
          placeholder="Page number"
          onChange={value => {
            setPageSize(value);
          }}
        />
      </div>

      <div>
        <button onClick={handleDepositByInvitor}>get deposit by invitor</button>
      </div>
      <div>
        <button onClick={handleDepositByUser}>get deposit by users</button>
      </div>
      <div>
        <Input placeholder="Please input user eth address" value={userAddress} onChange={e => {
          setUserAddress(e.target.value);
        }}/>
        <button onClick={handleUserDeposit}>get user deposit</button>
      </div>

      <div id="depositByInvitor" style={seriesStyle}/>

      <pre
        style={{
          width: "600px"
        }}
      >
        {JSON.stringify(info, null, 2)}
      </pre>
    </div>
  );
}
