import Web3 from 'web3'
import {message} from 'antd';
import {merkleAbi, lockAbi, tokenAbi} from '../constant/web3Abi';
import {WEB3} from '../constant/constant';
import { add } from '../actions/counter';

const {TOKEN_ADDRESS, LOCK_ADDRESS, MERKLE_ADDRESS} = WEB3;

export class Web3Plugin {
  constructor() {
    this.currentNetwork = null;
    this.web3 = null;
    this.myAccounts = [];
    this.allowanceAmount = null;
    this.connectOk = false;
  }

  install() {
    let web3 = window.web3; // inject by browser extension
    if ((typeof web3 !== 'undefined' || typeof window.ethereum !== 'undefined') && window.ethereum.isMetaMask) {
      web3 = new Web3(web3.currentProvider);
    } else {
      web3 = 'undefined';
    }
    this.web3 = web3;
    return web3;
  }

  async init () {
    if (this.web3 === 'undefined') {
      message.warning('Please install metaMask');
      return;
    }

    this.getNetwork();

    const URL_PRE = 'https://' + this.currentNetwork + '.etherscan.io/address/';

    this.tokenContract = new this.web3.eth.Contract(tokenAbi, TOKEN_ADDRESS);
    this.tokenContractLink = URL_PRE + this.tokenAddress + '#writeContract';

    this.lockContract = new this.web3.eth.Contract(lockAbi, LOCK_ADDRESS);
    this.lockContractLink = URL_PRE + this.lockAddress + '#writeContract';

    this.merkleContract = new this.web3.eth.Contract(merkleAbi, MERKLE_ADDRESS);

    await this.getAccounts();
  }

  // 获取账户接收地址
  // async getCoinBase () {
  //   // try {
  //     return await this.web3.eth.getCoinbase();
  //   // } catch (e) {
  //     // return null;
  //     // this.$Message.error(e)
  //   // }
  // }

  async checkMetaMask (initMetaMask = true) {

    this.connectOk = false;
    if (this.web3 !== 'undefined') {
      const address = await this.web3.eth.getCoinbase();
      if (address) {
        initMetaMask && this.init();
        this.connectOk = true;
        // message.success('Web3 Wallet Connected.');
      }
    }
    if (!this.connectOk) {
      message.warning('Web3 Wallet connect failed, please check MetaMask and try again.');
    }
    return this.connectOk;
  }

  async connectMetaMask () {
    try {
      if (this.connectOk) {
        return
      }
      await window.ethereum.enable();
      this.connectOk = true;
      message.success('Web3 Wallet Connected.');
      this.init();
    } catch (e) {
      message.warning(e.message);
    }
  }

  // 获取所有账户
  async getAccounts () {
    try {
      const accounts = await this.web3.eth.getAccounts();
      const account = accounts[0];
      const balance = await this.web3.eth.getBalance(account);
      const tokenBalance = await this.tokenContract.methods.balanceOf(account)
        .call();
      const tokenName = await this.tokenContract.methods.name()
        .call();
      const myAccount = {
        'address': account,
        'balance': this.web3.utils.fromWei(balance, 'ether'),
        'tokenBalance': this.web3.utils.fromWei(tokenBalance, 'ether'),
        'tokenName': tokenName
      };
      this.myAccounts.push(myAccount);
      return this.myAccounts;
    } catch (e) {
      message.warning(e.message);
    }
  }

  async getAllowance () {
    // try {
    const allowance = await this.tokenContract.methods.allowance(this.myAccounts[0].address, LOCK_ADDRESS).call();
    this.allowanceAmount = this.web3.utils.fromWei(allowance, 'ether') + ' ELF'
    return allowanceAmount;
    // } catch (e) {
    //   console.log(e)
    // }
  }

  async getLockTokens () {
    // try {
    const lock = this.lockAmount = await this.lockContract.methods.getLockTokens(this.myAccounts[0].address).call();
    this.lockAmount = this.web3.utils.fromWei(lock, 'ether') + ' ELF';
    return lockAmount;
    // } catch (e) {
    //   console.log(e)
    // }
  }

  getNetwork () {
    switch (window.ethereum.networkVersion) {
      case '1' || 1:
        this.currentNetwork = 'ethereum';
        break;
      case '2' || 2:
        this.currentNetwork = 'morden';
        break;
      case '3' || 3:
        this.currentNetwork = 'ropsten';
        break;
      case '4' || 4:
        this.currentNetwork = 'rinkeby';
        break;
      case '5' || 5:
        this.currentNetwork = 'goerli';
        break;
      case '42' || 42:
        this.currentNetwork = 'kovan';
        break;
      default:
        this.currentNetwork = 'ethereum';
    }
  }
}
