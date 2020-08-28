const { Service } = require('egg');
const AElf = require('aelf-sdk');

const { AES_KEY } = require('../../config/config.forserveronly.json');

const Wallet = AElf.wallet;

module.exports = class Lottery extends Service {
  async getCryptoDataFromAddress(options) {
    return {
      address: Wallet.AESEncrypt(options.address, AES_KEY)
    }
  }

  async getDecryptedList(options) {
    const { encryptedList } = options;
    console.log('encryptedList， ', encryptedList);
    return encryptedList.map(item => {
      if (item) {
        try {
          return Wallet.AESDecrypt(item, AES_KEY) || item;
        } catch(e) {
          console.log(3);
          return item;
        }
      }
      return null;
    });
  }
};
