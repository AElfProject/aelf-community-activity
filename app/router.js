'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/api/swap/history', controller.txs.getSwapHistory);

  router.get('/api/daily/count-down-time', controller.daily.getCountdownTime);
  router.get('/api/daily/award-id', controller.daily.getAward);
  router.get('/api/daily/effective-tx', controller.daily.getEffectiveTx);
  router.get('/api/daily/award-history', controller.daily.getAwardHistory);

  router.get('/api/lottery/bought-lotteries', controller.lottery.getBoughtLotteries);

  router.get('/api/crypto/cryptoAddress', controller.crypto.getCryproDatafromAddress);
};
