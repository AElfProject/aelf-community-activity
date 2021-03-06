/**
 * @file utils/tokenContract.js
 * @author hzz780
 */
const AElf = require('aelf-sdk');
const {HTTP_PROVIDER_INNER, TOKEN_CONTRACT_ADDRESS} = require('../../config/config');
const { AWARD_PRIVATE} = require('../../config/config.forserveronly');
const Wallet = AElf.wallet;
const wallet = Wallet.getWalletByPrivateKey(AWARD_PRIVATE);

let tokenContractInstance;
module.exports = class tokenContract {
  static async getTokenContractInstance() {
    if (!tokenContractInstance) {
      const aelf = new AElf(new AElf.providers.HttpProvider(HTTP_PROVIDER_INNER));
      tokenContractInstance = await aelf.chain.contractAt(TOKEN_CONTRACT_ADDRESS, wallet);
    }
    return tokenContractInstance;
  }

  static async getBalance(tokenType = 'ELF') {
    return await tokenContractInstance.GetBalance.call({
      symbol: tokenType,
      owner: wallet.address
    });
  }
};
