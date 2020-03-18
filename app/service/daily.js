import { HTTP_PROVIDER } from '../web/js/constant/constant';
import { add } from '../web/js/actions/counter';

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
const {HTTP_PROVIDER_INNER,} = require('../../config/config');

const tokenContract = require('../utils/tokenContract');
const aelf = new AElf(new AElf.providers.HttpProvider(HTTP_PROVIDER_INNER));

module.exports = class TxsService extends Service {

  async getAward(options) {
    const aelf0 = this.ctx.app.mysql.get('aelf0');
    const {
      address, tx_id, type
    } = options;

    const tokenContractInstance = tokenContract.getTokenContractInstance();
    const balanceResult = tokenContract.getBalance();
    if (balanceResult && balanceResult.balance <= 101 * 10 ** 8 ) {
      throw Error('Insufficient ELF, please report in telegram.');
    }

    const endTime = moment().endOf('day').unix();
    // TODO: check record
    const sqlValue = [endTime, address, type];
    const getHistorySql = `select * from award_history where end_time=? and address=? and type=?`;
    const history = await aelf0.query(getHistorySql, sqlValue);
    if (history.length) {
      throw Error('Already award, type: ' + type);
    }

    const resultTemp = await aelf.chain.getTxResult(tx_id);
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

    const insertSqlValue = [endTime, address, type, tx_id];
    const insertHistorySql = `insert into award_history (end_time, address, type, tx_id) VALUES (?,?,?,?)`;
    await aelf0.query(insertHistorySql, insertSqlValue);

    return transferTxId;
  }
};
