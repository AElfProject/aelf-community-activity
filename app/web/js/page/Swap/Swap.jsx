import React, { useState } from 'react';

import { Form, Input, Button } from 'antd';
import moment from 'moment';

import renderSwapPairInfo from './components/SwapPairInfo';
import renderCurrentSwapInfo from './components/CurrentSwapInfo';
import renderSwapElf from './components/SwapElf';
import renderSwapHistory from './components/SwapHistory';

import './Swap.less';

const swapPairTemp = {
  pair_id: 1,
  origin_token_size_in_byte: 2,
  origin_token_numeric_big_endian: 3,
  target_token_symbol: 4,
  swap_ratio: 5,
  controller: 6,
  swapped_amount: 7,
  swapped_times: 8,
  current_round: 9,
  deposit_amount: 10
};

const currentSwapInfoTemp = {
  pair_id: 1,
  merkle_tree_root: 2,
  start_time: 3,
  swapped_amount: 4,
  swapped_times: 5,
};

export default function Swap() {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0);

  // useEffect 请求数据
  const swapPairsInfoHTML = renderSwapPairInfo(swapPairTemp);
  const currentSwapInfoHTML = renderCurrentSwapInfo(currentSwapInfoTemp);
  const swapElfHTML = renderSwapElf();
  const swapHistoryHTML = renderSwapHistory();

  return (
    <div>
      <div className='basic-blank'/>
      <a href='/#'>Click to get the swapping tutorial</a>

      <div className='basic-blank'/>
      {swapPairsInfoHTML}

      <div className='basic-blank'/>
      {currentSwapInfoHTML}

      <div className='basic-blank'/>
      {swapElfHTML}

      <div className='basic-blank'/>
      {swapHistoryHTML}

      <div className='basic-blank'/>
      {/*<p>You clicked {count} times</p>*/}
      {/*<button onClick={() => setCount(count + 1)}>*/}
      {/*  Click me*/}
      {/*</button>*/}
    </div>
  );
}
