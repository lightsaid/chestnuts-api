const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const jwtKoa = require("koa-jwt")
const koaBody = require("koa-body")
const Config = require("./config")

// const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)

// middlewares

// 必须放在不需要认证访问接口之前 
app.use((ctx, next) => {
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = Config.Response(Config.Unauthorized, {}, "token 验证不通过")
    } else {
      throw err;
    }
  });
});

// 设置不需要认证访问
app.use(jwtKoa({ secret: Config.PrivateKey }).unless({
  path: [
    /^\/api\/user\/login/,
    /^\/api\/user\/register/
  ]
}));

// app.use(koaBody({
//   multipart: true,
//   strict: false,
//   formidable:{
//     // uploadDir: path.json()
//   }
// }))

app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
// app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
