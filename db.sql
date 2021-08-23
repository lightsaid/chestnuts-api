/**
   * 执行命令建库
   * sqlite3 db_chestnuts.db
   * 执行脚本生成表
   * .read db.sql 
   * 或者
   * sqlite3 db_chestnuts.db < db.sql
   *
*/

-- 1. 用户表
CREATE TABLE tb_user(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
   username VARCHAR(24) NOT NULL,
   `password` VARCHAR(32) NOT NULL,
   isVendor CHAR(0) DEFAULT 'N', -- Y: 供应商，N：消费者
   avatar VARCHAR(255) NULL,
   UNIQUE (username)
);

-- 2. 分类表
CREATE TABLE tb_category(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
   `name` VARCHAR(24) NOT NULL,
   icon VARCHAR(255) NULL,
   UNIQUE (name)
);

-- 3. 选项表 
CREATE TABLE tb_option(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
   categoryId INTEGER NOT NULL,
   label VARCHAR(24) NOT NULL,
   FOREIGN KEY(categoryId) REFERENCES tb_category(id)
);

-- 4. 参数表 
CREATE TABLE tb_option_value(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
   optionId INTEGER NOT NULL,
   `value` VARCHAR(24) NOT NULL,
   FOREIGN KEY(optionId) REFERENCES tb_option(id)
);

-- 5. 商品表
CREATE TABLE tb_product(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
   categoryId INTEGER NOT NULL,
   `name` VARCHAR(24) NOT NULL,
   subTitle VARCHAR(50) NOT NULL,
   showPrice DECIMAL(8,2) NOT NULL,
   imgNormal VARCHAR(255) NOT NULL,
   imgRecommend VARCHAR(255) NULL,
   isRecommend CHAR(0) DEFAULT 'N' NOT NULL,
   onSale CHAR(0) DEFAULT 'Y' -- Y: 上架，N：下架
);

-- 6. sku表 
CREATE TABLE tb_sku(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
   productId INTEGER NOT NULL,
   sku TEXT NULL,
   imgNormal VARCHAR(255) NOT NULL,
   stock INT NOT NULL,
   salePrice DECIMAL(8,2) NOT NULL,
   FOREIGN KEY(productId) REFERENCES tb_product(id)
);

-- 7. 购物车表 
CREATE TABLE tb_shoppingCart(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
   userId INTEGER NOT NULL,
   skuId INTEGER NOT NULL,
   quantity INT NOT NULL,
   FOREIGN KEY(userId) REFERENCES tb_user(id),
   FOREIGN KEY(skuId) REFERENCES tb_sku(id)
);

-- 8. 订单表 
CREATE TABLE tb_order(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
   userId INTEGER NOT NULL,
   `address` VARCHAR(255) NOT NULL,
   `status` CHAR(1) NOT NULL,-- 待付款 1、 待发货 2、 待收货 3、 已完成 4
   totalPrice DECIMAL(8,2) NOT NULL,
   FOREIGN KEY(userId) REFERENCES tb_user(id)
);

-- 9. 订单明细表 
CREATE TABLE tb_order_item(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
   orderId INTEGER NOT NULL,
   sku TEXT NULL,
   imgNormal VARCHAR(255) NOT NULL,
   salePrice DECIMAL(8,2) NOT NULL,
   quantity INT NOT NULL,
   FOREIGN KEY(orderId) REFERENCES tb_order(id)
);









