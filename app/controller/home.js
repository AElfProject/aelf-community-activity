'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  // async index() {
  //   const { ctx } = this;
  //   ctx.body = 'hi, egg';
  // }

  async index() {
    await this.ctx.render('index.tpl', {
      // ...nodeConfig
    });
  }
}

module.exports = HomeController;
