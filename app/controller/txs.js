/**
 * @file controller/txs.js
 * @author hzz780
 * 2020.03
 */

const { Controller } = require('egg');
const formatOutput = require('../utils/formatOutput.js');
const { EXPORT_FILE_TOKEN } = require('../../config/config.forserveronly.json');

module.exports = class TxsController extends Controller {

  async getSwapHistory() {
    const { ctx } = this;
    try {
      const { method, address_from, order, limit, offset } = ctx.request.query;
      const keysRule = {
        method: 'string',
        address_from: 'string',
        order: 'string',
        limit: 'int',
        offset: 'int',
      };
      const options = {
        method,
        address_from,
        order: order || 'DESC',
        limit: parseInt(limit, 10) || 100,
        offset: parseInt(offset, 10) || 0
      };
      ctx.validate(keysRule, options);

      const result = await ctx.service.txs.getSwapHistory(options);
      formatOutput(ctx, 'get', result);

    } catch (error) {
      formatOutput(ctx, 'error', error, 422);
    }
  }

  async exportPeriodInfoFile() {
    const { ctx } = this;

    try {
      const { token } = ctx.request.query;
      if (token !==  EXPORT_FILE_TOKEN) {
        throw new Error('Token verification error！')
      }
      const result = await ctx.service.txs.exportPeriodInfoFile();
      this.ctx.attachment('开奖信息.xlsx');
      this.ctx.set('Content-Type', 'application/octet-stream');

      formatOutput(ctx, 'get', result);
    } catch (error) {
      formatOutput(ctx, 'error', error, 422);
    }
  }
};
