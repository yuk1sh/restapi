import { DataTypes } from 'sequelize';
const dbConfig = require('../config');

const users = dbConfig.define('users', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  },
  passhash: {
    type: DataTypes.UUID
  }
}, {
  timestamps: false,
  freezeTableName: true
});

module.exports = users;