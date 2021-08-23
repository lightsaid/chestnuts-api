
const Config = require("../config")

class UserDao extends Config {
    constructor(db){
        super()
        this.db = db
    }

    ResponseTpl(code, data, msg){
        return UserDao.Response(code, data, msg)
    }

    Register(username, password){
        let stmt = this.db.prepare("INSERT INTO tb_user(username, password) VALUES (?,?)");
        let result;
        try{
            result = stmt.run(username, password);
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
}

module.exports = UserDao