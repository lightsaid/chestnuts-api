// 配置不多，就采取公共配置，不拆分细化了

const jwt = require('jsonwebtoken');

class Config {
    constructor(){
      
    }

    ResponseTpl(code, data, msg){
        return Config.Response(code, data, msg)
    }
    
    // 响应模板
    static Response(code, data, msg, errInfo = null){
        return {
            code: code,
            data: data, // 业务数据
            msg: msg, // 给前端显示
            errInfo: errInfo // 具体错误信息
        }
    }

    // 生成 token
    static GenerateJWT(userInfo){
        return jwt.sign(userInfo, Config.PrivateKey, { expiresIn: '4h' })
    }

    // 解析 token 获取 userinfo
    static ParseJWT(token){
        return jwt.verify(token.split(' ')[1], Config.PrivateKey)
    }
}

Config.OK = 200
Config.BadRequest = 400
Config.Unauthorized = 401
Config.Unknown = 110 // 警报，未知异常

Config.PrivateKey = "xqqlovexzz@1314520"
Config.Port = process.env.PORT || '9999'
Config.UrlResource = `http://localhost:${Config.Port}/static/upload`
Config.DefaultUrlResource = `http://localhost:${Config.Port}/static/default`

Config.pageSize = 10
Config.pageIndex = 0

module.exports = Config