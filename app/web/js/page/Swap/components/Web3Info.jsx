import React, {Component} from 'react';
import { Button, Card, Form, Input, Spin, message, Select } from 'antd';
import moment from 'moment';
import { InfoCircleFilled } from '@ant-design/icons';
import { WEB3, SWAP_PAIR } from '../../../constant/constant';
import { getAvailableTime, renderAvailableTime } from '../../../utils/cmsUtils';

import SwapElf from './SwapElf';

const {LOCK_ADDRESS} = WEB3;

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

export default class Web3Info extends Component{
  constructor(props) {
    super(props);
    this.state = {
      connectOk: false,
      account: {
        address: null,
        balance: null,
        tokenBalance: null,
        tokenName: null,
      },
      allowance: '',
      lockedToken: '',
      spender: {
        address: LOCK_ADDRESS,
        value: ''
      },
      approveLoading: false,
      approvedLink: null,
      approvedTxHash: null,
      mortgage: {
        amount: null,
        address: null,
      },
      mortgageLoading: false,
      mortgagedLink: null,
      mortgagedTxHash: null,
      redeem: {
        address: null,
        receiptId: null,
      },
      isRedeemReady: false,
      redeemLoading: false,
      redeemedLink: null,
      redeemedTxHash: null,
      receiptIds: [],
      swapELFReceiptInfo: [],
      swapELFMerklePathInfo: [[], [], [], []],
      mortgageDate: {
        start: '',
        end: ''
      },
      mainnetTokenRewardPivot: 0,
      redeemDate: {
        start: '',
        end: ''
      }
    };

    this.redeemFormRef = React.createRef();

    this.connectMetaMask = this.connectMetaMask.bind(this);
    this.checkMetaMask = this.checkMetaMask.bind(this);
    this.onApproveFinish = this.onApproveFinish.bind(this);
    this.onMortgageFinish = this.onMortgageFinish.bind(this);
    this.getReceiptIDs = this.getReceiptIDs.bind(this);
    this.onRedeemFinish = this.onRedeemFinish.bind(this);
    this.onSwapELFReceiptIdChange = this.onSwapELFReceiptIdChange.bind(this);
  }

  async componentDidMount() {
    getAvailableTime()
      .then(res => {
        const { data } = res;

        const mortgageDate = data.find(item => item.type === 'mortgage') || {};
        const redeemDate = data.find(item => item.type === 'redeem') || {};

        this.setState({
          mortgageDate,
          redeemDate
        });
      })
  }

  componentWillUnmount() {
    this.redeemFormRef = {
      current: {
        setFieldsValue: () => {}
      }
    };
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevProps.web3PluginInstance.web3 && this.props.web3PluginInstance.web3 !== 'undefined') {
      await this.checkMetaMask();
      // await this.getAccounts();
      // await this.getApproveAndLockedELF();
    }
  }

  async checkMetaMask(initMetaMask) {
    const {web3PluginInstance} = this.props;
    const connectOk = web3PluginInstance.checkMetaMask && await web3PluginInstance.checkMetaMask(initMetaMask);
    this.setState({
      connectOk
    });
    if (connectOk) {
      await this.getAccounts();
      await this.getApproveAndLockedELF();
    }
  }

  async connectMetaMask() {
    const {web3PluginInstance} = this.props;
    await web3PluginInstance.connectMetaMask();
    this.checkMetaMask(false);
  }

  async onSwapELFReceiptIdChange (id) {
    this.setState({
      swapELFReceiptInfo: [],
      swapELFMerklePathInfo: [[], [], [], []]
    });
    if (id === undefined) {
      return;
    }
    const {web3PluginInstance} = this.props;
    Promise.all(
      [web3PluginInstance.getReceiptInfo(id), web3PluginInstance.getMerklePathInfo(id)]
    ).then(result => {
      this.setState({
        swapELFReceiptInfo: result[0],
        swapELFMerklePathInfo: result[1]
      });
      console.log('swapELFReceiptInfo', result);
    }).catch(e => {
      message.warning(`Receipt ID: ${id} maybe not ready to swap`);
      message.warning(e.message);
    });
  }

  async getAccounts () {
    const {web3PluginInstance} = this.props;
    const accounts = await web3PluginInstance.getAccounts();
    const account = accounts[0];
    if (account) {
      this.setState({
        account
      });
    }
    console.log('account', account, accounts);

    // TODO
    if (account.address) {
      this.redeemFormRef.current.setFieldsValue({
        address: account.address,
      });
      this.getReceiptIDs(account.address);
    }
  }

  async getReceiptIDs (address = null) {
    const {web3PluginInstance} = this.props;
    const {account} = this.state;
    const receiptIds = await web3PluginInstance.getMyReceiptIds(address || account.address);
    this.setState({ receiptIds });
  }

  async getApproveAndLockedELF () {
    const {web3PluginInstance} = this.props;
    const allowance = await web3PluginInstance.getAllowance();
    const lockedToken = await web3PluginInstance.getLockTokens();
    this.setState({
      allowance,
      lockedToken
    });
  }

  onApproveFinish (approveData) {
    const {web3PluginInstance} = this.props;
    this.setState({
      approveLoading: true,
      approvedLink: null,
      approvedTxHash: null
    });
    try {
      web3PluginInstance.approve(approveData.value).then(receipt => {
        const etherscanPrefix = web3PluginInstance.currentNetwork === 'ethereum' ? '' : web3PluginInstance.currentNetwork + '.';
        this.setState({
          approvedTxHash: receipt.transactionHash,
          approvedLink: 'https://' + etherscanPrefix + 'etherscan.io/tx/' + receipt.transactionHash
        });
        this.getAccounts();
        this.getApproveAndLockedELF();
        console.log('onApproveFinish: ', receipt);
      }).catch(e => {
        message.warning(e.message);
        // console.log('onApproveFinish error: ', e);
      }).then(() => {
        this.setState({
          approveLoading: false
        });
      });
    } catch(e) {
      console.log('onApproveFinish 23333', e);
    }
  }

  onApproveFinishFailed () {
  }

  onMortgageFinish (mortgageData) {
    const {web3PluginInstance} = this.props;
    this.setState({
      mortgageLoading: true,
      mortgagedLink: null,
      mortgagedTxHash: null
    });
    if (!mortgageData.address) {
      message.error('Please input address');
      this.setState({ mortgageLoading: false });
      return;
    }
    const length = mortgageData.address.length;
    if (!(length <= 51 && length >= 47)) {
      message.error('Invalid aelf Wallet Address');
      this.setState({ mortgageLoading: false });
      return;
    }

    web3PluginInstance.createReceipt(mortgageData).then(receipt => {
      const etherscanPrefix = web3PluginInstance.currentNetwork === 'ethereum' ? '' : web3PluginInstance.currentNetwork + '.';
      this.setState({
        mortgagedTxHash: receipt.transactionHash,
        mortgagedLink: 'https://' + etherscanPrefix + 'etherscan.io/tx/' + receipt.transactionHash
      });
      this.getAccounts();
      this.getApproveAndLockedELF();
      console.log('onMortgageFinish: ', receipt);
    }).catch(e => {
      message.warning(e.message);
      // console.log('onMortgageFinish error: ', e);
    }).then(() => {
      this.setState({
        mortgageLoading: false
      })
    });
  }

  onMortgageFinishFailed () {
  }

  onRedeemFinish (redeemData) {
    const {web3PluginInstance} = this.props;
    this.setState({
      redeemLoading: true,
      redeemedLink: null,
      redeemedTxHash: null
    });
    web3PluginInstance.execRedeem(redeemData).then(receipt => {
      const etherscanPrefix = web3PluginInstance.currentNetwork === 'ethereum' ? '' : web3PluginInstance.currentNetwork + '.';
      this.setState({
        redeemedTxHash: receipt.transactionHash,
        redeemedLink: 'https://' + etherscanPrefix + 'etherscan.io/tx/' + receipt.transactionHash
      });
      this.getAccounts();
      this.getApproveAndLockedELF();
      console.log('onRedeemFinish: ', receipt);
    }).catch(e => {
      message.warning(e.message);
    }).then(() => {
      this.setState({
        redeemLoading: false
      })
    });
  }

  onRedeemFinishFailed () {
  }

  render() {
    const {
      connectOk, account, allowance, lockedToken, spender,
      approveLoading, approvedLink, approvedTxHash,
      mortgage, mortgageLoading, mortgagedLink, mortgagedTxHash,
      redeem, redeemLoading, redeemedLink, redeemedTxHash,
      receiptIds, // mainnetTokenRewardPivot, mortgageDate
      mainnetTokenRewardPivot, mortgageDate, redeemDate,
      swapELFReceiptInfo, swapELFMerklePathInfo,
      isRedeemReady
    } = this.state;

    const {address: accountAddress} = account;

    const timeNow = moment().unix();
    const submitDisable = moment(mortgageDate.end).unix() < timeNow || moment(mortgageDate.start).unix() > timeNow;
    console.log('submitDisable', submitDisable, timeNow, moment(mortgageDate.end).unix(), moment(mortgageDate.start).unix());

    const {web3PluginInstance, swapPairInfo} = this.props;
    window.web3PluginInstance2 = web3PluginInstance;
    console.log('web3PluginInstance', web3PluginInstance, account.address, mortgageDate);
    return (
      <>
        <Card
          className='hover-cursor-auto'
          title='Ethereum Wallet'
          hoverable>
          <div className='section-content'>
            {
              web3PluginInstance.web3 === 'undefined'
              ? <a href='https://metamask.io/download.html' target='_blank'>Download MetaMask (If not, you can't even open the web link)</a>
              : null
            }
            { account.address
              ? <>
                  <div>
                    <b>ETH Address: </b>{account.address} &nbsp;&nbsp;&nbsp;
                  </div>
                  <div>
                    <b>ETH Balance: </b>{account.balance} &nbsp;&nbsp;&nbsp;
                    <b>ELF Balance: </b>{account.tokenBalance} &nbsp;&nbsp;&nbsp;
                    <b>Approved ELF: </b>{allowance} &nbsp;&nbsp;&nbsp;
                    <b>Locked ELF: </b>{lockedToken}
                  </div>
                </>
              : null }
            { !account.address && web3PluginInstance.web3 && web3PluginInstance.web3 !== 'undefined'
            &&  <a onClick={this.connectMetaMask}>Connect to Web3</a>}
          </div>
        </Card>

        <div className='next-card-blank'/>

        <Card
          className='hover-cursor-auto'
          headStyle={styles.cardMainHeader}
          title='Staking Token'
          extra={renderAvailableTime(mortgageDate)}
          hoverable>
          <div className='section-content'>
            <InfoCircleFilled style={{
              color: 'orange'
            }} /> During the claiming token, we adopt the Ethereum open-source contract and users can check the on-chain data.
          </div>
        </Card>

        <div className='next-card-blank'/>
        <Card
          className='hover-cursor-auto'
          title='Step 1: Approve'
          headStyle={styles.cardSubHeader}
          hoverable>
          <div className='section-content swap-form-container'>
            <Form
              {...layout}
              name="approve"
              initialValues={{spenderAddress: LOCK_ADDRESS}}
              onFinish={this.onApproveFinish}
              onFinishFailed={this.onApproveFinishFailed}
            >
              <Form.Item
                label="Spender (address)"
                help={
                  <>
                    <div>Authorize the lock-in contract and input the authorized amount (these tokens will be used for the staking); this step can be performed in the writecontract - approve operation on the
                      <a href={web3PluginInstance.tokenContractLink} target='_blank'> Ethereum Token Contract Page</a>
                    </div>
                  </>
                }
              >
                <Form.Item
                  name="spenderAddress"
                  noStyle
                  rules={[{ required: true, message: 'Please input the Spender(address)!' }]}
                >
                  <Input disabled defaultValue={LOCK_ADDRESS} value={LOCK_ADDRESS}/>
                </Form.Item>
              </Form.Item>

              <Form.Item
                label="Value"
                name="value"
                rules={[{ required: true, message: 'Please input the value!' }]}
              >
                <Input/>
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" disabled={submitDisable}>
                  Submit
                </Button>
                &nbsp;<Spin spinning={approveLoading}/>
              </Form.Item>
              {approvedLink &&
                <Form.Item
                  label="Ethereum Txn Hash:"
                >
                  <a href={approvedLink} target='_blank'>{approvedTxHash}</a>
                </Form.Item>
              }
            </Form>
          </div>
        </Card>

        <div className='next-card-blank'/>
        <Card
          className='hover-cursor-auto'
          title='Step 2: Staking'
          headStyle={styles.cardSubHeader}
          hoverable>
          <div className='section-content swap-form-container'>
            <Form
              {...layout}
              name="mortgage"
              initialValues={{spenderAddress: LOCK_ADDRESS}}
              onFinish={this.onMortgageFinish}
              onFinishFailed={this.onMortgageFinishFailed}
              onValuesChange={(changedValues, allValues) => {
                // console.log('changedValues, allValues', changedValues, allValues);
                if ('amount' in changedValues) {
                  this.setState({
                    mainnetTokenRewardPivot: changedValues.amount || 0
                  });
                }
              }}
            >
              <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true, message: 'Amount is required.' }]}
                help={
                  <>
                    <div>You will receive aelf Mainnet Token Reward: {mainnetTokenRewardPivot / 400 || '-'} ELF, {mainnetTokenRewardPivot || '-'} LOT</div>
                  </>
                }
              >
                <Input/>
              </Form.Item>

              {/*<Form.Item*/}
              {/*  label="aelf Receiving Address "*/}
              {/*  rules={[{ required: true, message: 'aelf Receiver Address is required.' }]}*/}
              {/*>*/}
              <Form.Item
                label="aelf Wallet Address "
                name="address"
                rules={[{ required: true, message: 'aelf Receiver Address is required.' }]}
                help={
                  <>
                    <div>After completing the authorization, please provide the amount of ELF to stake (the amount should be no more than the authorized quantity) and the address for receiving ELF in the aelf mainnet. The staking bonus will be automatically sent to your aelf wallet after we verify it. Please check it after 2 hours.This step can be executed in the writecontract-createreceipt section of the
                      <a href={web3PluginInstance.lockContractLink} target='_blank'> Ethereum Lock Contract Page</a>
                    </div>
                  </>
                }
              >
                <Input/>
              </Form.Item>
              {/*</Form.Item>*/}

              <Form.Item
                label="Referral Code"
                name="referralCode"
              >
                <Input maxLength={128} placeholder="Optional"/>
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" disabled={submitDisable}>
                  Submit
                </Button>
                &nbsp;<Spin spinning={mortgageLoading}/>
              </Form.Item>
              {mortgagedLink &&
              <Form.Item
                label="Ethereum Txn Hash:"
              >
                <a href={mortgagedLink} target='_blank'>{mortgagedTxHash}</a>
              </Form.Item>
              }
            </Form>
          </div>
        </Card>

        <div className='next-card-blank'/>
        <SwapElf
          swapPairInfo={swapPairInfo}
          ethAddress={account.address}
          swapId={SWAP_PAIR}
          receiptIds={receiptIds}
          onSwapELFReceiptIdChange={this.onSwapELFReceiptIdChange}
          swapELFReceiptInfo={swapELFReceiptInfo}
          swapELFMerklePathInfo={swapELFMerklePathInfo}
          web3PluginInstance={web3PluginInstance}
        />

        <div className='next-card-blank'/>
        <Card
          className='hover-cursor-auto'
          title='Redeem'
          headStyle={styles.cardMainHeader}
          // extra={<span>Available Time: {moment(redeemDate.start).format('YYYY-MM-DD HH:mm')} - {moment(redeemDate.end).format('YYYY-MM-DD HH:mm')}</span>}
          hoverable>
          <div className='section-content swap-form-container'>
            <Form
              {...layout}
              name="redeem"
              ref={this.redeemFormRef}
              initialValues={{ address: accountAddress }}
              onFinish={this.onRedeemFinish}
              onFinishFailed={this.onRedeemFinishFailed}
            >
              <Form.Item
                label="Ethereum Address"
                name="address"
                rules={[{ required: true, message: 'Ethereum Address is required.' }]}
              >
                <Input disabled/>
              </Form.Item>

              <Form.Item
                label="Receipt ID"
                help={
                  <>
                    <div>
                      Once the event is completed, ELF tokens can be redeemed by submitting the Lock Receipt ID. Users can only redeem ELF tokens after 30 days based on the time when the lock started. This step is available in the WriteContract-finishReceipt of the
                      <a href={web3PluginInstance.lockContractLink} target='_blank'> Ethereum Lock Contract Page</a>
                    </div>
                  </>
                }
              >
                <Form.Item
                  noStyle
                  name="receiptId"
                  rules={[{ required: true, message: 'Receipt ID is required.' }]}
                >
                  <Select
                    placeholder="Select a receipt ID"
                    allowClear
                    style={{ width: 300 }}
                    onChange={async (value) => {
                      this.setState({
                        isRedeemReady: false
                      });
                      const redeemReady = await web3PluginInstance.checkRedeemReady(value);
                      this.setState({
                        isRedeemReady: redeemReady
                      });
                    }}
                  >
                    {/*<Select.Option value={250} key={250}>250 invalid id</Select.Option>*/}
                    {receiptIds.map(receiptId => {
                      return <Select.Option value={receiptId.value} key={receiptId.value}>{receiptId.value}</Select.Option>
                    })}
                  </Select>
                </Form.Item>
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" disabled={!accountAddress || !isRedeemReady}>
                  Submit
                </Button>
                &nbsp;<Spin spinning={redeemLoading}/>
              </Form.Item>
              {redeemedLink &&
              <Form.Item
                label="Ethereum Txn Hash:"
              >
                <a href={redeemedLink} target='_blank'>{redeemedTxHash}</a>
              </Form.Item>
              }
            </Form>
          </div>
        </Card>
      </>
    );
  }
}
