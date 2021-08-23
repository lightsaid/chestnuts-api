// 配置不多，就采取公共配置，不拆分细化了

const jwt = require('jsonwebtoken');

class Config {
    constructor(){
      
    }
    
    // 响应模板
    static Response(code, data, msg){
        return {
            code: code,
            data: data,
            msg: msg
        }
    }

    // 生成 token
    static GenerateJWT(userInfo){
        return jwt.sign(userInfo, Config.PrivateKey, { expiresIn: '4h' })
    }

    // 解析 token
    static ParseJWT(token){
        return jwt.verify(token.split(' ')[1], Config.PrivateKey)
    }
}

Config.OK = 200
Config.BadRequest = 400
Config.Unauthorized = 401
Config.Unknown = 110 // 警报，未知异常

Config.PrivateKey = "xqqlovexzz@1314520"

module.exports = Config