const router = require("koa-router")()
const Config = require("../config")
const { ProductDao } = require("../dao")

router.prefix("/api/product")


router.post("/all", (ctx, next)=>{
    
})


router.post("/insert", (ctx, next)=>{
    // const { name, categoryId, subTitle, showPrice, imgNormal, imgRecommend, isRecommend, onSale } = ctx.request.body
    const body = ctx.request.body
    const notNullTip = {name: '商品名字不能为空', categoryId:"分类不能为空", subTitle:"卖点不能为空", 
    showPrice:"价格不能为空", imgNormal:"图片不能为空", isRecommend:'是否推荐不能能空', onSale:"是否上架不能为空"}
    // 不用校验参数
    const insertParam = {imgRecommend: body.imgRecommend}
    // 非空校验
    for(let key of Object.keys(notNullTip)){
        if(!(body[key] && body[key].toString().trim())){
            ctx.body = Config.Response(Config.BadRequest,{}, notNullTip[key])
            return
        }
        insertParam[key] = body[key]
    }
    if(!["Y","N"].includes(body.onSale)){
        ctx.body = Config.Response(Config.BadRequest,{}, "上架参数有误")
        return
    }
    if(!["Y","N"].includes(body.isRecommend)){
        ctx.body = Config.Response(Config.BadRequest,{}, "推荐参数有误")
        return
    }
    ctx.body = ProductDao.Insert(insertParam)
})

router.post("/select", (ctx, next)=>{
    let fields = ["id","name", "categoryId", "subTitle", "showPrice", "imgNormal", "imgRecommend", "isRecommend", "onSale"]
    const {id, name, categoryId, subTitle, showPrice, imgNormal, imgRecommend, isRecommend, onSale } = ctx.request.body
    const whereParam = {id, name, categoryId, subTitle, showPrice, imgNormal, imgRecommend, isRecommend, onSale}
    for(let key in whereParam){
        if(!whereParam[key]){
            delete whereParam[key]
        }
    }
    if(JSON.stringify(whereParam) === "{}"){
        ctx.body = ProductDao.Select(fields)
        return
    }
    ctx.body = ProductDao.Select(fields, whereParam)
})


router.post("/update", (ctx, next)=>{
    const {id, name, categoryId, subTitle, showPrice, imgNormal, imgRecommend, isRecommend, onSale } = ctx.request.body
    // 除了 imgRecommend 都是必填选 
    const updateParam = {name, categoryId, subTitle, showPrice, imgNormal, isRecommend, onSale}
    for(let key in updateParam){
        if(!updateParam[key]){
            delete updateParam[key]
        }
    }
    // 存在这个属性，就添加进去
    if(ctx.request.body.hasOwnProperty('imgRecommend')){
        updateParam.imgRecommend = imgRecommend
    }
    
    ctx.body = ProductDao.Update(updateParam, {id})
})

router.post("/delete", (ctx, next)=>{
    const { id } = ctx.request.body
    if(!id){
        ctx.body = Config.Response(Config.BadRequest, {}, 'Id不能为空')
        return
    }
    ctx.body = ProductDao.Delete(id)
})

module.exports = router