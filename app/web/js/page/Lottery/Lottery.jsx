import React, { useState } from 'react';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

import renderLotteryAward from './pages/LotteryAward';
import renderAwardHistory from './pages/AwardHistory';
import renderLotteryDraw from './pages/LotteryDraw';
import renderPersonalDraw from './pages/PersonalDraw';
import './Lottery.less';

function callback(key) {
  console.log(key);
}

export default function Lottery() {
  // 声明一个叫 "count" 的 state 变量
  // const [count, setCount] = useState(0);
  const lotteryDrawHTML = renderLotteryDraw();
  const personalDrawHTML = renderPersonalDraw();
  const lotteryAwardHTML = renderLotteryAward();
  const awardHistoryHTML = renderAwardHistory();

  return (
    <div>
      <div className='basic-blank'/>
      <div className='basic-container lottery-container'>
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Lottery Draw" key="1">
            {lotteryDrawHTML}
            <div className='basic-blank'/>
            {personalDrawHTML}
          </TabPane>
          <TabPane tab="Lottery Award" key="2">
            {lotteryAwardHTML}
            <div className='basic-blank'/>
            {awardHistoryHTML}
          </TabPane>
        </Tabs>
      </div>
      {/*<p>You clicked {count} times</p>*/}
      {/*<button onClick={() => setCount(count + 1)}>*/}
      {/*  Click me lottery*/}
      {/*</button>*/}
    </div>
  );
}
