/**
 * @file service/txs.js
 * @author hzz780
 * 2020.03
 */
const {
  Service
} = require('egg');
const AElf = require('aelf-sdk');
const moment = require('moment');
const {HTTP_PROVIDER_INNER,} = require('../../config/config.json');

const tokenContract = require('../utils/tokenContract');
const aelf = new AElf(new AElf.providers.HttpProvider(HTTP_PROVIDER_INNER));

const whiteListType = ['token', 'resource'];

module.exports = class TxsService extends Service {

  async getAward(options) {
    const {ctx} = this;
    const aelf0 = this.ctx.app.mysql.get('aelf0');
    const {
      address, tx_id, type
    } = options;

    if (!whiteListType.includes(type)) {
      throw Error('Invalid type');
    }

    const tokenContractInstance = await tokenContract.getTokenContractInstance();
    const balanceResult = await tokenContract.getBalance();
    // avoid 50 person get award at the same time.
    if (balanceResult && balanceResult.balance <= 50 * 101 * 10 ** 8 ) {
      throw Error('Insufficient ELF, please report in telegram.');
    }

    const endTime = moment().endOf('day').unix();

    const history = await ctx.model.AwardHistories.findOne({
      where: {
        end_time: endTime,
        address,
        type
      }
    });

    if (history && history.dataValues) {
      throw Error('Already award, type: ' + type + ' tx_id: ' + history.dataValues.tx_id);
    }

    const resultTemp = await aelf.chain.getTxResult(tx_id);

    if (resultTemp.Status && resultTemp.Status.toLowerCase() !== 'mined') {
      throw Error('Transaction has not been mined.');
    }

    const blockTemp = await aelf.chain.getBlock(resultTemp.BlockHash, false);
    const txTime = moment(blockTemp.Header.Time).unix();
    if (endTime - txTime < 0) {
      throw Error('Current round is over.');
    }

    const transferTxId = await tokenContractInstance.Transfer({
      symbol: 'ELF',
      amount: 100 * 10 ** 8,
      memo: type + ' award',
      to: address
    });

    await ctx.model.AwardHistories.create({
      end_time: endTime,
      address,
      type,
      tx_id
    });

    return transferTxId;
  }
};
