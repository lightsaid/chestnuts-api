
const Database = require('better-sqlite3');

// 从根目录开始
const db = new Database('./db_chestnuts.db', { verbose: console.log });

const UserDao = require('./userDao')
const CategoryDao = require("./categoryDao")
const OptionDao = require("./optionDao")
const OptionValueDao = require("./optionValueDao")
const ProductDao = require("./productDao")
const SKUDao = require('./skuDao')
const ShoppingCartDao = require("./shoppingCartDao")
const OrderDao = require("./OrderDao")
const OrderItemDao = require("./OrderItemDao")

module.exports = {
    UserDao: new UserDao(db),
    CategoryDao: new CategoryDao(db,  table='tb_category', '分类名字已经存在'),
    OptionDao: new OptionDao(db, table="tb_option"),
    OptionValueDao: new OptionValueDao(db, table="tb_option_value"),
    ProductDao: new ProductDao(db, table="tb_product"),
    SKUDao: new SKUDao(db, table="tb_sku"),
    ShoppingCartDao: new ShoppingCartDao(db, table="tb_shoppingCart"),
    OrderDao: new OrderDao(db, table="tb_order"),
    OrderItemDao: new OrderItemDao(db, table="tb_order_item")
}



