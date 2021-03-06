/* From start */
import React from 'react';
import { Button, Form, Input, message, Card, Select } from 'antd';
import moment from 'moment';
import { Link } from 'react-router';
import {getMerklePathFromOtherChain} from '../../../utils/getMerklePath';

import {NightElfCheck} from '../../../utils/NightElf/NightElf';
import { LOGIN_INFO, SWAP_CONTRACT_ADDRESS, EXPLORER_URL } from '../../../constant/constant';

import { getAvailableTime } from '../../../utils/cmsUtils';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};

const styles = {
  cardMainHeader: {
    fontSize: '18px',
    color: '#5c28a9'
  },
  cardSubHeader: {
    fontWeight: 400
  }
};
/* From end */
// export default function renderSwapElf(props) {
export default class SwapElf extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      swappedLink: null,
      swappedTxHash: null,
      swapTest: {}
    };
    this.onFinish = this.onFinish.bind(this);
    this.onFinishFailed = this.onFinishFailed.bind(this);
  }

  componentDidMount() {
    getAvailableTime()
      .then(res => {
        const { data } = res;

        const swapTest = data.find(item => item.type === 'swapTest') || {};

        this.setState({
          swapTest
        })
      })
  }

  async onFinish () {
    const swapInfo = this.props;
    try {
      // const {swapId, originAmount, merklePathBytes, merklePathBool, receiverAddress, uniqueId} = values;

      const swapId = '' + swapInfo.swapId;
      const originAmount = swapInfo.swapELFReceiptInfo[2];
      const uniqueId = swapInfo.swapELFReceiptInfo[0];
      const receiverAddress = swapInfo.swapELFReceiptInfo[1];
      const merklePathTreeIndex = swapInfo.swapELFMerklePathInfo[0];
      // const merklePathLength = swapInfo.swapELFMerklePathInfo[1];
      const merklePathBytes = swapInfo.swapELFMerklePathInfo[2].join(',');
      const merklePathBool = swapInfo.swapELFMerklePathInfo[3].join(',');

      if (!(swapId && originAmount && uniqueId && receiverAddress
        && merklePathTreeIndex && merklePathBytes && merklePathBool)) {
        message.warning('This receipt ID not ready yet.');
        return;
      }

      const {swapPairInfo} = swapInfo;

      if (swapPairInfo.roundCount < (merklePathTreeIndex + 1)) {
        message.warning('This receipt ID not ready yet.');
        return;
      }

      const merklePath = getMerklePathFromOtherChain(merklePathBytes.trim(), merklePathBool.trim());
      const swapTokenInput = {
        swapId,
        roundId: parseInt(merklePathTreeIndex, 10),
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

      // In extension， must get chain status at first.
      await aelf.chain.getChainStatus();
      const address = JSON.parse(accountInfo.detail).address;
      const wallet = {
        address
      };

      if (address !== receiverAddress) {
        message.warning(
          `aelf Receiving Address need to be 「${address}」, or you need login 「${receiverAddress}」`
        );
        return;
      }
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
      // const txIdHTML = <div>
      //   <span>Transaction ID: {TransactionId}</span>
      //   <br/>
      //   <a target='_blank' href={explorerHref}>Turn to aelf explorer to get the information of this transaction</a>
      // </div>;
      // message.success(txIdHTML, 16);
      // console.log('swapTokenInput', swapTokenInput);

      this.setState({
        swappedLink: explorerHref,
        swappedTxHash: TransactionId
      });
    } catch(e) {
      message.error(e.message || (e.errorMessage && e.errorMessage.message) || 'Swap failed', 3);
      console.log('error', e);
    }
  };

  async onFinishFailed (errorInfo) {
    console.log('Failed:', errorInfo);
  };

  render() {

    const swapInfo = this.props;
    const {web3PluginInstance, swapPairInfo} = swapInfo;
    const {swappedLink, swappedTxHash, swapTest} = this.state;

    // console.log('swapInfo.swapId: ', swapInfo.swapId, swapInfo.swapELFReceiptInfo);

    return (
      <Card
        className='hover-cursor-auto'
        hoverable
        headStyle={styles.cardMainHeader}
        extra={<span>Available Time: {moment(swapTest.start).format('YYYY-MM-DD HH:mm')} - {moment(swapTest.end).format('YYYY-MM-DD HH:mm')}</span>}
        title='Swap Test Tokens'>
        <div className='section-content swap-form-container'>
          <Form
            {...layout}
            name="basic"
            initialValues={{
              swapId: '' + swapInfo.swapId,
              originAmount: swapInfo.swapELFReceiptInfo[2],
              uniqueId: swapInfo.swapELFReceiptInfo[0],
              receiverAddress: swapInfo.swapELFReceiptInfo[1],
              merklePathBytes: swapInfo.swapELFMerklePathInfo[2].join(','),
              merklePathBool: swapInfo.swapELFMerklePathInfo[3].join(',')
            }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item
              label="Ethereum Address"
            >
              {swapInfo.ethAddress}
            </Form.Item>

            <Form.Item
              label="Receipt ID"
            >
              <Select
                placeholder="Select a receipt ID"
                allowClear
                style={{ width: 300 }}
                onChange={id => {
                  this.props.onSwapELFReceiptIdChange(id);
                  this.setState({
                    swappedLink: null
                  });
                }}
              >
                {/*<Select.Option value={250} key={250}>250 invalid id</Select.Option>*/}
                {swapInfo.receiptIds.map(receiptId => {
                  return <Select.Option value={receiptId.value} key={receiptId.value}>{receiptId.value}</Select.Option>
                })}
              </Select>
              <div>After completing the “lock in”, you will receive a Lock Receipt ID verified by the “ReadContract-getMyReceipts of the
                <a href={web3PluginInstance.lockContractLink} target='_blank'> Ethereum Lock Contract Page</a>
              </div>
              <div>You may have to wait for 1-2 days to proceed token swap after completing step 2.</div>
              <div>If the receipt ID has been swapped, you can still submit it but will not be able to see an existing transaction.</div>
            </Form.Item>

            <Form.Item
              label="Swap ID"
              // name="swapId"
              // rules={[{ required: true, message: 'Please input the swap ID!' }]}
            >
              <Input disabled value={swapInfo.swapId}/>
              {/*<Input disabled defaultValue={swapInfo.swapId} value={swapInfo.swapId}/>*/}
              <div>Swap ID offered by aelf</div>
            </Form.Item>

            <div className='border-top border-top-blank'/>

            <Form.Item
              label="Original Amount"
              // name="originAmount"
              // rules={[{ required: true, message: 'Please input the origin amount!' }]}
            >
              <Input disabled value={swapInfo.swapELFReceiptInfo[2]}/>
            </Form.Item>

            <Form.Item
              label="aelf Receiving Address"
              // name="receiverAddress"
              // rules={[{ required: true, message: 'Please input the receiver address!' }]}
            >
              <Input disabled value={swapInfo.swapELFReceiptInfo[1]}/>
              {/*<Input />*/}
              <span>aelf Receiving Address must be the same as your ELF wallet address.</span>
            </Form.Item>

            <Form.Item
              label="Unique ID"
              // name="uniqueId"
              // rules={[{ required: true, message: 'Please input the unique ID!' }]}
            >
              <Input disabled value={swapInfo.swapELFReceiptInfo[0]}/>
              {/*<Input />*/}
              <div>
                This data is available through the lock receipt ID (index of Ethereum) which can be verified in the ReadContract-getReceiptInfo of the
                <a href={web3PluginInstance.lockContractLink} target='_blank'> Ethereum Lock Contract Page</a>
              </div>
            </Form.Item>

            <div className='border-top border-top-blank'/>

            <Form.Item
              label="Merkle Tree Index (int)"
            >
              <Input disabled value={swapInfo.swapELFMerklePathInfo[0]}/>
              <span>Merkle Tree Index can not be greater than  {(swapPairInfo.roundCount - 1)  || ''}.</span>
            </Form.Item>

            <Form.Item
              label="Merkle Path (bytes)"
            >
              <Input disabled value={swapInfo.swapELFMerklePathInfo[2].join(',')}/>
            </Form.Item>

            <Form.Item
              label="Merkle Path (bool)"
              // name="merklePathBool"
              // rules={[{ required: true, message: 'Please input the Merkle Path!' }]}
            >
              <Input disabled value={swapInfo.swapELFMerklePathInfo[3].join(',')}/>
              <div>
                This data is available in the lock receipt ID (index of the Ethereum) which can be verified in the ReadContract-GenerateMerklePath of the
                <a href={web3PluginInstance.merkleContractLink} target='_blank'> Ethereum MerkleTreeContract page</a>
              </div>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>

            {swappedLink &&
            <Form.Item
              label="aelf Txn Hash:"
            >
              <a href={swappedLink} target='_blank'>{swappedTxHash}</a>
            </Form.Item>}

          </Form>
        </div>
      </Card>
    );
  }
}
