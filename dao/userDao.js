
const Config = require("../config")

class UserDao extends Config {
    constructor(db){
        super()
        this.db = db
    }

    Register(username, password, avatar){
        let stmt = this.db.prepare("INSERT INTO tb_user(username, password, avatar) VALUES (?,?,?)");
        let result;
        try{
            result = stmt.run(username, password, avatar);
        }catch(err){
            let errStr = err.toString()
            if(errStr.includes("UNIQUE")){
                return UserDao.Response(UserDao.Unknown, {}, "用户名已经存在")
            }
            return UserDao.Response(UserDao.Unknown, {}, errStr)
        }
        if(result.changes === 1){
            return UserDao.Response(UserDao.OK, {}, "注册成功")
        }
        return UserDao.Response(UserDao.Unknown, {}, "注册失败")
    }

    Login(username, password){
        const row = this.db.prepare('select id, username, avatar from tb_user where username =? and password =?').get(username, password);
        if(row && row.id){
            let token = UserDao.GenerateJWT(row)
            return UserDao.Response(UserDao.OK, {userinfo: row, token: token}, '登录成功')
        }
        return UserDao.Response(UserDao.Unknown, {}, '用户名或密码不对')
    }

    Update(username, avatar){
        // 解析token获取userId
        // 获取的 Authorization 格式为：Bearer <token>
        let userInfo = Config.ParseJWT(ctx.headers.authorization)
        if(!(userInfo && userInfo.id)){
            return Config.Response(Config.Unauthorized, {}, "身份过期，请重新登录")
        }
        let stmt = this.db.prepare("UPDATE tb_user set username=?, avatar=? where id = ?")
        let result;
        try{
            result = stmt.run(username, avatar, userInfo.id);
        }catch(err){
            console.log(err)
        }
    }
}

module.exports = UserDao