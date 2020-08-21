const { Controller } = require('egg');
const formatOutput = require('../utils/formatOutput');

module.exports = class CryptoController extends Controller {
  async getCryproDatafromAddress() {
    const { ctx } = this;

    try {
      const { address } = ctx.request.query;
      const keyRule = {
        address: 'string'
      };

      const options = {
        address
      };
      ctx.validate(keyRule, options);

      const result = await ctx.service.crypto.getCryproDatafromAddress(options);
      formatOutput(ctx, 'get', result)
    } catch (error) {
      formatOutput(ctx, 'error', error, 422);
    }
  }
}