
const Config = require("../config")

class CategoryDao extends Config {
    constructor(db){
        super()
        this.db = db
    }

    Insert(name, icon){
        let stmt = this.db.prepare("INSERT INTO tb_category(name, icon) VALUES (?,?)");
        let result;
        try{
            result = stmt.run(name, icon);
        }catch(err){
            let errStr = err.toString()
            if(errStr.includes("UNIQUE")){
                return Config.Response(Config.Unknown, {}, "分类名字已经存在")
            }
            return Config.Response(Config.Unknown, {}, errStr)
        }
        if(result.changes === 1){
            return Config.Response(Config.OK, {}, "新增成功")
        }
        return Config.Response(Config.Unknown, {}, "新增失败")
    }

    Select(){
        const list = this.db.prepare('select id, name, icon from tb_category').all();
        return Config.Response(Config.OK, {list}, '查询成功')
    }

    Update(name, icon, id){
        let stmt = this.db.prepare("UPDATE tb_category set name=?, icon=? where id = ?")
        let result;
        try{
            result = stmt.run(name, icon, id);
            if(result && result.changes === 1){
                return Config.Response(Config.OK, {}, '修改成功')
            }
            return Config.Response(Config.Unknown, {}, '数据不存在')
        }catch(err){
            return Config.Response(Config.Unknown, {}, '修改失败', err.toString())
        }
    }
}

module.exports = CategoryDao