
const CRUD = require("../orm")

class ShoppingCartDao extends CRUD{
    constructor(db, table, unique, success, fail){
        super(db, table, unique, success, fail)
        this.db = db
    }

    Insert(data){
        return this.OrmInsert(data)
    }

    Select(fields, whereParam){
        return this.OrmSelect(fields, whereParam)
    }

    Update(setParam, whereParam){
        return this.OrmUpdated(setParam, whereParam)
    }

    Delete(id){
        return this.OrmDelete({id})
    }
}

module.exports = ShoppingCartDao