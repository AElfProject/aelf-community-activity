/* From start */
import React, {useState, useCallback} from 'react';
import { Button, Form, Input, message, Card, Select } from 'antd';
import {getMerklePathFromOtherChain} from '../../../utils/getMerklePath';

import {NightElfCheck} from '../../../utils/NightElf/NightElf';
import { LOGIN_INFO, SWAP_CONTRACT_ADDRESS, EXPLORER_URL, RECORDER_ID, SWAP_PAIR } from '../../../constant/constant';
import MessageTxToExplore from '../../../components/Message/TxToExplore';
import BigNumber from 'bignumber.js';

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
export const  SwapElf = (swapInfo) => {
  const {web3PluginInstance, merkleTreeRecorderContract, swapcontract, swapPairInfo, swapId} = swapInfo;//this.props;

  const [swappedLink, setSwappedLink] = useState();
  const [swappedTxHash, setSwappedTxHash] = useState();

  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [merkleIndexInfo, setMerkleIndexInfo] = useState({
    lastLeafIndex: '',
    lastRecordedLeafIndex: ''
  });

  const [swapELFReceiptInfo, setSwapELFReceiptInfo] = useState([]);
  const [swapELFMerklePathInfo, setSwapELFMerklePathInfo] = useState([[], [], []]);

  const onFinish = useCallback(async () => {
    setSubmitLoading(true);
    try {
      const originAmount = swapELFReceiptInfo[2];
      const uniqueId = swapELFReceiptInfo[0];
      const receiverAddress = swapELFReceiptInfo[1];
      const merklePathBytes = swapELFMerklePathInfo[1].join(',');
      const merklePathBool = swapELFMerklePathInfo[2].join(',');

      if (!(swapId && originAmount && uniqueId && receiverAddress
         && merklePathBytes && merklePathBool)) {
        message.warning('This receipt ID not ready yet.');
        setSubmitLoading(false);
        return;
      }

      if (+merkleIndexInfo.lastRecordedLeafIndex < +merkleIndexInfo.lastLeafIndex) {
        message.warning(`This receipt ID not ready yet. 
        Merkle Tree Index can not be greater than ${merkleIndexInfo.lastRecordedLeafIndex}, this is ${merkleIndexInfo.lastLeafIndex}`);
        setSubmitLoading(false);
        return;
      }

      const merklePath = getMerklePathFromOtherChain(merklePathBytes.trim(), merklePathBool.trim());
      const swapTokenInput = {
        swapId,
        // roundId: parseInt(merklePathTreeIndex, 10),
        originAmount: originAmount.trim(),
        merklePath,
        receiverAddress: receiverAddress.trim(),
        uniqueId: uniqueId.trim(),
        lastLeafIndex: merkleIndexInfo.lastLeafIndex
      };

      await NightElfCheck.getInstance().check;
      const aelf = NightElfCheck.initAelfInstanceByExtension();
      const accountInfo = await aelf.login(LOGIN_INFO);

      if (accountInfo.error) {
        message.warning(accountInfo.errorMessage.message || accountInfo.errorMessage);
        setSubmitLoading(false);
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
        setSubmitLoading(false);
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
        setSubmitLoading(false);
        return;
      }
      const {TransactionId} = swapResult.result || swapResult;
      const explorerHref = `${EXPLORER_URL}/tx/${TransactionId}`;

      setSwappedLink(explorerHref);
      setSwappedTxHash(TransactionId);
      MessageTxToExplore(TransactionId);
      setReadyToSubmit(false);
      setSubmitLoading(false);
    } catch(e) {
      setSubmitLoading(false);
      message.error(e.message || (e.errorMessage && e.errorMessage.message) || 'Swap failed', 3);
      console.log('error', e);
    }
  }, [swapELFReceiptInfo, swapELFMerklePathInfo, swapId, merkleIndexInfo]);

  const onFinishFailed = async (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onSwapELFReceiptIdChange = useCallback(async (id) => {
    if (!merkleTreeRecorderContract || !swapcontract || !web3PluginInstance) {
      return;
    }

    setReadyToSubmit(false);
    setSwapELFReceiptInfo([]);
    setSwapELFMerklePathInfo([[], [], []]);
    setMerkleIndexInfo({
      lastLeafIndex: '',
      lastRecordedLeafIndex: ''
    });
    if (id === undefined) {
      return;
    }

    try {

      const merkleTreeRecorderContractInstance = await merkleTreeRecorderContract.getMerkleTreeRecorderInstance();
      const lastRecordedLeafIndex = await merkleTreeRecorderContractInstance.GetLastRecordedLeafIndex.call();

      if (!lastRecordedLeafIndex || (+lastRecordedLeafIndex.value < +id)) {
        message.warning(
          `Receipt ID: ${id} is not ready to swap, you can swap before ${
            lastRecordedLeafIndex ? lastRecordedLeafIndex.value : 0}`,
          6
        );
        return;
      }
      // {
      //   firstLeafIndex: 0
      //   lastLeafIndex: "127"
      //   merkleTreeRoot: "11c65a703cc98bbaa940e24047558f20e7bf24b661c0b8dede8a51034f1fb04b"
      // }
      const leafLocatedMerkleTreeOutput = await merkleTreeRecorderContractInstance.GetLeafLocatedMerkleTree.call({
        leafIndex: id,
        recorderId: RECORDER_ID
      });

      const {firstLeafIndex, lastLeafIndex} = leafLocatedMerkleTreeOutput;

      const result = await Promise.all(
        [web3PluginInstance.getReceiptInfo(id),
          web3PluginInstance.getMerklePathInfo(id, firstLeafIndex, lastLeafIndex)],
      );

      setSwapELFReceiptInfo(result[0]);
      setSwapELFMerklePathInfo(result[1]);
      setMerkleIndexInfo({
        lastLeafIndex,
        lastRecordedLeafIndex: lastRecordedLeafIndex.value
      });

      const swapContract = await swapcontract.getSwapContractInstance();
      const swapAmounts = await swapContract.GetSwapAmounts.call({
        swapId: SWAP_PAIR,
        uniqueId: result[0][0]
      });
      if (swapAmounts) {
        message.error(`Receipt ID: ${id} had been swapped`, 6);
        setReadyToSubmit(false);
        return;
      }
      setReadyToSubmit(true);
    } catch(e) {
      setReadyToSubmit(false);
      message.warning(`Receipt ID: ${id} maybe not ready to swap`, 6);
      e.message && message.warning(e.message);
    }
  }, [merkleTreeRecorderContract, swapcontract, web3PluginInstance]);

  return <Card
      className='hover-cursor-auto'
      hoverable
      headStyle={styles.cardMainHeader}
      // extra={<span>Available Time: {moment(swapTest.start).format('YYYY-MM-DD HH:mm')} - {moment(swapTest.end).format('YYYY-MM-DD HH:mm')}</span>}
      title='Claim Token'>
      <div className='section-content swap-form-container'>
        <Form
          {...layout}
          name="basic"
          initialValues={{
            swapId: '' + swapInfo.swapId,
            originAmount: swapELFReceiptInfo[2],
            uniqueId: swapELFReceiptInfo[0],
            receiverAddress: swapELFReceiptInfo[1],
            merklePathBytes: swapELFMerklePathInfo[1].join(','),
            merklePathBool: swapELFMerklePathInfo[2].join(',')
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
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
                onSwapELFReceiptIdChange(id);
                setSwappedLink(null);
              }}
            >
              {/*<Select.Option value={250} key={250}>250 invalid id</Select.Option>*/}
              {swapInfo.receiptIds.map(receiptId => {
                return <Select.Option value={receiptId.value} key={receiptId.value}>{receiptId.value}</Select.Option>
              })}
            </Select>
            <div>After completing the'staking', you will receive a Lock Receipt ID verified by the ‘ReadContract-getMyReceipts’ of the Ethereum Lock Contract Page.Token swap will be done every day at 12:00 noon on the backend, you can click ‘Submit’ tab to claim bonus. </div>
            {/* <div>After completing the'staking', you will receive a Lock Receipt ID verified by the ‘ReadContract-getMyReceipts’ of the
              <a href={web3PluginInstance.lockContractLink} target='_blank'> Ethereum Lock Contract Page</a>
            </div>
            <div>After 2 hours of staking, you can click ‘Submit’ tab to claim bonus. </div>
            <div>If the receipt ID has been swapped, you can still submit it but will not be able to see an existing transaction.</div> */}
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
            help={
              <>
                <div>
                  You will receive aelf Mainnet Token Reward: {swapELFReceiptInfo[2]
                  ? new BigNumber(swapELFReceiptInfo[2]).div(400).div(10**18).toFormat() : '-'} ELF,&nbsp;
                  {swapELFReceiptInfo[2]
                    ? new BigNumber(swapELFReceiptInfo[2]).div(10**18).toFormat() : '-'} LOT</div>
              </>
            }
            // name="originAmount"
            // rules={[{ required: true, message: 'Please input the origin amount!' }]}
          >
            <Input disabled value={swapELFReceiptInfo[2]
              ? new BigNumber(swapELFReceiptInfo[2]).div(10**18).toString() : ''}/>
          </Form.Item>

          <Form.Item
            label="aelf Receiving Address"
            // name="receiverAddress"
            // rules={[{ required: true, message: 'Please input the receiver address!' }]}
          >
            <Input disabled value={swapELFReceiptInfo[1]}/>
            {/*<Input />*/}
            <span>aelf Receiving Address must be the same as your ELF wallet address.</span>
          </Form.Item>

          <Form.Item
            label="Unique ID"
            // name="uniqueId"
            // rules={[{ required: true, message: 'Please input the unique ID!' }]}
          >
            <Input disabled value={swapELFReceiptInfo[0]}/>
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
            <Input disabled value={merkleIndexInfo.lastLeafIndex}/>
            <span>Merkle Tree Index can not be greater than  {merkleIndexInfo.lastRecordedLeafIndex  || ''}.</span>
          </Form.Item>

          <Form.Item
            label="Merkle Path (bytes)"
          >
            <Input disabled value={swapELFMerklePathInfo[1].join(',')}/>
          </Form.Item>

          <Form.Item
            label="Merkle Path (bool)"
            // name="merklePathBool"
            // rules={[{ required: true, message: 'Please input the Merkle Path!' }]}
          >
            <Input disabled value={swapELFMerklePathInfo[2].join(',')}/>
            <div>
              This data is available in the lock receipt ID (index of the Ethereum) which can be verified in the ReadContract-GenerateMerklePath of the
              <a href={web3PluginInstance.merkleContractLink} target='_blank'> Ethereum MerkleTreeContract page</a>
            </div>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" disabled={!readyToSubmit} loading={submitLoading}>
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
    </Card>;
};
