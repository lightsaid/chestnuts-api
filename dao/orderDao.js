const CRUD = require("../orm")
const Config = require("../config")

const SKUDao  = require("./skuDao");
const OrderItemDao = require("./orderItemDao")

class OrderDao extends CRUD {
  constructor(db, table, unique, success, fail) {
    super(db, table, unique, success, fail)
    this.db = db
    this.skuDao = new SKUDao(this.db, table="tb_sku")
    this.orderItemDao = new OrderItemDao(this.db, table="tb_order_item")
  }

  Insert(address, items, token) {
    // 获取用户信息
    let userInfo = Config.ParseJWT(token) 
    if(!userInfo.id){
        return Config.Response(Config.Unauthorized,{},"身份过期，请重新登录")
    }
    // return this.OrmInsert(data)
    let suffixArr = []
    // 查询 sku 表获取下单商品
    items.forEach((item, index) => {
      let temp = new Array(2)
      temp[0] = "id"
      temp[1] = item.skuId
      suffixArr.push(temp)
    })
    let skuField = ["id", "productId", "sku", "imgNormal", "stock", "salePrice"]

    let suffix = this.mapKV(suffixArr, "OR", "=")
    console.log("sql=>>>", `SELECT ${skuField.toString()} where ${suffix}`)

    // 1. 检查商品是否存在
    const list = this.db.prepare(`SELECT ${skuField.toString()} from ${this.skuDao .table} where ${suffix}`).all()
    // return this.Response(this.BadRequest, { list }, "测试")
    console.log("list=>>", list)
    if (!(list && list.length > 0)) {
      return Config.Response(this.BadRequest, {},"查询不到商品，无法下单")
    }
    let totalPrice = 0
    // 2. 检查库存是否
    for (let index = 0; index < list.length; index++) {
      const element = list[index]
      for (let j = 0; index < items.length; index++) {
        const item = items[j]
        if (element.id === item.id) {
            // 添加一个剩余库存
            item.num = Number(element.stock) - Number(item.quantity)
          if (element.stock < item.quantity) {
            return Config.Response(this.BadRequest,{ product: element, buyProduct: item }, "商品库存不足" )
          }
        }
      }
      // 随便计算 totalPrice
      totalPrice += Number(element.salePrice)
    }

    const insertOrder = db.prepare(`INSERT INTO ${this.table} (userId, address, totalPrice, status) VALUES (@userId, @address, @totalPrice, @status)`);
    const orderObj = {userId: userInfo.id, address, totalPrice, status: 1};

    const insertOrderId = db.prepare(`select last_insert_rowid() from ${this.table};`);
    // const xxx = () => {
    //     const db.prepare(`select last_insert_rowid() from ${this.table};`
    //     Cursor cursor = db.rawQuery(sql, null);
    //     int a = -1;
    //     if(cursor.moveToFirst()){
    //         a = cursor.getInt(0);
    //     }
    //     return a;
    // } 

    const insertOrderItem  = db.prepare(`INSERT INTO ${this.orderItemDao.table} (orderId, sku, imgNormal, salePrice, quantity) VALUES (@orderId, @sku, @imgNormal, @salePrice, @quantity)`);
    const insertOrderItemFunc = (orderItems)=>{
        for (const o of orderItems) insertOrderItem.run(o)
    }

    const getInsertOrderItems = (orderId) => {
        return list.map(li=>{
            return {
                orderId, sku: li.sku, imgNormal: li.imgNormal, salePrice: li.salePrice, quantity: li.quantity
            }
        })
    }

    const updateSku = () => {
        for(let i of items){
            this.skuDao .updateSku({stock: i.num}, {id: i.skuId})
        }
    }

    // 3. 使用事务函数更新、插入数据
    db.transaction(() => {
        // 3.1 插入订单主表
        insertOrder.run(orderObj)
        let orderId = insertOrderId.run()
        console.log("orderId=>>>>>>", orderId)

        // 3.2 插入订单子表
        let result = getInsertOrderItems()
        insertOrderItemFunc(result)
        
        // 3.3 更新 tb_sku 表库存
        updateSku()
    });

    

    // 
      // ctx.request.body = {
  //     address: 'xxx',
  //     items: [{skuId: 2, quantity:1}]
  // }

  // tb_order
// id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
//    userId INTEGER NOT NULL,
//    `address` VARCHAR(255) NOT NULL,
//    `status` CHAR(1) NOT NULL,-- 待付款 1、 待发货 2、 待收货 3、 已完成 4
//    totalPrice DECIMAL(8,2) NOT NULL,
//    FOREIGN KEY(userId) REFERENCES tb_user(id)

  /** tb_order_item
     *  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
        orderId INTEGER NOT NULL,
        sku TEXT NULL,
        imgNormal VARCHAR(255) NOT NULL,
        salePrice DECIMAL(8,2) NOT NULL,
        quantity INT NOT NULL,
        FOREIGN KEY(orderId) REFERENCES tb_order(id)
     */

  //  tb_sku
  //    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  //    productId INTEGER NOT NULL,
  //    sku TEXT NULL,
  //    imgNormal VARCHAR(255) NOT NULL,
  //    stock INT NOT NULL,
  //    salePrice DECIMAL(8,2) NOT NULL,
  //    FOREIGN KEY(productId) REFERENCES tb_product(id)

  }

  Select(fields, whereParam) {
    return this.OrmSelect(fields, whereParam)
  }

  Update(setParam, whereParam) {
    return this.OrmUpdated(setParam, whereParam)
  }

  Delete(id) {
    return this.OrmDelete({ id })
  }
}

module.exports = OrderDao
