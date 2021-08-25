
const Config = require("../config")
const CRUD = require("../orm")

class CategoryDao extends CRUD{
    constructor(db, table, unique, success, fail){
        super(db, table, unique, success, fail)
        this.db = db
    }

    Insert(name, icon){
        return this.OrmInsert({name, icon})
    }

    Select(fields, whereParam){
        return this.OrmSelect(fields, whereParam)
    }

    Update(name, icon, id){
        return this.OrmUpdated({name, icon}, {id})
    }

    Delete(id){
        return this.OrmDelete({id})
    }
}

module.exports = CategoryDao