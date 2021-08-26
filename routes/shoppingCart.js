const router = require("koa-router")()
const Config = require("../config")
const { ShoppingCartDao } = require("../dao")

router.prefix("/api/shoppingcart")

router.post("/insert", (ctx, next)=>{
    const userinfo = Config.ParseJWT(ctx.headers.authorization)     
    if(!(userinfo && userinfo.id)){
        ctx.body = Config.Response(Config.Unauthorized,{},"身份过期，请重新登录")
        return
    }
    let { skuId, quantity } = ctx.request.body
    if(!skuId){
        ctx.body = Config.Response(Config.BadRequest, {}, "商品Id不存在")
        return
    }
    if(!quantity){
        quantity = 1
    }
    quantity = Number(quantity)
    // 查询是否存在该商品，如果存在，删除旧的， quantity 累加，再新增
    let result = ShoppingCartDao.Select(['id','userId','skuId','quantity'], {userId: userinfo.id, skuId})
    if(result && result.data && result.data.list){
        const list = result.data.list
        list.forEach(element => {
            quantity += Number(element.quantity)
            // 删除旧的
            ShoppingCartDao.Delete(element.id)
        });
    }
    ctx.body = ShoppingCartDao.Insert({ userId: userinfo.id, skuId, quantity })
})

router.post("/select", (ctx, next)=>{
    const { id, userId, skuId, quantity} = ctx.request.body
    const whereParam = {id, userId, skuId, quantity}
    for(let key in whereParam){
        if(!whereParam[key]){
            delete whereParam[key]
        }
    }
    if(JSON.stringify(whereParam) === "{}"){
        ctx.body = ShoppingCartDao.Select(['id','userId','skuId','quantity'])
        return
    }
    ctx.body = ShoppingCartDao.Select(['id','userId','skuId','quantity'], whereParam)
})


router.post("/update", (ctx, next)=>{
    const userinfo = Config.ParseJWT(ctx.headers.authorization)  
    if(!(userinfo && userinfo.id)){
        ctx.body = Config.Response(Config.Unauthorized,{},"身份过期，请重新登录")
        return
    }
    const { id, userId, skuId, quantity} = ctx.request.body
    if(!(id && skuId && quantity)){
        ctx.body = Config.Response(Config.BadRequest, {}, '参数项不能为空')
        return
    }
    ctx.body = ShoppingCartDao.Update({userId, skuId, quantity}, {id})
})

router.post("/delete", (ctx, next)=>{
    const { id } = ctx.request.body
    if(!id){
        ctx.body = Config.Response(Config.BadRequest, {}, 'Id不能为空')
        return
    }
    ctx.body = ShoppingCartDao.Delete(id)
})

module.exports = router