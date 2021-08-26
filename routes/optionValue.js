const router = require("koa-router")()
const Config = require("../config")
const { OptionValueDao } = require("../dao")

router.prefix("/api/optionvalue")

router.post("/insert", (ctx, next)=>{
    const { value, optionId } = ctx.request.body
    if(!(value && value.trim() && optionId)){
        ctx.body = Config.Response(Config.BadRequest, {}, "value和选项Id不能为空")
        return
    }
    ctx.body = OptionValueDao.Insert({ value, optionId })
})

router.post("/select", (ctx, next)=>{
    const { id, value, optionId} = ctx.request.body
    const whereParam = {id, value, optionId}
    for(let key in whereParam){
        if(!whereParam[key]){
            delete whereParam[key]
        }
    }
    if(JSON.stringify(whereParam) === "{}"){
        ctx.body = OptionValueDao.Select(['id','value','optionId'])
        return
    }
    ctx.body = OptionValueDao.Select(['id','value','optionId'], whereParam)
})


router.post("/update", (ctx, next)=>{
    const { id, value, optionId} = ctx.request.body
    if(!(id && value && optionId)){
        ctx.body = Config.Response(Config.BadRequest, {}, '参数项不能为空')
        return
    }
    ctx.body = OptionValueDao.Update({value, optionId}, {id})
})

router.post("/delete", (ctx, next)=>{
    const { id } = ctx.request.body
    if(!id){
        ctx.body = Config.Response(Config.BadRequest, {}, 'Id不能为空')
        return
    }
    ctx.body = OptionValueDao.Delete(id)
})

module.exports = router