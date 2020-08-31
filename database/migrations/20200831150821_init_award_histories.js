'use strict';

const {awardHistories} = require('../migrations_table_description/20200831150821_init_award_histories/award_histories');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // /*
    //   Add altering commands here.
    //   Return a promise to correctly handle asynchronicity.
    //
    //   Example:
    //   return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    // */
    // await queryInterface.createTable('award_histories', awardHistories(Sequelize));
    // await queryInterface.addIndex('award_histories', ['end_time', 'address']);

    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('award_histories', 'chain_id', {
          type: Sequelize.STRING
        }, { transaction: t })
      ])
    });
  },

  down: (queryInterface, Sequelize) => {
    // /*
    //   Add reverting commands here.
    //   Return a promise to correctly handle asynchronicity.
    //
    //   Example:
    //   return queryInterface.dropTable('users');
    // */
    return queryInterface.dropTable('award_histories');
  }
};
