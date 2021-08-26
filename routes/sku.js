const router = require("koa-router")()
const Config = require("../config")
const { SKUDao } = require("../dao")

router.prefix("/api/sku")

router.post("/insert", (ctx, next)=>{
    // const { productId, sku, imgNormal, stock, salePrice } = ctx.request.body
    const body = ctx.request.body
    const notNullTip = {productId: "商品Id不能为空", imgNormal:"图片不能为空", stock:"库存不能为空", salePrice:"销售价不能为空"}
    // 不用校验参数
    const insertParam = {sku: body.sku}
    // 非空校验
    for(let key of Object.keys(notNullTip)){
        if(!(body[key] && body[key].toString().trim())){
            ctx.body = Config.Response(Config.BadRequest,{}, notNullTip[key])
            return
        }
        insertParam[key] = body[key]
    }
    if(insertParam.sku){
        insertParam.sku = JSON.stringify(insertParam.sku)
    }
    console.log("insertParam.sku=>>>>", typeof insertParam.sku, insertParam.sku)

    ctx.body = SKUDao.Insert(insertParam)
})

router.post("/select", (ctx, next)=>{
    let fields = ["id", "productId", "sku", "imgNormal", "stock", "salePrice"]
    const {id, productId, sku, imgNormal, stock, salePrice } = ctx.request.body
    const whereParam = {id, productId, sku, imgNormal, stock, salePrice}
    for(let key in whereParam){
        if(!whereParam[key]){
            delete whereParam[key]
        }
    }
    if(JSON.stringify(whereParam) === "{}"){
        ctx.body = SKUDao.Select(fields)
        return
    }
    ctx.body = SKUDao.Select(fields, whereParam)
})


router.post("/update", (ctx, next)=>{
    const {id, productId, sku, imgNormal, stock, salePrice } = ctx.request.body
    // 除了 sku 都是必填
    const updateParam = {productId, imgNormal, stock, salePrice}
    for(let key in updateParam){
        if(!updateParam[key]){
            delete updateParam[key]
        }
    }
    // 存在这个属性，就添加进去
    if(ctx.request.body.hasOwnProperty('sku')){
        updateParam.sku = JSON.stringify(sku)
    }
    
    ctx.body = SKUDao.Update(updateParam, {id})
})

router.post("/delete", (ctx, next)=>{
    const { id } = ctx.request.body
    if(!id){
        ctx.body = Config.Response(Config.BadRequest, {}, 'Id不能为空')
        return
    }
    ctx.body = SKUDao.Delete(id)
})

module.exports = router