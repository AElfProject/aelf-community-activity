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
const {HTTP_PROVIDER_INNER, CHAIN, DAILY} = require('../../config/config.json');

const tokenContract = require('../utils/tokenContract');

const aelfList = {};
Object.keys(CHAIN).forEach(chainID => {
  const keyName = chainID.toLowerCase();
  aelfList[keyName] = new AElf(new AElf.providers.HttpProvider(CHAIN[chainID].HTTP_PROVIDER_INNER));
});

const whiteListType = ['token', 'resource'];

function checkTimeIsEffective(time) {
  const startTime = moment.utc().startOf('day');
  const timeNow =  moment.utc();
  return moment.utc(time).isBetween(startTime, timeNow);
}

module.exports = class TxsService extends Service {

  async getEffectiveTx(options) {
    const {
      address,
      type
    } = options;

    const sqlValue = [ address, 'Mined' ];
    const getTokenTxSql = 'select * from transactions_token where address_from=? and tx_status=? order by id DESC limit 1';
    const getResourceTxSql = 'select * from resource_0 where address=? and tx_status=? order by id DESC limit 1';

    const getSql = type === 'resource' ? getResourceTxSql : getTokenTxSql;

    const queryList = [];
    this.ctx.app.mysql.clients.forEach(client => {
      queryList.push(client.query(getSql, sqlValue))
    });
    const txResults = await Promise.all(queryList);
    // console.log('keys:', this.ctx.app.mysql.clients.keys(), Array.from(this.ctx.app.mysql.clients.keys()));
    return txResults.find(txResult => {
      if (txResult.length) {
        return checkTimeIsEffective(txResult[0].time);
      }
    });
  }

  async getAward(options) {
    const {ctx} = this;
    const {
      address, tx_id, type, chain_id
    } = options;

    if (!whiteListType.includes(type)) {
      throw Error('Invalid type');
    }

    const tokenContractInstance = await tokenContract.getTokenContractInstance();
    const balanceResult = await tokenContract.getBalance(DAILY.SYMBOL);
    // avoid 20 person get award at the same time.
    if (balanceResult && balanceResult.balance <= 20 * 101 * 10 ** 8 ) {
      throw Error(`Insufficient ${DAILY.SYMBOL}, please report in telegram.`);
    }

    const endTime = moment.utc().endOf('day').unix();

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

    const chainId = chain_id.toLowerCase();
    const resultTemp = await aelfList[chainId].chain.getTxResult(tx_id);

    if (resultTemp.Status && resultTemp.Status.toLowerCase() !== 'mined') {
      throw Error('Transaction has not been mined.');
    }

    if (resultTemp.Transaction.From !== address) {
      throw Error(`Transaction ${tx_id} is not belongs to ${address}. It belongs to ${resultTemp.Transaction.From}`);
    }

    const blockTemp = await aelfList[chainId].chain.getBlock(resultTemp.BlockHash, false);
    const txTime = moment.utc(blockTemp.Header.Time).unix();
    if (endTime - txTime < 0) {
      throw Error('Current round is over.');
    }

    const transferTxId = await tokenContractInstance.Transfer({
      symbol: DAILY.SYMBOL, //'ELF',
      amount: DAILY.AMOUNT, // 100 * 10 ** 8,
      memo: type + ' award',
      to: address
    });

    await ctx.model.AwardHistories.create({
      end_time: endTime,
      address,
      type,
      tx_id,
      award_id: transferTxId.TransactionId,

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
