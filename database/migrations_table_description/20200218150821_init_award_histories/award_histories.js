// migrations是需要保留历史记录的，所有历史都要记录。
module.exports.awardHistories = function(Sequelize) {
  const {
    INTEGER,
    DATE,
    STRING,
    NOW
  } = Sequelize;
  return {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    end_time: {
      type: STRING(64),
      allowNull: false
    },
    address: {
      type: STRING(64),
      allowNull: false
    },
    tx_id: {
      type: STRING(64),
      unique: true,
      allowNull: false
    },
    award_id: {
      type: STRING(64),
      unique: true,
      allowNull: false
    },
    type: {
      type: STRING(16),
      allowNull: false
    },
    createdAt: {
      field: 'created_at',
      type: DATE,
      defaultValue: NOW,
      allowNull: false,
      comment: ''
    },
    updatedAt: {
      field: 'updated_at',
      type: DATE,
      defaultValue: NOW,
      allowNull: false,
      comment: ''
    }
  };
};
