import AElf from 'aelf-sdk';
import {HTTP_PROVIDER, COMMON_PRIVATE, SWAP_CONTRACT_ADDRESS } from '../constant/constant';

let swapContractInstance;
export default class SwapContract {

  async getSwapContractInstance() {
    if (!swapContractInstance) {
      await this.newSwapContractInstance();
    }
    return swapContractInstance;
  }

  async newSwapContractInstance() {
    const Wallet = AElf.wallet;
    const wallet = Wallet.getWalletByPrivateKey(COMMON_PRIVATE);
    const aelf = new AElf(new AElf.providers.HttpProvider(HTTP_PROVIDER));
    swapContractInstance = await aelf.chain.contractAt(SWAP_CONTRACT_ADDRESS, wallet);
    return swapContractInstance;
  }
}
