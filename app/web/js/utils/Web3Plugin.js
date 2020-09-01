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

    const etherscanPrefix = this.currentNetwork === 'ethereum' ? '' : this.currentNetwork +'.';
    const URL_PRE = 'https://' + etherscanPrefix + 'etherscan.io/address/';

    this.tokenContract = new this.web3.eth.Contract(tokenAbi, TOKEN_ADDRESS);
    this.tokenContractLink = URL_PRE + TOKEN_ADDRESS + '#writeContract';

    this.lockContract = new this.web3.eth.Contract(lockAbi, LOCK_ADDRESS);
    this.lockContractLink = URL_PRE + LOCK_ADDRESS + '#writeContract';

    this.merkleContract = new this.web3.eth.Contract(merkleAbi, MERKLE_ADDRESS);
    this.merkleContractLink = URL_PRE + MERKLE_ADDRESS + '#readContract';

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
    if (!this.connectOk && initMetaMask) {
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
      await this.init();
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
      return;
    }
  }

  // send类方法必须有to，否则交易会变成创建合约
  // 还必须有gas，否则交易gas要么不足要么超出，注意gas的估算写法
  async sendTx (transaction, from, to) {
    return new Promise(async (resolve, reject) => {
      try {
        const gas = await this.web3.eth.estimateGas({ from: from, to: to, data: transaction.encodeABI() });
        const options = {
          from,
          to,
          gas
        };
      transaction.send(options)
        .on('receipt', receipt => resolve(receipt))
        .on('error', err => reject(err));
      } catch(e) {
        reject(e);
      }
    });
  }

  async approve (approveValue) {
      // this.showApproveWaitting = true;
      const from = this.myAccounts[0].address;
      const to = TOKEN_ADDRESS;
      const transaction = this.tokenContract.methods.approve(
        LOCK_ADDRESS,
        this.web3.utils.toWei(approveValue.toString(), 'ether')
      );

      // let sucessFn = function (receipt) {
      //   self.showApproveWaitting = false;
      //   self.approveTxHash = receipt.transactionHash;
      //   self.approveTxHashLink = 'https://' + this.currentNetwork + '.etherscan.io/tx/' + receipt.transactionHash;
      //   // 更新授权额度
      //   self.getAllowance()
      // }
      // let failFn = function (err) {
      //   self.showApproveWaitting = false
      //   self.$Modal.warning({
      //     title: '授权失败',
      //     content: err
      //   })
      // }
      return this.sendTx(transaction, from, to);
  }

  async createReceipt (mortgageData) {
    const {amount, address} = mortgageData;

    let from = this.myAccounts[0].address;
    let to = LOCK_ADDRESS;
    let transaction = this.lockContract.methods.createReceipt(
      this.web3.utils.toWei(amount.toString(), 'ether'),
      address // target address
    );

    // let sucessFn = function (receipt) {
    //   self.showCreateReceiptWaitting = false
    //   self.createReceiptTxHash = receipt.transactionHash
    //   self.createReceiptTxHashLink = 'https://' + self.currentNetwork + '.etherscan.io/tx/' + receipt.transactionHash
    //   // 更新抵押额度
    //   self.getLockTokens()
    //   self.getAllowance()
    // }
    // let failFn = function (err) {
    //   self.showCreateReceiptWaitting = false
    //   self.$Modal.warning({
    //     title: '抵押失败',
    //     content: err
    //   })
    // }
    return this.sendTx(transaction, from, to);
  }

  async getMyReceiptIds (address) {
    let ids = await this.lockContract.methods.getMyReceipts(address).call();
    let temp = [];
    ids.forEach((v, i) => {
      temp.push({'text': v, 'value': v})
    });
    return temp;
    // this.formRedeem.receiptIds = temp;
    // this.formRedeem.receiptId = ids[ids.length - 1];
  }

  async execRedeem (redeemData) {
    let res = await this.lockContract.methods.receipts(redeemData.receiptId).call();
    if (!res) {
      throw Error('Invalid receipt ID');
    }
    if (res.finished) {
      throw Error('Your ELF tokens has already been redeemed.');
    }
    console.log('res.endTime, ', res);
    if (res.endTime * 1000 > Date.parse(new Date())) {
      throw Error('Not ready to redeem, time of redemption: ' + new Date(res.endTime * 1000).toLocaleString());
    }

    let from = this.myAccounts[0].address;
    let to = LOCK_ADDRESS;
    let transaction = this.lockContract.methods.finishReceipt(redeemData.receiptId);

    return this.sendTx(transaction, from, to);
  }

  async getReceiptInfo (id) {
    return await this.lockContract.methods.getReceiptInfo(id).call();
    // receiverAddress = info[1]
    // mapUniqueId = info[0]
    // originAmount = info[2]
  }

  async getMerklePathInfo (id) {
    return await this.merkleContract.methods.GenerateMerklePath(id).call();
    // merkleBytes = info[0]
    // merkleBool = info[1]
  }

  async getAllowance () {
    // try {
    const allowance = await this.tokenContract.methods.allowance(this.myAccounts[0].address, LOCK_ADDRESS).call();
    this.allowanceAmount = this.web3.utils.fromWei(allowance, 'ether'); // + ' ELF';
    return this.allowanceAmount;
    // } catch (e) {
    //   console.log(e)
    // }
  }

  async getLockTokens () {
    // try {
    const lock = this.lockAmount = await this.lockContract.methods.getLockTokens(this.myAccounts[0].address).call();
    this.lockAmount = this.web3.utils.fromWei(lock, 'ether'); // + ' ELF';
    return this.lockAmount;
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
