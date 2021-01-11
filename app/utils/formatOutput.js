/**
 * @file utils/formatOutput.js
 * @author huangzongzhe
 * @type {formatOutput}
 */
module.exports = formatOutput;

function formatOutput(ctx, type, result, errcode) {
  switch (type) {
    case 'get':
      ctx.status = 200;
      break;
    case 'post':
      ctx.status = 201;
      break;
    case 'put':
      ctx.status = 200;
      break;
    case 'error':
      ctx.status = parseInt(errcode, 10);
      result = {
        message: result.message || result
      };
      break;
    default:
  }
  ctx.body = result;
}
