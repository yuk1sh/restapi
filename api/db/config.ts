import { Sequelize } from 'sequelize';

const user = 'yuki'
const host = 'db'
const database = 'api'
const password = 'password'
// PostgreSQL用のサーバのポート
const port = 5432

const dbConfig = new Sequelize(database, user, password, {
  host,
  port,
  dialect: 'postgres',
  logging: false,
	pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

module.exports = dbConfig;