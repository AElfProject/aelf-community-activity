/* From start */
import React from 'react';
import { Button, Form, Input, message, Card } from 'antd';
import { Link } from 'react-router';
import {getMerklePathFromOtherChain} from '../../../utils/getMerklePath';

import {NightElfCheck} from '../../../utils/NightElf/NightElf';
import { LOGIN_INFO, SWAP_CONTRACT_ADDRESS, EXPLORER_URL } from '../../../constant/constant';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 18 },
};
/* From end */
export default function renderSwapElf(swapInfo) {

  const onFinish = async values => {

    try {
      const {swapId, originAmount, merklePathBytes, merklePathBool, receiverAddress, uniqueId} = values;
      const merklePath = getMerklePathFromOtherChain(merklePathBytes.trim(), merklePathBool.trim());
      const swapTokenInput = {
        swapId,
        originAmount: originAmount.trim(),
        merklePath,
        receiverAddress: receiverAddress.trim(),
        uniqueId: uniqueId.trim(),
      };

      await NightElfCheck.getInstance().check;
      const aelf = NightElfCheck.initAelfInstanceByExtension();
      const accountInfo = await aelf.login(LOGIN_INFO);

      if (accountInfo.error) {
        message.warning(accountInfo.errorMessage.message || accountInfo.errorMessage);
        return;
      }

      const chainStatus = await aelf.chain.getChainStatus();
      const wallet = {
        address: JSON.parse(accountInfo.detail).address
      };
      // It is different from the wallet created by Aelf.wallet.getWalletByPrivateKey();
      // There is only one value named address;
      const swapContract = await aelf.chain.contractAt(
        SWAP_CONTRACT_ADDRESS,
        wallet
      );
      const swapResult = await swapContract.SwapToken(swapTokenInput);
      if (swapResult.error) {
        message.warning(swapResult.errorMessage.message || swapResult.errorMessage);
        return;
      }
      const {TransactionId} = swapResult.result || swapResult;
      const explorerHref = `${EXPLORER_URL}/tx/${TransactionId}`;
      const txIdHTML = <div>
        <span>Transaction ID: {TransactionId}</span>
        <br/>
        <a target='_blank' href={explorerHref}>Turn to aelf explorer to get the information of this transaction</a>
      </div>;
      message.success(txIdHTML, 16);
      console.log('swapTokenInput', swapTokenInput);
    } catch(e) {
      message.error(e.message || (e.errorMessage && e.errorMessage.message) || 'Swap failed', 3);
      console.log('error', e);
    }
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  console.log('swapInfo.swapId: ', swapInfo.swapId);

  return (
    <Card
      className='hover-cursor-auto'
      hoverable
      title='Swap Test Token'>
      <div className='section-content swap-form-container'>
        <Form
          {...layout}
          name="basic"
          initialValues={{ swapId: '' + swapInfo.swapId }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Swap ID"
            name="swapId"
            rules={[{ required: true, message: 'Please input the swap ID!' }]}
          >
            <Input disabled defaultValue={swapInfo.swapId} value={swapInfo.swapId}/>
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
    </Card>
  );
}
