import AElf from 'aelf-sdk';
import {HTTP_PROVIDER, COMMON_PRIVATE, TOKEN_CONTRACT_ADDRESS } from '../constant/constant';

let tokenContractInstance;
export default class tokenContract {

  async getTokenContractInstance() {
    if (!tokenContractInstance) {
      await this.newTokenContractInstance();
    }
    return tokenContractInstance;
  }

  async newTokenContractInstance() {
    const Wallet = AElf.wallet;
    const wallet = Wallet.getWalletByPrivateKey(COMMON_PRIVATE);
    const aelf = new AElf(new AElf.providers.HttpProvider(HTTP_PROVIDER));
    tokenContractInstance = await aelf.chain.contractAt(TOKEN_CONTRACT_ADDRESS, wallet);
    return tokenContractInstance;
  }
}
