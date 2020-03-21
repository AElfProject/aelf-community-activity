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

function checkTimeIsEffective(time) {
  const startTime = moment().startOf('day');
  const timeNow =  moment();
  return moment(time).isBetween(startTime, timeNow);
}

module.exports = class TxsService extends Service {

  async getEffectiveTx(options) {
    const aelf0 = this.ctx.app.mysql.get('aelf0');
    const {
      address,
      type
    } = options;

    const sqlValue = [ address, 'Mined' ];
    const getTokenTxSql = 'select * from transactions_token where address_from=? and tx_status=? order by id DESC limit 1';
    const getResourceTxSql = 'select * from resource_0 where address=? and tx_status=? order by id DESC limit 1';

    const getSql = type === 'resource' ? getResourceTxSql : getTokenTxSql;
    const txResult = await aelf0.query(getSql, sqlValue);

    if (!txResult.length) {
      return [];
    }

    const isEffective = checkTimeIsEffective(txResult[0].time);

    return  isEffective ? txResult : [];
  }

  async getAward(options) {
    const {ctx} = this;
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

    if (resultTemp.Transaction.From !== address) {
      throw Error(`Transaction ${tx_id} is not belongs to ${address}. It belongs to ${resultTemp.Transaction.From}`);
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
      tx_id,
      award_id: transferTxId.TransactionId
    });

    return transferTxId;
  }

  async getAwardHistory(options) {
    const {ctx} = this;
    const {
      address,
      limit,
      offset,
      order
    } = options;

    return await ctx.model.AwardHistories.findAll({
      where: {
        address
      },
      order: [['id', order]],
      limit,
      offset
    });
  }
};
