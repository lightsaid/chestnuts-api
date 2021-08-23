const router = require('koa-router')()
const Config = require("../config")
const { UserDao } = require("../dao")
router.prefix('/api/user')

router.post('/register', function (ctx, next) {
  const { username, password } = ctx.request.body;
  if(!(username && password)){
    ctx.body = UserDao.ResponseTpl (Config.BadRequest, {}, '用户名和密码不能为空')
    return
  }
  ctx.body = UserDao.Register(username, password)
})

router.post('/login', function (ctx, next) {
  const { username, password } = ctx.request.body;
  if(!(username && password)){
    ctx.body = UserDao.ResponseTpl (Config.BadRequest, {}, '用户名和密码不能为空')
    return
  }
  ctx.body = UserDao.Login(username, password)
})

module.exports = router
