/**
 * @file service/txs.js
 * @author hzz780
 * 2020.03
 */
const {
  Service
} = require('egg');

const lotteryUtil = require('../utils/lotteryUtil');

const lotteryContract = require('../utils/lotteryContract');

module.exports = class LotteryService extends Service {

  async getBoughtLotteries(options) {
    const lotteryUtilInstance = lotteryUtil.getLotteryUtilInstance();

    return await lotteryUtilInstance.getBoughtLotteriesOfAddress({ owner: options.owner });
  }

  async getStakeList(options) {
    const {offset, limit, share} = options;

    const aelf0 = this.ctx.app.mysql.get('aelf0');

    const sqlValue = [ limit, offset ];
    const getTxsSql = `select DISTINCT(address_from) from transactions_0 where method='Stake' limit ? offset ?`;

    const txs = await aelf0.query(getTxsSql, sqlValue);

    const lotteryContractInstance = await lotteryContract.getLotteryContractInstance();

    const stakingTotal = await lotteryContractInstance.GetStakingTotal.call();
    const totalAmount = stakingTotal.value;

    const queryList = txs.map(item => {
      return Promise.all([
        item.address_from,
        lotteryContractInstance.GetStakingAmount.call(item.address_from)
          .then(result => result.value).catch(() => -1),
        lotteryContractInstance.GetRegisteredDividend.call(item.address_from)
          .then(result => result.receiver).catch(() => 'error'),
      ]);
    });
    const result = await Promise.all(queryList);
    const output = result.map(item => {
      return [
        item[0],
        item[1] !== -1 ? item[1] / (10**8) : 'error',
        item[2],
        item[1] / totalAmount,
        share * item[1] / totalAmount
      ];
    });

    return {
      result: output
    };
  }
};
