import React, {Component} from 'react';
import { Button, Card, Form, Input, Spin, message, Select } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import SwapElf from './SwapElf';
import { WEB3, SWAP_PAIR } from '../../../constant/constant';
const {LOCK_ADDRESS} = WEB3;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
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
      redeemLoading: false,
      redeemedLink: null,
      redeemedTxHash: null,
      receiptIds: [],
      swapELFReceiptInfo: [],
      swapELFMerklePathInfo: [[], [], [], []]
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
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevProps.web3PluginInstance.web3 && this.props.web3PluginInstance.web3 !== 'undefined') {
      await this.checkMetaMask();
      await this.getAccounts();
      await this.getApproveAndLockedELF();
    }
  }

  async checkMetaMask(initMetaMask) {
    const {web3PluginInstance} = this.props;
    this.setState({
      connectOk: web3PluginInstance.checkMetaMask ? await web3PluginInstance.checkMetaMask(initMetaMask) : false
    });
  }

  async connectMetaMask() {
    const {web3PluginInstance} = this.props;
    web3PluginInstance.connectMetaMask();
    this.checkMetaMask(false);
  }

  async onSwapELFReceiptIdChange (id) {
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
    this.setState({
      receiptIds: await web3PluginInstance.getMyReceiptIds(address || account.address)
    });
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
    web3PluginInstance.approve(approveData.value).then(receipt => {
      this.setState({
        approvedTxHash: receipt.transactionHash,
        approvedLink: 'https://' + web3PluginInstance.currentNetwork + '.etherscan.io/tx/' + receipt.transactionHash
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
      })
    });
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
    web3PluginInstance.createReceipt(mortgageData).then(receipt => {
      this.setState({
        mortgagedTxHash: receipt.transactionHash,
        mortgagedLink: 'https://' + web3PluginInstance.currentNetwork + '.etherscan.io/tx/' + receipt.transactionHash
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
      this.setState({
        redeemedTxHash: receipt.transactionHash,
        redeemedLink: 'https://' + web3PluginInstance.currentNetwork + '.etherscan.io/tx/' + receipt.transactionHash
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
      receiptIds,
      swapELFReceiptInfo, swapELFMerklePathInfo
    } = this.state;

    const {address: accountAddress} = account;

    // const swapElfHTML = SwapElf({
    //   ethAddress: account.address,
    //   swapId: SWAP_PAIR,
    //   receiptIds,
    //   onSwapELFReceiptIdChange: this.onSwapELFReceiptIdChange,
    //   swapELFReceiptInfo,
    //   swapELFMerklePathInfo
    // });

    const {web3PluginInstance} = this.props;
    window.web3PluginInstance2 = web3PluginInstance;
    console.log('web3PluginInstance', web3PluginInstance, account.address, receiptIds);
    return (
      <>
        <Card
          className='hover-cursor-auto'
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
          hoverable>
          <div className='section-content'>
            <InfoCircleFilled style={{
              color: 'orange'
            }} /> During the process of swap token, we adopt the open-source contract of Ethereum, and users can check the data on the chain
          </div>
        </Card>

        <div className='next-card-blank'/>
        <Card
          className='hover-cursor-auto'
          title='Step1: Approve'
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
              >
                <Form.Item
                  name="spenderAddress"
                  noStyle
                  rules={[{ required: true, message: 'Please input the Spender(address)!' }]}>
                  <Input disabled defaultValue={LOCK_ADDRESS} value={LOCK_ADDRESS}/>
                </Form.Item>
                <div>Authorize the lock in contract and input the authorized amount (the authorized token will be used for mortgage);
                  this step can be performed in the writecontract - approve operation on the
                  <a href={web3PluginInstance.tokenContractLink} target='_blank'> Ethereum Token Contract Page</a>
                </div>
              </Form.Item>

              <Form.Item
                label="Value"
                name="value"
                rules={[{ required: true, message: 'Please input the value!' }]}
              >
                <Input/>
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
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
          title='Step2: Mortgage'
          hoverable>
          <div className='section-content swap-form-container'>
            <Form
              {...layout}
              name="mortgage"
              initialValues={{spenderAddress: LOCK_ADDRESS}}
              onFinish={this.onMortgageFinish}
              onFinishFailed={this.onMortgageFinishFailed}
            >
              <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true, message: 'Amount is required.' }]}
              >
                <Input/>
              </Form.Item>

              <Form.Item
                label="aelf Receiver Address"
              >
                <Form.Item
                  name="address"
                  noStyle
                  rules={[{ required: true, message: 'aelf Receiver Address is required.' }]}
                >
                  <Input/>
                </Form.Item>
                <div>After completing the authorization, please provide the amount of the staked ELF (the amount should be no more than the authorized quantity) and the address for receiving aelf in the aelf testnet. After staked your ELF, your ELF will be locked and can only be redeemed from this page after one month. This step can be executed in the writecontract-createreceipt of the
                  <a href={web3PluginInstance.lockContractLink} target='_blank'> Ethereum Lock Contract Page</a>
                </div>
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
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
        <Card
          className='hover-cursor-auto'
          hoverable>
          <div className='section-content'>
            <InfoCircleFilled style={{
              color: 'orange'
            }} /> After staked ELF tokens, you can get the data used to swap tokens (LOT and ELF). You need to wait a while to get the data. You can check the data status in step 3.
          </div>
        </Card>

        <div className='next-card-blank'/>
        <SwapElf
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
          title='Step4: Redeem'
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
                name="receiptId"
                rules={[{ required: true, message: 'Receipt ID is required.' }]}
              >
                <Select
                  placeholder="Select a receipt ID"
                  allowClear
                  style={{ width: 300 }}
                >
                  {/*<Select.Option value={250} key={250}>250 invalid id</Select.Option>*/}
                  {receiptIds.map(receiptId => {
                    return <Select.Option value={receiptId.value} key={receiptId.value}>{receiptId.value}</Select.Option>
                  })}
                </Select>
                <div>
                  When the event is completed, the ELF can be redeemed by submitting the Lock Receipt ID. According to the time of the lock start, users can redeem ELF after one month. This step is available in the WriteContract-finishReceipt of the
                  <a href={web3PluginInstance.lockContractLink} target='_blank'> Ethereum Lock Contract Page</a>
                </div>
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
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
