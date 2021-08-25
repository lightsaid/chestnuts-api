
const Database = require('better-sqlite3');

// 从根目录开始
const db = new Database('./db_chestnuts.db', { verbose: console.log });

const userDao = require('./userDao')
const CategoryDao = require("./categoryDao")

module.exports = {
    UserDao: new userDao(db),
    CategoryDao: new CategoryDao(db,  table='tb_category', '分类名字已经存在')
}