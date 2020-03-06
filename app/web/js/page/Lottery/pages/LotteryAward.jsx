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

export default function renderLotteryAward() {

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
        Information
      </div>
      <div className='section-content lottery-form-container'>
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Random Hash"
            name="random_hash"
            rules={[{ required: true, message: 'Please input the random hash!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Receiving address"
            name="receiving_address"
            rules={[{ required: true, message: 'Please input the receiving address!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Telegram"
            name="telegram"
            rules={[{ required: true, message: 'Please input the telegram!' }]}
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
