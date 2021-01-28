import AElf from 'aelf-sdk';
import {HTTP_PROVIDER, COMMON_PRIVATE, MERKLE_TREE_RECORDER } from '../constant/constant';

let merkleTreeRecorderContractInstance;
export default class MerkleTreeRecorderContract {

  async getMerkleTreeRecorderInstance() {
    if (!merkleTreeRecorderContractInstance) {
      await this.newMerkleTreeRecorderInstance();
    }
    return merkleTreeRecorderContractInstance;
  }

  async newMerkleTreeRecorderInstance() {
    const Wallet = AElf.wallet;
    const wallet = Wallet.getWalletByPrivateKey(COMMON_PRIVATE);
    const aelf = new AElf(new AElf.providers.HttpProvider(HTTP_PROVIDER));
    merkleTreeRecorderContractInstance = await aelf.chain.contractAt(MERKLE_TREE_RECORDER, wallet);
    return merkleTreeRecorderContractInstance;
  }
}
