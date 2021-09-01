const CRUD = require("../orm")
const Config = require("../config")

const SKUDao = require("./skuDao")
const OrderItemDao = require("./orderItemDao")

class OrderDao extends CRUD {
  constructor(db, table, unique, success, fail) {
    super(db, table, unique, success, fail)
    this.db = db
    this.skuDao = new SKUDao(db, (table = "tb_sku"))
    this.orderItemDao = new OrderItemDao(db, (table = "tb_order_item"))
  }

  Insert(address, items, token) {
    // 获取用户信息
    let userInfo = Config.ParseJWT(token)
    if (!userInfo.id) {
      return Config.Response(Config.Unauthorized, {}, "身份过期，请重新登录")
    }
    // return this.OrmInsert(data)
    let suffixArr = []
    // 查询 sku 表获取下单商品
    items.forEach((item) => {
      let temp = new Array(2)
      temp[0] = "id"
      temp[1] = item.skuId
      suffixArr.push(temp)
    })
    let skuField = ["id", "productId", "sku", "imgNormal", "stock", "salePrice"]

    let suffix = this.mapKV(suffixArr, "OR", "=")

    // 1. 检查商品是否存在
    const list = this.db
      .prepare(
        `SELECT ${skuField.toString()} from ${
          this.skuDao.table
        } where ${suffix}`
      )
      .all()
    // return this.Response(this.BadRequest, { list }, "测试")
    if (!(list && list.length > 0)) {
      return Config.Response(this.BadRequest, {}, "商品已下架或不存在")
    }
    let totalPrice = 0
    // 2. 检查库存是否
    for (let index = 0; index < list.length; index++) {
      const element = list[index]
      for (let j = 0; index < items.length; index++) {
        if (element.id === items[j].skuId) {
          // 添加一个剩余库存
          items[j].num = Number(element.stock) - Number(items[j].quantity)
          if (element.stock < items[j].quantity) {
            return Config.Response(
              this.BadRequest,
              { product: element, buyProduct: items[j] },
              "商品库存不足"
            )
          }
          // 添加一个购买数量
          list[index].quantity = items[j].quantity
        }
      }
      // 随便计算 totalPrice
      totalPrice += Number(element.salePrice)
    }

    const insertOrder = this.db.prepare(
      `INSERT INTO ${this.table} (userId, address, totalPrice, status) VALUES (@userId, @address, @totalPrice, @status)`
    )
    const orderObj = { userId: userInfo.id, address, totalPrice, status: 1 }

    const insertOrderId = this.db.prepare(
      `select last_insert_rowid() from ${this.table};`
    )

    const insertOrderItem = this.db.prepare(
      `INSERT INTO ${this.orderItemDao.table} (orderId, sku, imgNormal, salePrice, quantity) VALUES (@orderId, @sku, @imgNormal, @salePrice, @quantity)`
    )
    const insertOrderItemFunc = (orderItems) => {
      for (const o of orderItems) insertOrderItem.run(o)
    }

    const getInsertOrderItems = (orderId) => {
      return list.map((li) => {
        return {
          orderId,
          sku: li.sku,
          imgNormal: li.imgNormal,
          salePrice: li.salePrice,
          quantity: li.quantity,
        }
      })
    }

    const updateSku = () => {
      for (let i of items) {
        this.skuDao.Update({ stock: i.num }, { id: i.skuId })
      }
    }
    try {
      // 3. 使用事务函数更新、插入数据
      const transOrder = this.db.transaction(() => {
        // 3.1 插入订单主表
        insertOrder.run(orderObj)
        let orderIdResult = insertOrderId.run()
        // console.log("orderIdResult=>>>>>>", orderIdResult, orderIdResult.lastInsertRowid) //  { changes: 0, lastInsertRowid: 1 }
        if (
          !(orderIdResult.lastInsertRowid && orderIdResult.lastInsertRowid > 0)
        ) {
          return Config.Response(Config.Response, {},"生成订单失败","获取订单Id失败" )
        }

        // 3.2 插入订单子表
        let result = getInsertOrderItems(orderIdResult.lastInsertRowid)
        insertOrderItemFunc(result)

        // 3.3 更新 tb_sku 表库存
        updateSku()
      })
      transOrder.immediate()
      return Config.Response(Config.OK, {}, "下单成功")
    } catch (err) {
      console.error("err=>>>>", err)
      if (!this.db.inTransaction) throw err // (transaction was forcefully rolled back)
			return Config.Response(Config.OK, {}, "下单失败", err.toString())
    }
  }

  Select(fields, whereParam) {
		const { page } = whereParam;
		delete whereParam.page
		let orderList;
		if(JSON.stringify(whereParam) === "{}"){
			this.OrmSelect(fields, {1:1}, termStr=' = ',)
		}
    return this.OrmSelect(fields, whereParam, termStr=' = ',)
  }

  Update(setParam, whereParam) {
    return this.OrmUpdated(setParam, whereParam)
  }

  Delete(id) {
    return this.OrmDelete({ id })
  }
}

module.exports = OrderDao
