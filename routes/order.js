const router = require("koa-router")()
const Config = require("../config")
const { OrderDao } = require("../dao")

router.prefix("/api/order")

router.post("/insert", (ctx, next) => {
  const { address, items } = ctx.request.body
  if (!(address && address.trim())) {
    ctx.body = Config.Response(Config.BadRequest, {}, "地址不能为空")
    return
  }
  if (!(items && items.length)) {
    ctx.body = Config.Response(Config.BadRequest, {}, "请选择商品")
    return
  }

  // 校验数据格式
  for(let i=0;i<items.length;i++){
    if(!(items[i].skuId && items[i].quantity && items.quantity <= 0)){
      ctx.body = Config.Response(Config.BadRequest,{},"参数格式不对")
      return
    }
  }

  ctx.body = OrderDao.Insert(address, items, ctx.headers.authorization)
})

router.post("/select", (ctx, next) => {
  const { id, status, page={pageSize: 10, pageIndex: 0} } = ctx.request.body
  let userInfo = Config.ParseJWT(ctx.headers.authorization)
  if (!userInfo.id) {
    return Config.Response(Config.Unauthorized, {}, "身份过期，请重新登录")
  }

  const whereParam = { id, userId: userInfo.id, status, page }
  for (let key in whereParam) {
    if (!whereParam[key]) {
      delete whereParam[key]
    }
  }

  ctx.body = OrderDao.Select(["id", "userId", "address", "status", "totalPrice"], whereParam)
})

router.post("/update", (ctx, next) => {
  ctx.body = Config.Response(Config.OK, {}, "暂未开发更新")
})

router.post("/delete", (ctx, next) => {
  const { id } = ctx.request.body
  if (!id) {
    ctx.body = Config.Response(Config.BadRequest, {}, "Id不能为空")
    return
  }
  ctx.body = OrderDao.Delete(id)
})

module.exports = router
