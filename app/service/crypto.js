const { Service } = require('egg');
const AElf = require('aelf-sdk');

const { AES_KEY } = require('../../config/config.forserveronly.json');

const Wallet = AElf.wallet;

module.exports = class Lottery extends Service {
  async getCryproDatafromAddress(options) {
    return {
      address: Wallet.AESEncrypt(options.address, AES_KEY)
    }
  }
}
