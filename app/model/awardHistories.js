const { awardHistories } = require('../../database/migrations_table_description/20200218150821_init_award_histories/award_histories');

module.exports = app => app.model.define('award_histories', awardHistories(app.Sequelize));
