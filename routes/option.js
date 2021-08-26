const router = require("koa-router")()
const Config = require("../config")
const { OptionDao } = require("../dao")

router.prefix("/api/option")

router.post("/insert", (ctx, next)=>{
    const { label, categoryId } = ctx.request.body
    if(!(label && label.trim() && categoryId)){
        ctx.body = Config.Response(Config.BadRequest, {}, "选项和分类Id不能为空")
        return
    }
    ctx.body = OptionDao.Insert({ label, categoryId })
})

router.post("/select", (ctx, next)=>{
    const { id, label, categoryId} = ctx.request.body
    const whereParam = {id,label,categoryId}
    for(let key in whereParam){
        if(!whereParam[key]){
            delete whereParam[key]
        }
    }
    if(JSON.stringify(whereParam) === "{}"){
        ctx.body = OptionDao.Select(['id','label','categoryId'])
        return
    }
    ctx.body = OptionDao.Select(['id','label','categoryId'], whereParam)
})


router.post("/update", (ctx, next)=>{
    const { id, label, categoryId} = ctx.request.body
    if(!(id && label && categoryId)){
        ctx.body = Config.Response(Config.BadRequest, {}, '参数项不能为空')
        return
    }
    ctx.body = OptionDao.Update({label, categoryId}, {id})
})

router.post("/delete", (ctx, next)=>{
    const { id } = ctx.request.body
    if(!id){
        ctx.body = Config.Response(Config.BadRequest, {}, 'Id不能为空')
        return
    }
    ctx.body = OptionDao.Delete(id)
})

module.exports = router