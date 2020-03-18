/**
 * @file utils/tokenContract.js
 * @author hzz780
 */
const AElf = require('aelf-sdk');
const {HTTP_PROVIDER_INNER, TOKEN_CONTRACT_ADDRESS, AWARD_PRIVATE} = require('../../config/config');
const Wallet = AElf.wallet;
const wallet = Wallet.getWalletByPrivateKey(AWARD_PRIVATE);

let tokenContractInstance;
module.exports = class tokenContract {
  static async getTokenContractInstance() {
    if (!tokenContractInstance) {
      const aelf = new AElf(new AElf.providers.HttpProvider(HTTP_PROVIDER_INNER));
      tokenContractInstance = await aelf.chain.contractAt(TOKEN_CONTRACT_ADDRESS, wallet);
    }
    return tokenContract;
  }

  static async getBalance(tokenType = 'ELF') {
    return await tokenContract.GetBalance.call({
      symbol: tokenType,
      owner: wallet.address
    });
  }
};
