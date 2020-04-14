import React, {Component} from 'react';
import { Card } from 'antd';

// export default function renderWeb3Info(props) {
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
      }
    };
    this.connectMetaMask = this.connectMetaMask.bind(this);
    this.checkMetaMask = this.checkMetaMask.bind(this);
  }

  async componentDidMount() {
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevProps.web3PluginInstance.web3 && this.props.web3PluginInstance.web3 !== 'undefined') {
      await this.checkMetaMask();
      await this.getAccounts();
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
  }

  render() {
    const {connectOk, account} = this.state;

    const {web3PluginInstance} = this.props;
    window.web3PluginInstance2 = web3PluginInstance;
    console.log('web3PluginInstance', web3PluginInstance);
    return (
      <Card
        className='hover-cursor-auto'
        hoverable>
        <div className='section-content'>
          {
            web3PluginInstance.web3 === 'undefined'
            ? <a href='https://metamask.io/download.html' target='_blank'>Download MetaMask</a>
            : null
          }
          { account.address
            ? <div><b>ETH Address:</b> {account.address} &nbsp;&nbsp;&nbsp; <b>ELF Balance</b> {account.tokenBalance}</div>
            : null }
          { !account.address && web3PluginInstance.web3 && web3PluginInstance.web3 !== 'undefined'
          &&  <a onClick={this.connectMetaMask}>Connect to Web3</a>}
        </div>
      </Card>
    );
  }
}
