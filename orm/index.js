const Config = require("../config")

// TODO: 提示信息待完善
class Message{
    constructor(
        unique = '名字已经存在', 
        insertTip = {success: '新增成功', fail: "添加失败"}, 
        selectTip = { success: '查询成功', fail: "查询失败" },
        deleteTip =  { success: '删除成功', fail: "删除失败", nofound: '数据不存在' },
        updateTip = { success: '修改成功', fail: '修改失败', nofound: '数据不存在', unique: '数据重复，更改失败'}
    ){
        this.unique = unique
        this.insertTip = insertTip
        this.selectTip = selectTip
        this.deleteTip = deleteTip
        this.updateTip = updateTip
    }
    
    UpdateMessage(parentKey, cheidKey, msg){
        this[parentKey][cheidKey] = msg
    }
}

class CRUD extends Message{
    constructor(db, table, unique, insertTip, selectTip, deleteTip){
        super(unique, insertTip, selectTip, deleteTip)
        this.db = db
        this.table = table
    }   

    /**
     * 
     * @param {*} arr [二位数组，[['id',1], ['name','xx']]]
     * @param {*} sqlKeyword [sql关键字，'AND']
     * @param {*} termStr [sql条件，=、>、<...]
     * @returns id = 1 AND name = xx
     */
    mapKV(arr, sqlKeyword, termStr = '='){
        let suffix = ''
        arr.forEach((kv, index)=>{
            if(index > 0){
                suffix +=  ` ${sqlKeyword} `;
            }
            if(Object.prototype.toString.call(kv[1]) === "[object String]"){
                suffix += `${kv[0]} ${termStr} '${kv[1]}'`; // 字符串增加 ''
            }else{
                suffix += `${kv[0]} ${termStr} ${kv[1]}`; // 数字不添加 ''
            }
        })
        return suffix
    }

    /**
     * 
     * @param {*} model [插入值，{name:'xx', icon:'xx'}]
     * @returns 
     */
    OrmInsert(model){
        let fields = [], values = [], marks = [];
        // 采用 Object.entries 保持了key和value顺序一致
        Object.entries(model).forEach((kvArr)=>{
            fields.push(kvArr[0])
            values.push(kvArr[1])
            marks.push('?')
        })
        let stmt = this.db.prepare(`INSERT INTO ${this.table}(${fields.toString()}) VALUES (${marks.toString()})`);
        let result;
        try{
            result = stmt.run(...values);
            if(result.changes >= 1){
                return Config.Response(Config.OK, {}, this.insertTip.success)
            }
            return Config.Response(Config.Unknown, {}, this.insertTip.fail)
        }catch(err){
            let errStr = err.toString()
            if(errStr.includes("UNIQUE")){
                return Config.Response(Config.Unknown, {}, this.unique)
            }
            return Config.Response(Config.Unknown, {}, errStr)
        }
    }

    /**
     * 
     * @param {*} fields [查询字段，['id','name','icon']]
     * @param {*} whereParam [查询条件，{id:1, name:'xx', icon:'yyy'}]
     * @param {*} termStr [sql条件，=、>、<...]
     * @param {*} page [分页参数，固定格式，{pageIndex: 1, pageSize: 5}] 
     * @returns 
     */
    OrmSelect(fields, whereParam={1: 1}, termStr=' = ', page={pageSize: 10, pageIndex: 0}){
        let prefix = `SELECT ${fields.toString()} FROM ${this.table} `
        let suffix = ''

        // 默认条件 1 = 1， 防止不传值出错
        suffix += " where ";
        suffix += this.mapKV(Object.entries(whereParam), ' AND ', termStr)

        // 存在分页
        suffix += ` limit ${page.pageSize} offset ${page.pageIndex} `

        try{
            console.log("sql=>", `${prefix} ${suffix}`) 
            const list = this.db.prepare(`${prefix} ${suffix}`).all();
            return Config.Response(Config.OK, {list}, this.selectTip.success)
        }catch(err){
            return Config.Response(Config.Unknown, {}, this.selectTip.fail, err.toString())
        }
    }

    /**
     * 
     * @param {*} setParam [更新字段，{id:1, name:'xx', icon:'http://xxx.png'}]
     * @param {*} whereParam [更新条件, {id: 1}]
     * @returns 
     */
    OrmUpdated(setParam, whereParam, termStr) {
        let ssuffix = this.mapKV(Object.entries(setParam), ' , ');
        let wsuffix = this.mapKV(Object.entries(whereParam),'', termStr);
        // console.log("sql=>>", `UPDATE tb_category set ${ssuffix} where ${wsuffix}`)
        let stmt = this.db.prepare(`UPDATE tb_category set ${ssuffix} where ${wsuffix}`)
        let result;
        try{
            result = stmt.run();
            if(result && result.changes >= 1){
                return Config.Response(Config.OK, {}, this.updateTip.success)
            }
            return Config.Response(Config.Unknown, {}, this.updateTip.nofound)
        }catch(err){
            let errStr = err.toString()
            if(errStr.includes("UNIQUE")){
                return Config.Response(Config.Unknown, {}, this.updateTip.unique, err.toString())
            }
            return Config.Response(Config.Unknown, {}, this.updateTip.fail, err.toString())
        }
    }

    /**
     * 
     * @param {*} model [删除条件，{id: 1}]
     * @returns 
     */
    OrmDelete(model, termStr){
        let suffix = this.mapKV(Object.entries(model), " AND ", termStr)
        let stmt = this.db.prepare(`DELETE FROM ${this.table} where ${suffix}`);
        let result;
        try{
            result = stmt.run();
            if(result.changes >= 1){
                return Config.Response(Config.OK, {}, this.deleteTip.success)
            }
            return Config.Response(Config.Unknown, {}, this.deleteTip.nofound)
        }catch(err){
            return Config.Response(Config.Unknown, {}, this.deleteTip.fail, err.toString())
        }
    }
}

module.exports = CRUD






