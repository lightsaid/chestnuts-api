
const Database = require('better-sqlite3');

// 从根目录开始
const db = new Database('./db_chestnuts.db', { verbose: console.log });

const userDao = require('./userDao')

module.exports = {
    UserDao: new userDao(db)
}