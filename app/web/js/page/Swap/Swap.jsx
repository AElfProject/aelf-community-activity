import React, { useState } from 'react';

import { Form, Input, Button, Checkbox } from 'antd';

/* From start */
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
/* From end */

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

function renderSwapPairInfo(swapPair) {
  const keys = Object.keys(swapPair);
  const swapPairsHTML = keys.map(key => {
    return (
      <div className='swap-pair-container' key={key}>
        <div className='swap-pair-key'>{key}</div>
        <div className='swap-pair-value'>{swapPair[key]}</div>
      </div>
    );
  });

  return (
    <section className='section-basic basic-container'>
      <div className='section-title'>
        Information of SwapPair
      </div>
      <div className='section-content swap-flex-wrap'>
        {swapPairsHTML}
      </div>
    </section>
  );
}

function renderSwapElf() {

  const onFinish = values => {
    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <section className='section-basic basic-container'>
      <div className='section-title'>
        Swap Test ELF
      </div>
      <div className='section-content'>
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout} name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}

export default function Swap() {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0);

  // useEffect 请求数据
  const swapPairsInfoHTML = renderSwapPairInfo(swapPairTemp);
  const swapElfHTML = renderSwapElf();

  return (
    <div>
      <div className='basic-blank'/>
      {swapPairsInfoHTML}

      <div className='basic-blank'/>
      {swapElfHTML}

      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
