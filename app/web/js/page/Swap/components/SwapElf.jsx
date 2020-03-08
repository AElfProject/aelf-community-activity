/* From start */
import React from 'react';
import { Button, Form, Input } from 'antd';
import {getMerklePathFromOtherChain} from '../../../utils/getMerklePath';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};
/* From end */
export default function renderSwapElf(swapInfo) {

  const onFinish = values => {
    const {pairId, originAmount, merklePathBytes, merklePathBool, receiverAddress, uniqueId} = values;
    const merklePath = getMerklePathFromOtherChain(merklePathBytes, merklePathBool);
    const swapTokenInput = {
      pairId,
      originAmount,
      merklePath,
      receiverAddress,
      uniqueId,
    };
    console.log('swapTokenInput', swapTokenInput)
    // TODO: use browser extension call the contract method
    // swapContract.SwapToken(dataUse, {sync: true});
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  console.log('swapInfo.pairId: ', swapInfo.pairId);

  return (
    <section className='section-basic basic-container'>
      <div className='section-title'>
        Swap Test ELF
      </div>
      <div className='section-content swap-form-container'>
        <Form
          {...layout}
          name="basic"
          initialValues={{ pairId: swapInfo.pairId }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Pair ID"
            name="pairId"
            rules={[{ required: true, message: 'Please input the pair ID!' }]}
          >
            <Input disabled defaultValue={swapInfo.pairId} value={swapInfo.pairId}/>
          </Form.Item>

          <Form.Item
            label="Origin Amount"
            name="originAmount"
            rules={[{ required: true, message: 'Please input the origin amount!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Merkle Path (bytes)"
            name="merklePathBytes"
            rules={[{ required: true, message: 'Please input the Merkle Path!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Merkle Path (bool)"
            name="merklePathBool"
            rules={[{ required: true, message: 'Please input the Merkle Path!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Receiver Address"
            name="receiverAddress"
            rules={[{ required: true, message: 'Please input the receiver address!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Unique ID"
            name="uniqueId"
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
