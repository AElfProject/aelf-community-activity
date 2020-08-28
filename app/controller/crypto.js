const { Controller } = require('egg');
const formatOutput = require('../utils/formatOutput');

module.exports = class CryptoController extends Controller {
  async getCryptoDataFromAddress() {
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

      const result = await ctx.service.crypto.getCryptoDataFromAddress(options);
      formatOutput(ctx, 'get', result)
    } catch (error) {
      formatOutput(ctx, 'error', error, 422);
    }
  }

  async getDecryptedList() {
    const { ctx } = this;

    try {
      const { encryptedList } = ctx.request.body;
      const keyRule = {
        encryptedList: 'array'
      };

      const options = {
        encryptedList
      };
      ctx.validate(keyRule, options);

      const result = await ctx.service.crypto.getDecryptedList(options);
      formatOutput(ctx, 'get', result);
    } catch (error) {
      formatOutput(ctx, 'error', error, 422);
    }
  }
};
