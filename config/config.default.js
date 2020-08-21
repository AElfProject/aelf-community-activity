/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1583224692890_1610';

  // add your middleware config here
  config.middleware = [];

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
  };

  config.mysql = {
    clients: {
      aelf0: {
        host: '192.168.197.43',
        // host: '127.0.0.1',
        port: '3306',
        user: 'root',
        password: 'root',
        // password: null,
        database: 'aelf_main_chain'
      },
      aelf1: {
        host: '192.168.197.52',
        // host: '127.0.0.1',
        port: '3306',
        user: 'root',
        password: 'root',
        // password: null,
        database: 'aelf_side2_chain'
      }
    },
    // default config for the all database
    default: {}
  };

  config.sequelize = {
    dialect: 'mysql',
    // host: '127.0.0.1',
    host: '192.168.197.43',
    user: 'root',
    // password: null,
    password: 'root',
    port: 3306,
    database: 'egg_sequelize_community_dev'
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
