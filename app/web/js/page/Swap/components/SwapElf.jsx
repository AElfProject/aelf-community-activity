/* From start */
import React from 'react';
import { Button, Form, Input } from 'antd';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};
/* From end */
export default function renderSwapElf() {

  const onFinish = values => {
    // TODO: call contract
    console.log('Success:', values);
    Object.keys(values).forEach(key => {
      console.log('Key value:', key, values[key]);
    });
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <section className='section-basic basic-container'>
      <div className='section-title'>
        Swap Test ELF
      </div>
      <div className='section-content swap-form-container'>
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Pair ID"
            name="pair_id"
            rules={[{ required: true, message: 'Please input the pair ID!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Origin Amount"
            name="origin_amount"
            rules={[{ required: true, message: 'Please input the origin amount!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Merkle Path"
            name="merkle_path"
            rules={[{ required: true, message: 'Please input the Merkle Path!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Receiver Address"
            name="receiver_address"
            rules={[{ required: true, message: 'Please input the receiver address!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Unique ID"
            name="unique_id"
            rules={[{ required: true, message: 'Please input the unique ID!' }]}
          >
            <Input />
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
