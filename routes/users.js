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
  const avatar = `${Config.DefaultUrlResource}/avatar.png`
  ctx.body = UserDao.Register(username, password, avatar)
})

router.post('/login', function (ctx, next) {
  const { username, password } = ctx.request.body;
  if(!(username && password)){
    ctx.body = UserDao.ResponseTpl (Config.BadRequest, {}, '用户名和密码不能为空')
    return
  }
  ctx.body = UserDao.Login(username, password)
})

router.post("/update", function(ctx, next){
  const { username, avatar } = ctx.request.body;
  if(!(username && avatar)){
    ctx.body = UserDao.ResponseTpl(Config.BadRequest, {}, '用户名和头像不能为空')
    return
  }
  ctx.body = UserDao.Update(username, avatar)
})

module.exports = router
