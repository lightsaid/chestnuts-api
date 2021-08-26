const router = require("koa-router")()
const Config = require("../config")
const { OrderDao } = require("../dao")

router.prefix("/api/order")

router.post("/insert", (ctx, next)=>{
    // ctx.request.body = {
    //     address: 'xxx',
    //     items: [{skuId: 2, quantity:1}]
    // }
    /**
     *  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
        orderId INTEGER NOT NULL,
        sku TEXT NULL,
        imgNormal VARCHAR(255) NOT NULL,
        salePrice DECIMAL(8,2) NOT NULL,
        quantity INT NOT NULL,
        FOREIGN KEY(orderId) REFERENCES tb_order(id)
     */

        
    //    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    //    productId INTEGER NOT NULL,
    //    sku TEXT NULL,
    //    imgNormal VARCHAR(255) NOT NULL,
    //    stock INT NOT NULL,
    //    salePrice DECIMAL(8,2) NOT NULL,
    //    FOREIGN KEY(productId) REFERENCES tb_product(id)

    const userinfo = Config.ParseJWT(ctx.headers.authorization)     
    if(!(userinfo && userinfo.id)){
        ctx.body = Config.Response(Config.Unauthorized,{},"身份过期，请重新登录")
        return
    }

    const { address, items } = ctx.request.body
    if(!(address && address.trim())){
        ctx.body = Config.Response(Config.BadRequest, {}, "地址不能为空")
        return
    }
    if(!(items && items.length)){
        ctx.body = Config.Response(Config.BadRequest, {}, "请选择商品")
        return
    }
    let suffixArr = []
    // 查询 sku 表获取下单商品
    items.forEach((item, index)=>{
        let temp = new Array(2)
        temp[0] = 'id'
        temp[1] = item.skuId
        suffixArr.push(temp)
    })
    let skuField = ["id","productId","sku","imgNormal","stock","salePrice"];

    let suffix = OrderDao.mapKV(suffixArr, 'OR', '=')
    console.log('sql=>>>', `SELECT ${skuField.toString()} where ${suffix}`)
    // TODO:
    const list = OrderDao.db.prepare(`SELECT ${skuField.toString()} from tb_sku where ${suffix}`).all();
    ctx.body = Config.Response(Config.BadRequest, {list}, "测试")
    // OrderDao.Insert({ userId: userinfo.id, address, status:'1'  })
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
        ctx.body = OrderDao.Select(['id','label','categoryId'])
        return
    }
    ctx.body = OrderDao.Select(['id','label','categoryId'], whereParam)
})

router.post("/update", (ctx, next)=>{
    const { id, label, categoryId} = ctx.request.body
    if(!(id && label && categoryId)){
        ctx.body = Config.Response(Config.BadRequest, {}, '参数项不能为空')
        return
    }
    ctx.body = OrderDao.Update({label, categoryId}, {id})
})

router.post("/delete", (ctx, next)=>{
    const { id } = ctx.request.body
    if(!id){
        ctx.body = Config.Response(Config.BadRequest, {}, 'Id不能为空')
        return
    }
    ctx.body = OrderDao.Delete(id)
})

module.exports = router