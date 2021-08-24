const router = require("koa-router")()
const Config = require("../config")
const fs = require("fs")
const { GetRandomString } = require("../helper")

const path = require("path")
const filePath = path.join(__dirname, "../static/upload/")

router.prefix("/api")

router.get("/index", (ctx, next) => {
  // 设置头类型, 如果不设置，会直接下载该页面
  ctx.type = "html"
  // 读取文件
  const pathUrl = path.join(__dirname, "../static/upload.html")
  ctx.body = fs.createReadStream(pathUrl)
})

// 上传文件
router.post("/upload", (ctx) => {
  const files = ctx.request.files.file
  //  判断是否多文件上传
  try{
    if (Object.prototype.toString.call(files) === "[object Array]") {
      let urls = []
      for (let index in files) {
        urls.push(fileUp(files[index]))
      }
      ctx.body = Config.Response(Config.OK, {urls: urls}, "上传成功")
    } else {
      let filename = fileUp(files)
      ctx.body = Config.Response(Config.OK, {url: filename}, "上传成功")
    }
  }catch(err){
    console.error(err)
    ctx.body = Config.Response(Config.Unknown, {}, "上传失败", err.toString())
  }
})

const fileUp = (file) => {
  // 读取文件流
  const fileReader = fs.createReadStream(file.path)

  // 组装成绝对路径
  const filename = `/${GetRandomString()}@${file.name}`
  const fileResource = filePath + filename

  // 判断 /static/upload 文件夹是否存在，如果不在的话就创建一个
  // fs.createWriteStream 必须在存在目录才能写入文件流
  if (!fs.existsSync(filePath)) {
    fs.mkdir(filePath, (err) => {
      if (err) {
        throw new Error(err)
      } else {
        //  使用 createWriteStream 写入数据，然后使用管道流pipe拼接
        const writeStream = fs.createWriteStream(fileResource)
        fileReader.pipe(writeStream)
        return `${Config.UrlResource}${filename}`
      }
    })
  } 
  //  使用 createWriteStream 写入数据，然后使用管道流pipe拼接
  const writeStream = fs.createWriteStream(fileResource)
  fileReader.pipe(writeStream)
  return `${Config.UrlResource}${filename}`
}

module.exports = router
