/**
 * @file utils/lotteryContract.js
 * @author hzz780
 */
const AElf = require('aelf-sdk');
const {HTTP_PROVIDER_INNER, LOTTERY, COMMON_PRIVATE } = require('../../config/config');
const Wallet = AElf.wallet;
const wallet = Wallet.getWalletByPrivateKey(COMMON_PRIVATE);

let lotteryContractInstance;
module.exports = class lotteryContract {
  static async getLotteryContractInstance() {
    if (!lotteryContractInstance) {
      const aelf = new AElf(new AElf.providers.HttpProvider(HTTP_PROVIDER_INNER));
      lotteryContractInstance = await aelf.chain.contractAt(LOTTERY.CONTRACT_ADDRESS, wallet);
    }
    return lotteryContractInstance;
  }

  // static async getBoughtLotteries(options) {
  //   // const options = {
  //   //   owner: 'QGi1j393E2A3N1xG1yWPv5Mta8wNvX2owAngmu1aJ31RYc3da',
  //   //   period: 0,
  //   //   startId: -1
  //   // };
  //   return await lotteryContractInstance.GetBoughtLotteries.call(options);
  // }
  //
  // static async getAllLotteriesCount() {
  //   return lotteryContractInstance.GetAllLotteriesCount.call();
  // }
};
