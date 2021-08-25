const router = require("koa-router")()

const Config = require("../config")
const { CategoryDao } = require("../dao")

router.prefix('/api/category')

router.post("/insert", function(ctx, next){
    const { name, icon } = ctx.request.body
    if(!name){
        ctx.body = Config.Response(Config.OK, {}, '分类名字不能为空')
    }
    ctx.body = CategoryDao.Insert(name, icon)
})

router.post("/select", function(ctx, next){
    ctx.body = CategoryDao.Select()
})

router.post("/update", function(ctx, next){
    const { name, icon, id } = ctx.request.body
    if(!(name && id)){
        ctx.body = Config.Response(Config.BadRequest, {}, "请填写名字或ID")
    }
    ctx.body = CategoryDao.Update()
})

module.exports = router