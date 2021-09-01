const router = require("koa-router")()
const Config = require("../config")
const { OrderItemDao } = require("../dao")

router.prefix("/api/orderitem")

router.post("/insert", (ctx, next)=>{
    // ctx.request.body = {
    //     address: 'xxx',
    //     items: [skuid]
    // }
    // const userinfo = Config.ParseJWT(ctx.headers.authorization)     
    // if(!(userinfo && userinfo.id)){
    //     ctx.body = Config.Response(Config.Unauthorized,{},"身份过期，请重新登录")
    //     return
    // }

    // const { address } = ctx.request.body
    // if(!(address && address.trim())){
    //     ctx.body = Config.Response(Config.BadRequest, {}, "地址不能为空")
    //     return
    // }
    // OrderItemDao.Insert({ userId: userinfo.id, address, status:'1'  })
    ctx.body = Config.Response(Config.BadRequest, {}, "未开放")
})

router.post("/select", (ctx, next)=>{
    // const { id, label, categoryId} = ctx.request.body
    // const whereParam = {id,label,categoryId}
    // for(let key in whereParam){
    //     if(!whereParam[key]){
    //         delete whereParam[key]
    //     }
    // }
    // if(JSON.stringify(whereParam) === "{}"){
    //     ctx.body = OrderItemDao.Select(['id','label','categoryId'])
    //     return
    // }
    // ctx.body = OrderItemDao.Select(['id','label','categoryId'], whereParam)
    ctx.body = Config.Response(Config.BadRequest, {}, "未开放")
})

router.post("/update", (ctx, next)=>{
    // const { id, label, categoryId} = ctx.request.body
    // if(!(id && label && categoryId)){
    //     ctx.body = Config.Response(Config.BadRequest, {}, '参数项不能为空')
    //     return
    // }
    // ctx.body = OrderItemDao.Update({label, categoryId}, {id})
    ctx.body = Config.Response(Config.BadRequest, {}, "未开放")
})

router.post("/delete", (ctx, next)=>{
    const { id } = ctx.request.body
    if(!id){
        ctx.body = Config.Response(Config.BadRequest, {}, 'Id不能为空')
        return
    }
    ctx.body = OrderItemDao.Delete(id)
})

module.exports = router