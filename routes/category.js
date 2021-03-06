const router = require("koa-router")()

const Config = require("../config")
const { CategoryDao } = require("../dao")

router.prefix('/api/category')

router.post("/insert", function(ctx, next){
    const { name, icon } = ctx.request.body
    if(!name || (name && name.trim() === "")){
        ctx.body = Config.Response(Config.BadRequest, {}, '分类名字不能为空')
        return
    }
    ctx.body = CategoryDao.Insert(name, icon)
})

router.post("/select", function(ctx, next){
    // const {  } = ctx.request.body
    let fields = ['id','name','icon'];
    ctx.body = CategoryDao.Select(fields)
})

router.post("/update", function(ctx, next){
    const { name, icon, id } = ctx.request.body
    if(!(name && id)){
        ctx.body = Config.Response(Config.BadRequest, {}, "请填写名字或ID")
    }
    ctx.body = CategoryDao.Update(name, icon, id)
})

router.post("/delete", function(ctx, next){
    const { id } = ctx.request.body
    if(!id){
        ctx.body = Config.Response(Config.BadRequest, {}, 'Id不能为空')
        return
    }
    ctx.body = CategoryDao.Delete(id)
})

module.exports = router