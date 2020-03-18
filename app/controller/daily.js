/**
 * @file controller/daily.js
 * @author hzz780
 * 2020.03
 */

const { Controller } = require('egg');
const moment = require('moment');
const formatOutput = require('../utils/formatOutput.js');

module.exports = class DailyController extends Controller {

  async getCountdownTime() {
    const { ctx } = this;
    try {
      const time = moment().endOf('day').unix() - moment().unix();
      formatOutput(ctx, 'get', time);
    } catch (error) {
      formatOutput(ctx, 'error', error, 422);
    }
  }

  async getAward() {
    const { ctx } = this;
    const { address, tx_id, type } = ctx.request.query;
    try {

      const keysRule = {
        address: 'string',
        tx_id: 'string',
        type: 'string',
      };
      const options = {
        address, tx_id, type
      };
      ctx.validate(keysRule, options);

      const result = await ctx.service.daily.getAward(options);
      formatOutput(ctx, 'get', result);
    } catch (error) {
      formatOutput(ctx, 'error', error, 422);
    }
  }
};
