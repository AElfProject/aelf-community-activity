/**
 * @file service/txs.js
 * @author hzz780
 * 2020.03
 */
const {
  Service
} = require('egg');
const AElf = require('aelf-sdk');
const XLSX = require('xlsx');

const lotteryUtil = require('../utils/lotteryUtil');
const { AES_KEY, EXPORT_FILE_FORM_SQL, CMS } = require('../../config/config.forserveronly.json');
const { LOTTERY } = require('../../config/config.json');
const Wallet = AElf.wallet;

const { utils } = XLSX;

module.exports = class TxsService extends Service {
  async getSwapHistory(options) {
    const aelf0 = this.ctx.app.mysql.get('aelf0');
    const {
      method,
      address_from,
      order,
      limit,
      offset,
    } = options;

    if ([ 'DESC', 'ASC', 'desc', 'asc' ].indexOf(order) > -1) {

      const sqlValue = [ method, address_from, limit, offset ];
      const getTxsSql = `select * from transactions_0 where method=? and address_from=? ORDER BY id ${order} limit ? offset ?`;

      const txs = await aelf0.query(getTxsSql, sqlValue);

      return {
        txs
      };
    }
    return '(￣ε(#￣)☆╰╮(￣▽￣///)';
  }

  async exportPeriodInfoFile() {
    const mysql = this.ctx.app.mysql.get(EXPORT_FILE_FORM_SQL);

    // Get the addresses of all participating events
    const getPrizeAmountDetailSql = `select distinct address_from from transactions_0 where address_to=? and method='Buy';`
    const addressFormResult = await mysql.query(getPrizeAmountDetailSql, LOTTERY.CONTRACT_ADDRESS);
    const address = addressFormResult.map(item => item.address_from);

    const lotteryUtilInstance = lotteryUtil.getLotteryUtilInstance();
    const currentPeriod = await lotteryUtilInstance.getCurrentPeroidNumber();
    // get preoid list from 0 to lastPeriod
    const periodInfoArr = await lotteryUtilInstance.getRewardResultByPeriods(1, parseInt(currentPeriod, 10));

    // grand prize data list
    const grandPrizeDataList = [];
    const { grandPrizeAmount } = (await this.ctx.curl(`${CMS}/community-lotteries`, { method: 'GET', dataType: 'json' })).data[0];
    const lotteryDataPromise = [];
    // Get the weight of each address
    for (const item of address)  {
      lotteryDataPromise.push(lotteryUtilInstance.getBoughtLotteriesOfAddress({
        owner: item
      }));
    }

    const lotteryData = await Promise.all(lotteryDataPromise);
    lotteryData.forEach((item, index) => {
      const grandItem = {
        address: address[index],
        period: item.period,
        present: (item.currentAddress / item.total * 100).toFixed(2),
        prizeAmount: (item.currentAddress / item.total * grandPrizeAmount).toFixed(2)
      };

      grandPrizeDataList.push(grandItem);
    });

    const wb = utils.book_new();

    // add grand prize into excel
    const grandPrizeWs = utils.json_to_sheet(grandPrizeDataList);
    utils.book_append_sheet(wb, grandPrizeWs, `终极大奖详情`);
    periodInfoArr.forEach(item => {
      if (!item) {
        return;
      }
      try {
        item.registrationInformation_descrypt = Wallet.AESDecrypt(item.registrationInformation, AES_KEY);
      } catch(e) {
        item.registrationInformation_descrypt = 'Decrypt data failed.';
      }
    });

    // add every period info into excel
    for (let i = 1; i < parseInt(currentPeriod, 10); i++) {
      const periodWs = utils.json_to_sheet(periodInfoArr.filter(item => parseInt(item.period) === i));
      utils.book_append_sheet(wb, periodWs, `period ${i}`);
    }

    // Generate xlsx file stream
    return XLSX.write(wb, {
      bookType: 'xlsx',
      type:  'buffer'
    });
  }
};
