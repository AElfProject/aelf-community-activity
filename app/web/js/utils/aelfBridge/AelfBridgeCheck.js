/**
 * @file AelfBridgeCheck
 * @author hzz780
 */
import {
  HTTP_PROVIDER,
  APPNAME,
} from '../../constant/constant';

import AElfBridge from 'aelf-bridge';

let aelfBridgeInstance = null;
// let aelfInstanceByExtension = null;
let aelfInstanceByBridge = null;
let contractInstances = {};

let accountInfo = null;

export default class AelfBridgeCheck {
  constructor() {
    // let resovleTemp = null;
    this.check = new Promise((resolve, reject) => {
      // TODO:
      resolve(true);
    });
    // document.addEventListener('NightElf', result => {
    //   resovleTemp(true);
    // });
  }
  static getInstance() {
    if (!aelfBridgeInstance) {
      aelfBridgeInstance = new AelfBridgeCheck();
      return aelfBridgeInstance;
    }
    return aelfBridgeInstance;
  }

  // For extension users
  static getAelfInstanceByExtension() {
    if (!aelfInstanceByBridge) {
      AelfBridgeCheck.resetContractInstances();
      // AelfBridgeCheck.initAelfInstanceByExtension();
      AelfBridgeCheck.initAelfInstanceByBridge();
    }
    return aelfInstanceByBridge;
  }

  static initAelfInstanceByExtension() {
  // static initAelfInstanceByBridge() {
    aelfInstanceByBridge = new AElfBridge({
      endpoint: HTTP_PROVIDER
    });

    // TODO: get once, storage in local storage.
    aelfInstanceByBridge.login = async () => {
      if (accountInfo) {
        return accountInfo;
      }
      const account = await aelfInstanceByBridge.account();
      accountInfo = {
        detail: JSON.stringify(account.accounts[0])
      };
      return accountInfo;
    };
    // aelfInstanceByBridge.logout = async () => {
    //   accountInfo = null;
    //   return true;
    // };
    aelfInstanceByBridge.logout = (param, callback) => {
      accountInfo = null;
      callback();
    };
    return aelfInstanceByBridge;
  }

  static resetContractInstances() {
    contractInstances = {};
  }

  // static async getContractInstance(inputInitParams) {
  //   const {loginInfo, contractAddress} = inputInitParams;
  //   await NightElfCheck.getInstance().check;
  //   const aelf = NightElfCheck.getAelfInstanceByExtension();
  //
  //   const accountInfo = await aelf.login(loginInfo);
  //   if (accountInfo.error) {
  //     throw Error(accountInfo.errorMessage.message || accountInfo.errorMessage);
  //   }
  //   const address = JSON.parse(accountInfo.detail).address;
  //
  //   await aelf.chain.getChainStatus();
  //
  //   if (contractInstances[contractAddress + address]) {
  //     return contractInstances[contractAddress + address];
  //   }
  //   return await NightElfCheck.initContractInstance(inputInitParams);
  // }

  // singleton to get, new to init
  // static async initContractInstance(inputInitParams) {
  //   const {loginInfo, contractAddress} = inputInitParams;
  //   await NightElfCheck.getInstance().check;
  //   const aelf = NightElfCheck.getAelfInstanceByExtension();
  //
  //   const accountInfo = await aelf.login(loginInfo);
  //   if (accountInfo.error) {
  //     throw Error(accountInfo.errorMessage.message || accountInfo.errorMessage);
  //   }
  //   const address = JSON.parse(accountInfo.detail).address;
  //
  //   await aelf.chain.getChainStatus();
  //
  //   const wallet = {
  //     address
  //   };
  //   // It is different from the wallet created by Aelf.wallet.getWalletByPrivateKey();
  //   // There is only one value named address;
  //   const contractInstance = await aelf.chain.contractAt(
  //     contractAddress,
  //     wallet
  //   );
  //   contractInstances[contractAddress + address] = contractInstance;
  //   return contractInstance;
  // }
}
