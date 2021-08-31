const router = require("koa-router")()
const Config = require("../config")
const { OrderDao } = require("../dao")

router.prefix("/api/order")

router.post("/insert", (ctx, next) => {
  const userinfo = Config.ParseJWT(ctx.headers.authorization)
  if (!(userinfo && userinfo.id)) {
    ctx.body = Config.Response(Config.Unauthorized, {}, "身份过期，请重新登录")
    return
  }

  const { address, items } = ctx.request.body
  if (!(address && address.trim())) {
    ctx.body = Config.Response(Config.BadRequest, {}, "地址不能为空")
    return
  }
  if (!(items && items.length)) {
    ctx.body = Config.Response(Config.BadRequest, {}, "请选择商品")
    return
  }
  ctx.body = OrderDao.Insert(address, items, ctx.headers.authorization)
})

router.post("/select", (ctx, next) => {
  const { id, label, categoryId } = ctx.request.body
  const whereParam = { id, label, categoryId }
  for (let key in whereParam) {
    if (!whereParam[key]) {
      delete whereParam[key]
    }
  }
  if (JSON.stringify(whereParam) === "{}") {
    ctx.body = OrderDao.Select(["id", "label", "categoryId"])
    return
  }
  ctx.body = OrderDao.Select(["id", "label", "categoryId"], whereParam)
})

router.post("/update", (ctx, next) => {
  const { id, label, categoryId } = ctx.request.body
  if (!(id && label && categoryId)) {
    ctx.body = Config.Response(Config.BadRequest, {}, "参数项不能为空")
    return
  }
  ctx.body = OrderDao.Update({ label, categoryId }, { id })
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
