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
DROP TABLE IF EXISTS tb_user;
CREATE TABLE IF NOT EXISTS tb_user(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
   username VARCHAR(24) NOT NULL,
   `password` VARCHAR(32) NOT NULL,
   isVendor CHAR(0) DEFAULT 'N', -- Y: 供应商，N：消费者
   avatar VARCHAR(255) NULL,
   UNIQUE (username)
);

-- 2. 分类表
DROP TABLE IF EXISTS tb_category;
CREATE TABLE IF NOT EXISTS tb_category(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
   `name` VARCHAR(24) NOT NULL,
   icon VARCHAR(255) NULL,
   UNIQUE (name)
);

-- 3. 选项表 
DROP TABLE IF EXISTS tb_option;
CREATE TABLE IF NOT EXISTS tb_option(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
   categoryId INTEGER NOT NULL,
   label VARCHAR(24) NOT NULL,
   FOREIGN KEY(categoryId) REFERENCES tb_category(id)
);

-- 4. 参数表 
DROP TABLE IF EXISTS tb_option_value;
CREATE TABLE IF NOT EXISTS tb_option_value(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
   optionId INTEGER NOT NULL,
   `value` VARCHAR(24) NOT NULL,
   FOREIGN KEY(optionId) REFERENCES tb_option(id)
);

-- 5. 商品表
DROP TABLE IF EXISTS tb_product;
CREATE TABLE IF NOT EXISTS tb_product(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
   categoryId INTEGER NOT NULL,
   `name` VARCHAR(24) NOT NULL,
   subTitle VARCHAR(50) NOT NULL,
   showPrice DECIMAL(8,2) NOT NULL,
   imgNormal VARCHAR(255) NOT NULL,
   imgRecommend VARCHAR(255) NULL,
   isRecommend CHAR(0) DEFAULT 'N' NOT NULL,
   onSale CHAR(0) DEFAULT 'Y', -- Y: 上架，N：下架
   FOREIGN KEY(categoryId) REFERENCES tb_category(id)
);

-- 6. sku表 
DROP TABLE IF EXISTS tb_sku;
CREATE TABLE IF NOT EXISTS tb_sku(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
   productId INTEGER NOT NULL,
   sku TEXT NULL,
   imgNormal VARCHAR(255) NOT NULL,
   stock INT NOT NULL,
   salePrice DECIMAL(8,2) NOT NULL,
   FOREIGN KEY(productId) REFERENCES tb_product(id)
);

-- 7. 购物车表 
DROP TABLE IF EXISTS tb_shoppingCart;
CREATE TABLE IF NOT EXISTS tb_shoppingCart(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
   userId INTEGER NOT NULL,
   skuId INTEGER NOT NULL,
   quantity INT NOT NULL,
   FOREIGN KEY(userId) REFERENCES tb_user(id),
   FOREIGN KEY(skuId) REFERENCES tb_sku(id)
);

-- 8. 订单表 
DROP TABLE IF EXISTS tb_order;
CREATE TABLE IF NOT EXISTS tb_order(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
   userId INTEGER NOT NULL,
   `address` VARCHAR(255) NOT NULL,
   `status` CHAR(1) NOT NULL,-- 待付款 1、 待发货 2、 待收货 3、 已完成 4
   totalPrice DECIMAL(8,2) NOT NULL,
   FOREIGN KEY(userId) REFERENCES tb_user(id)
);

-- 9. 订单明细表 
DROP TABLE IF EXISTS tb_order_item;
CREATE TABLE IF NOT EXISTS tb_order_item(
   id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
   orderId INTEGER NOT NULL,
   sku TEXT NULL,
   imgNormal VARCHAR(255) NOT NULL,
   salePrice DECIMAL(8,2) NOT NULL,
   quantity INT NOT NULL,
   FOREIGN KEY(orderId) REFERENCES tb_order(id)
);

--- 添加基础数据
insert into tb_user(`username`, `password`) values("xzz", "xzz520");
insert into tb_user(username, isVendor, `password`) values("lightsaid", "Y", "xzz520");

insert into tb_category(`name`, `icon`) values("豆瓣经典", "data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='26' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cdefs%3E%3Cpath id='a' d='M.569.279h19.048v20.72H.569z'/%3E%3Cpath id='c' d='M0 .17h6.682V16H0z'/%3E%3C/defs%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M9.838 2.288a.899.899 0 00-1.109.62c-.099.35-.15.715-.15 1.085v2.153a.9.9 0 001.798 0V3.993c0-.205.027-.405.081-.596a.898.898 0 00-.62-1.109' fill='%23C2DDBA'/%3E%3Cg transform='translate(4 4.111)'%3E%3Cmask id='b' fill='%23fff'%3E%3Cuse xlink:href='%23a'/%3E%3C/mask%3E%3Cpath d='M19.592 19.56c.16.744-.47 1.439-1.33 1.439H6.046c-.054 0-.094 0-.147-.012-.591-.048-1.075-.444-1.182-.958L1.588 5.852l-1-4.528C.468.783.932.279 1.55.279h12.672c.658 0 1.208.408 1.329.97l4.04 18.312z' fill='%2344883E' mask='url(https://img1.doubanio.com%23b)'/%3E%3C/g%3E%3Cpath d='M12.572 7.986a.899.899 0 010-1.798c1.21 0 2.195-.985 2.195-2.195s-.985-2.195-2.195-2.195c-.98 0-1.848.657-2.114 1.598a.898.898 0 11-1.729-.487A4.005 4.005 0 0112.572 0a3.998 3.998 0 013.992 3.993 3.998 3.998 0 01-3.992 3.993' fill='%238FB88B'/%3E%3Cg transform='translate(0 9.111)'%3E%3Cmask id='d' fill='%23fff'%3E%3Cuse xlink:href='%23c'/%3E%3C/mask%3E%3Cpath d='M6.659 14.794A.996.996 0 015.686 16H.979c-.62 0-1.08-.5-.96-1.05L2.857.49c.095-.428.707-.426.8.002l3.002 14.302z' fill='%2344883E' mask='url(https://img3.doubanio.com%23d)'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
insert into tb_category(`name`, `icon`) values("家居生活", "data:image/svg+xml;charset=utf-8,%3Csvg width='26' height='19' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cdefs%3E%3Cpath id='a' d='M.093.369H17.69V17H.093z'/%3E%3Cpath id='c' d='M0 .183h19.782v2.186H0z'/%3E%3C/defs%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M18.31 16.703a1.092 1.092 0 110-2.185 4.986 4.986 0 004.982-4.98V6.84a.356.356 0 00-.355-.357h-5.445a1.093 1.093 0 110-2.185h5.445a2.545 2.545 0 012.542 2.542v2.697c0 3.951-3.216 7.166-7.168 7.166' fill='%2344883E'/%3E%3Cg transform='translate(1 1.817)'%3E%3Cmask id='b' fill='%23fff'%3E%3Cuse xlink:href='%23a'/%3E%3C/mask%3E%3Cpath d='M.093 15.649C.093 16.395.698 17 1.444 17h14.894c.746 0 1.351-.606 1.351-1.352V.369H.093v15.28z' fill='%2344883E' mask='url(https://img1.doubanio.com%23b)'/%3E%3C/g%3E%3Cg transform='translate(0 -.183)'%3E%3Cmask id='d' fill='%23fff'%3E%3Cuse xlink:href='%23c'/%3E%3C/mask%3E%3Cpath d='M18.69 2.369H1.092a1.093 1.093 0 010-2.187H18.69a1.093 1.093 0 110 2.187' fill='%238FB88B' mask='url(https://img3.doubanio.com%23d)'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
insert into tb_category(`name`, `icon`) values("外出旅行", "data:image/svg+xml;charset=utf-8,%3Csvg width='20' height='30' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cdefs%3E%3Cpath id='a' d='M0 .968h19.254V21H0z'/%3E%3C/defs%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M13.556 12.45a1.012 1.012 0 01-1.01-1.013V4.94a2.922 2.922 0 00-2.92-2.918A2.922 2.922 0 006.71 4.94v6.497a1.012 1.012 0 11-2.022 0V4.94A4.946 4.946 0 019.627 0a4.947 4.947 0 014.941 4.94v6.497c0 .56-.453 1.012-1.012 1.012' fill='%238FB88B'/%3E%3Cg transform='translate(0 8.161)'%3E%3Cmask id='b' fill='%23fff'%3E%3Cuse xlink:href='%23a'/%3E%3C/mask%3E%3Cpath d='M18.384 21H.87A.87.87 0 010 20.13V1.838a.87.87 0 01.87-.87h17.514c.48 0 .87.39.87.87V20.13c0 .48-.39.87-.87.87L14.568 4.288' fill='%2344883E' mask='url(https://img1.doubanio.com%23b)'/%3E%3C/g%3E%3Cpath d='M14.258 24.646h-9.26a.87.87 0 01-.87-.87v-9.261c0-.48.388-.87.87-.87h9.26c.48 0 .87.39.87.87v9.26c0 .48-.39.87-.87.87' fill='%238FB88B'/%3E%3C/g%3E%3C/svg%3E");
insert into tb_category(`name`, `icon`) values("文具小物", "data:image/svg+xml;charset=utf-8,%3Csvg width='22' height='22' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cdefs%3E%3Cpath id='a' d='M0 .151H17.53V22H0z'/%3E%3C/defs%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg transform='translate(0 -.151)'%3E%3Cmask id='b' fill='%23fff'%3E%3Cuse xlink:href='%23a'/%3E%3C/mask%3E%3Cpath d='M16.659 22H.87a.87.87 0 01-.87-.87V1.021c0-.48.389-.87.87-.87h15.787c.48 0 .87.39.87.87v20.11c0 .48-.39.87-.87.87' fill='%2344883E' mask='url(https://img1.doubanio.com%23b)'/%3E%3C/g%3E%3Cpath d='M21.96 1.108v19.634a1.107 1.107 0 01-2.216 0V1.108a1.108 1.108 0 012.215 0' fill='%238FB88B'/%3E%3C/g%3E%3C/svg%3E");

insert into tb_option(categoryId, label) values(1, "颜色");
insert into tb_option(categoryId, label) values(1, "气味");
insert into tb_option(categoryId, label) values(2, "颜色");
insert into tb_option(categoryId, label) values(2, "尺寸");
insert into tb_option(categoryId, label) values(3, "颜色");
insert into tb_option(categoryId, label) values(3, "款式");
insert into tb_option(categoryId, label) values(4, "颜色");
insert into tb_option(categoryId, label) values(4, "尺寸");

insert into tb_option_value(`optionId`, `value`) values(1, "森林绿");
insert into tb_option_value(`optionId`, `value`) values(1, "朱砂红");
insert into tb_option_value(`optionId`, `value`) values(1, "星空蓝");
insert into tb_option_value(`optionId`, `value`) values(2, "玫瑰香");
insert into tb_option_value(`optionId`, `value`) values(3, "红色");
insert into tb_option_value(`optionId`, `value`) values(3, "黄色");
insert into tb_option_value(`optionId`, `value`) values(3, "绿色");


insert into tb_option_value(`optionId`, `value`) values(3, "S");
insert into tb_option_value(`optionId`, `value`) values(3, "M");
insert into tb_option_value(`optionId`, `value`) values(3, "L");
insert into tb_option_value(`optionId`, `value`) values(3, "XL");
insert into tb_option_value(`optionId`, `value`) values(3, "2XL");
insert into tb_option_value(`optionId`, `value`) values(3, "3XL");


insert into tb_option_value(`optionId`, `value`) values(2, "水蜜桃");
insert into tb_option_value(`optionId`, `value`) values(2, "甜橙清");
insert into tb_option_value(`optionId`, `value`) values(3, "木棉红");
insert into tb_option_value(`optionId`, `value`) values(3, "柠檬黄");
insert into tb_option_value(`optionId`, `value`) values(3, "深海绿");
insert into tb_option_value(`optionId`, `value`) values(4, "S");
insert into tb_option_value(`optionId`, `value`) values(4, "M");
insert into tb_option_value(`optionId`, `value`) values(4, "L");
insert into tb_option_value(`optionId`, `value`) values(4, "XL");
insert into tb_option_value(`optionId`, `value`) values(4, "2XL");
insert into tb_option_value(`optionId`, `value`) values(4, "3XL");
insert into tb_option_value(`optionId`, `value`) values(5, "香叶红");
insert into tb_option_value(`optionId`, `value`) values(5, "景泰蓝");
insert into tb_option_value(`optionId`, `value`) values(5, "亚定绿");
insert into tb_option_value(`optionId`, `value`) values(5, "金盏黄");
insert into tb_option_value(`optionId`, `value`) values(6, "奥古斯丁款");
insert into tb_option_value(`optionId`, `value`) values(6, "巴尔蒙特款");
insert into tb_option_value(`optionId`, `value`) values(7, "纯白");
insert into tb_option_value(`optionId`, `value`) values(7, "纯黄");
insert into tb_option_value(`optionId`, `value`) values(7, "纯黑");
insert into tb_option_value(`optionId`, `value`) values(7, "黑白");
insert into tb_option_value(`optionId`, `value`) values(8, "35");
insert into tb_option_value(`optionId`, `value`) values(8, "36");
insert into tb_option_value(`optionId`, `value`) values(8, "37");
insert into tb_option_value(`optionId`, `value`) values(8, "38");
insert into tb_option_value(`optionId`, `value`) values(8, "39");
insert into tb_option_value(`optionId`, `value`) values(8, "40");
insert into tb_option_value(`optionId`, `value`) values(8, "41");
insert into tb_option_value(`optionId`, `value`) values(8, "42");
insert into tb_option_value(`optionId`, `value`) values(8, "43");


---- 添加商品
insert into tb_product(categoryId, `name`, subTitle, showPrice, imgNormal) values(2, "豆猫卫衣", "懂你温度，不失风度", 198.0, "http://localhost:9999/static/upload/p2052847.jpg");
insert into tb_sku(productId, sku, imgNormal, stock, salePrice) values(1, '[{"label":"颜色","value":"香叶红"},{"label":"尺寸","value":"L"}]',"http://localhost:9999/static/upload/p2052838.jpg", 198.0, 1000);