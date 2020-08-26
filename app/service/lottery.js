/**
 * @file service/txs.js
 * @author hzz780
 * 2020.03
 */
const {
  Service
} = require('egg');

const lotteryUtil = require('../utils/lotteryUtil');

module.exports = class LotteryService extends Service {

  async getBoughtLotteries(options) {
    const lotteryUtilInstance = lotteryUtil.getLotteryUtilInstance();

    const data = await lotteryUtilInstance.getBoughtLotteriesOfAddress({ owner: options.owner });
    return data;

    // const periodNumber = await lotteryContractInstance.GetCurrentPeriodNumber.call();
    // const currentPeriodNumber = periodNumber.value;

    // const getBoughtLotteriesPromises = [];
    // for (let period = 0; period < currentPeriodNumber; period++) {
    //   console.log('period:', period);
    //   getBoughtLotteriesPromises.push(lotteryContractInstance.GetBoughtLotteries.call({
    //     owner: options.owner,
    //     period: period,
    //     startId: -1
    //   }));
    // }
    //
    // const lotteries = await Promise.all(getBoughtLotteriesPromises);
    //
    // const totalBoughtCount = lotteries.reduce((previousValue, currentValue) => {
    //   // console.log('test: ', typeof previousValue, previousValue, currentValue);
    //   const currentLength = currentValue ? currentValue.lotteries.length : 0;
    //   if (typeof previousValue === 'number') {
    //     return previousValue + currentLength;
    //   }
    //   const previousLength = previousValue ? previousValue.lotteries.length : 0;
    //   // const currentLength = currentValue ? currentValue.length : 0;
    //   return previousLength + currentLength;
    // });

    // return {
    //   totalBoughtCount,
    //   lotteries
    // };
  }
};
