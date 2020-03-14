'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },

  mysql: {
    enable: true,
    package: 'egg-mysql',
  },

  validate : {
    enable: true,
    package: 'egg-validate',
  }
};
