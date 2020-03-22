import AElf from 'aelf-sdk';
import {HTTP_PROVIDER, COMMON_PRIVATE } from '../constant/constant';

let contractInstances = {};
export default class Contract {

  async getContractInstance(contractAddress) {
    let contractInstance = contractInstances[contractAddress];
    if (!contractInstance) {
      contractInstance = await this.newContractInstance(contractAddress);
    }
    return contractInstance;
  }

  async newContractInstance(contractAddress) {
    const Wallet = AElf.wallet;
    const wallet = Wallet.getWalletByPrivateKey(COMMON_PRIVATE);
    const aelf = new AElf(new AElf.providers.HttpProvider(HTTP_PROVIDER));
    const contractInstance = await aelf.chain.contractAt(contractAddress, wallet);
    contractInstances[contractAddress] = contractInstance;
    return contractInstance;
  }
}
