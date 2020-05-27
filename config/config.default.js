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
        host: '127.0.0.1',
        port: '3306',
        user: 'root',
        password: null,
        database: 'aelf_main_chain',
        charset: 'utf8mb4'
      }
    },
    // default config for the all database
    default: {}
  };

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    user: 'root',
    password: null,
    port: 3306,
    database: 'egg_sequelize_community_dev',
    charset: 'utf8mb4'
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
