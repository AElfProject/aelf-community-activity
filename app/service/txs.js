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
const { AES_KEY } = require('../../config/config.forserveronly.json');
const { CMS } = require('../../config/config.json');
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

  async exportPeroidInfoFile() {
    const aelf0 = this.ctx.app.mysql.get('aelf0');
    
    // Get the addresses of all participating events
    const getPrizeAmountDetailSql = `select distinct address_from from transactions_0 where address_to='2WHXRoLRjbUTDQsuqR5CntygVfnDb125qdJkudev4kVNbLhTdG' and method='Buy';`
    const addressFormResult = await aelf0.query(getPrizeAmountDetailSql);
    const address = addressFormResult.map(item => item.address_from);
    
    const lotteryUtilInstance = lotteryUtil.getLotteryUtilInstance();
    const currentPeriod = await lotteryUtilInstance.getCurrentPeroidNumber();
    // get preoid list from 0 to lastPeriod
    const periodInfoArr = await lotteryUtilInstance.getRewardResultByPeriods(1, parseInt(currentPeriod, 10));

    // grand prize data list 
    const grandPrizeDataList = [];
    const { grandPrizeAmount } = (await this.ctx.curl(`${CMS}/community-lotteries`, { method: 'GET', dataType: 'json' })).data[0];
    // Get the weight of each address
    for (const item of address)  {
      const lotteryData = await lotteryUtilInstance.getBoughtLotteriesOfAddress({
        owner: item
      });

      const grandItem = {
        address: item,
        period: lotteryData.period,
        present: (lotteryData.currentAddress / lotteryData.total * 100).toFixed(2),
        prizeAmount: (lotteryData.currentAddress / lotteryData.total * grandPrizeAmount).toFixed(2)
      }

      grandPrizeDataList.push(grandItem);
    }

    const wb = utils.book_new();

    // add grand prize into excel
    const grandPrizeWs = utils.json_to_sheet(grandPrizeDataList);
    utils.book_append_sheet(wb, grandPrizeWs, `终极大奖详情`);

    periodInfoArr.forEach(item => {
      item.registrationInformation = Wallet.AESDecrypt(item.registrationInformation, AES_KEY)
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
