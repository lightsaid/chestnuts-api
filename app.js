const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const logger = require('koa-logger')
const jwtKoa = require("koa-jwt")
const koaBody = require("koa-body")
const static = require('koa-static');
const Config = require("./config")
const path = require("path")

const cors = require('@koa/cors');

const users = require('./routes/users')
const fileUp = require('./routes/fileup')
const category = require('./routes/category')
const option = require("./routes/option")
const optionValue = require("./routes/optionValue")
const product = require("./routes/product")
const sku = require("./routes/sku")
const shoppingCart = require("./routes/shoppingCart")
const order = require("./routes/order")

// error handler
onerror(app)

app.use(cors());

// middlewares
// 必须放在不需要认证访问接口之前 
app.use((ctx, next) => {
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = Config.Response(Config.Unauthorized, {}, "身份过期，请重新登录")
    } else {
      throw err;
    }
  });
});

// 设置不需要认证访问
app.use(jwtKoa({ secret: Config.PrivateKey }).unless({
  path: [
    /^\/api\/user\/login/,
    /^\/api\/user\/register/,
    // /^\/api\/index/, // TODO:
    // /^\/api\/upload/,
    /^\/static\//,
  ]
}));



// koa-body 配置参考 http://www.ptbird.cn/koa-body.html
app.use(koaBody({
  multipart: true, // 支持文件上传
  jsonLimit: 2 * 1024 * 1024, // 设置 JSON 数据体的大小限制 2M
  formLimit: 2 * 1024 * 1024, // 设置 form 表单请求体大小 2M
  formidable: {
    maxFieldsSize: 4 * 1024 * 1024, // 最大文件为4兆
    multipart: true, // 是否支持 multipart-formdate 的表单
    // keepExtensions: true, // 保留源文件后缀
    // uploadDir: path.join(__dirname,'public/upload')
  }
}))

app.use(static(path.join(__dirname)));

app.use(json())
app.use(logger())
// app.use(static(__dirname + '/public'))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(users.routes(), users.allowedMethods())
app.use(fileUp.routes(), fileUp.allowedMethods())
app.use(category.routes(), category.allowedMethods())
app.use(option.routes(), option.allowedMethods())
app.use(optionValue.routes(), optionValue.allowedMethods())
app.use(product.routes(), product.allowedMethods())
app.use(sku.routes(), sku.allowedMethods())
app.use(shoppingCart.routes(), shoppingCart.allowedMethods())
app.use(order.routes(), order.allowedMethods())


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
