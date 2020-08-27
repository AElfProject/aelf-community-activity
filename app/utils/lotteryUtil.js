const lotteryContract = require('./lotteryContract');

let lotteryUtilInstance;

module.exports = class LotteryUtil {
  static getLotteryUtilInstance() {
    if (!lotteryUtilInstance) {
      lotteryUtilInstance = new LotteryUtil();
    }

    return lotteryUtilInstance;
  }

  async getBoughtLotteriesOfAddress(options = {}) {
    const period =  options.period || 0;
    const startId = options.startId || -1;

    const lotteryContractInstance = await lotteryContract.getLotteryContractInstance();
    const data = await lotteryContractInstance.GetBoughtLotteries.call({
      owner: options.owner,
      period,
      startId,
    });

    const allLotteriesCount = await lotteryContractInstance.GetAllLotteriesCount.call();

    const result = {
      period,
      currentAddress: data ? data.lotteries.length : 0,
      total: parseInt(allLotteriesCount.value, 10)
    }

    return result;
  }

  async getCurrentPeroidNumber() {
    const lotteryContractInstance = await lotteryContract.getLotteryContractInstance();
    const { value } = await lotteryContractInstance.GetCurrentPeriodNumber.call();
    return value || 0;
  }

  async getRewardResultByPeriod(period) {
    const lotteryContractInstance = await lotteryContract.getLotteryContractInstance();
    const result = await lotteryContractInstance.GetRewardResult.call({
      value: period
    })

    return result;
  }

  async getRewardResultByPeriods(startPeriod, endPeriod) {
    const promiseList = [];
    const result = []
    for (let i = startPeriod; i < endPeriod; i++ ) {
      promiseList.push(this.getRewardResultByPeriod(i));
    }

    const data = await Promise.all(promiseList);

    data.forEach(item => {
      item.rewardLotteries.forEach(rewardItem => {
        rewardItem.period = item.period;
        rewardItem.randomHash = item.randomHash;

        result.push(rewardItem);
      });
    });

    return result;
  }
}