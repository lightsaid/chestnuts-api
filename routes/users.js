const router = require('koa-router')()
const Config = require("../config")
const fs = require("fs")
const { UserDao } = require("../dao")
router.prefix('/api/user')
const path = require("path")


router.get('/index', (ctx, next) => {
  // 设置头类型, 如果不设置，会直接下载该页面
  ctx.type = 'html';
  // 读取文件
  const pathUrl = path.join(__dirname, '../static/upload.html');
  ctx.body = fs.createReadStream(pathUrl);
});

// 上传文件
router.post('/upload', (ctx) => {
  const uploadUrl = "http://localhost:3000/static/upload";
  const file = ctx.request.files.file;  
  // console.log(file)
  // 读取文件流
  const fileReader = fs.createReadStream(file.path);
  const filePath = path.join(__dirname, '../static/upload/');
  // 组装成绝对路径
  const fileResource = filePath + `/${file.name}`;
  console.log("fileResource=>>>", fileResource)

  /*
   使用 createWriteStream 写入数据，然后使用管道流pipe拼接
  */
  const writeStream = fs.createWriteStream(fileResource);
  // 判断 /static/upload 文件夹是否存在，如果不在的话就创建一个
  if (!fs.existsSync(filePath)) {
    fs.mkdir(filePath, (err) => {
      if (err) {
        throw new Error(err);
      } else {
        fileReader.pipe(writeStream);
        ctx.body = {
          url: uploadUrl + `/${file.name}`,
          code: 0,
          message: '上传成功'
        };
      }
    });
  } else {
    fileReader.pipe(writeStream);
    ctx.body = {
      url: uploadUrl + `/${file.name}`,
      code: 0,
      message: '上传成功'
    };
  }
});


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
