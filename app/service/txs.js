/**
 * @file service/txs.js
 * @author hzz780
 * 2020.03
 */
const {
  Service
} = require('egg');

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
};
