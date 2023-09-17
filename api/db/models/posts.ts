import { DataTypes } from 'sequelize';
const dbConfig = require('../config');

const posts = dbConfig.define('posts', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV1,
    primaryKey: true
  },
  userid: {
    type: DataTypes.UUID
  },
  text: {
    type: DataTypes.STRING
  },
  reply_to: {
    type: DataTypes.UUID
  }
}, {
  timestamps: false,
  freezeTableName: true
});

module.exports = posts;