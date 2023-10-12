import db from '@/utils/db'


class SqliteCom {
    constructor(dbPath) {
        this.init(dbPath)
    }
    init(dbPath) {
        db.init(dbPath)
    }
    // 处理参数
    _handParams(obj) {
        let str = ''
        for (let key in obj) {
            str += `${key} = '${obj[key]}' AND `
        }
        return str.slice(0, str.length - 4)
    }
    // 处理异常数据
    _awaitWraper(promise) {
        return promise.then((res) => [null, res])
            .catch((err) => [err, null])
    }
    // 拼接参数
    _splicingParams(obj) {
        var insertData = [];
        var fields = "";
        var fieldsZWF = "";
        for (var key in obj) {
            insertData.push(obj[key]);
            fields += `,${key}`;
            fieldsZWF += `,?`;
        }
        if (insertData.length > 0) {
            fields = fields.slice(1);
            fieldsZWF = fieldsZWF.slice(1);
        }
        return {
            insertData,
            fields,
            fieldsZWF
        }
    }
    // 查询
    /**
     *
     * @param {String} indicate 数据库表名
     * @param {Object} params 查询的参数
     */
    getQueryData(indicate, params = {}, type = '') {
        let sql = ''
        if (type == '') {
            let str = this._handParams(params)
            let where = str ? `WHERE ${str}` : ''
            sql = `SELECT * FROM ${indicate} ${where} ORDER BY CREATE_TIME DESC;`
        } else if (type == 'new') {
            sql = `SELECT CODE  FROM ${indicate} WHERE CREATE_TIME >= datetime( 'now', 'start of day', '+0 day' ) 
            AND CREATE_TIME < datetime( 'now', 'start of day', '+1 day' ) 
           ORDER BY CREATE_TIME DESC LIMIT 1`
        }

        return db.select(sql)
    }
    //添加
    /**
    *
    * @param {String} indicate 数据库表名
    * @param {Object} params 查询的参数
    */
    async getInsertData(indicate, params) {
        let { insertData, fields, fieldsZWF } = this._splicingParams(params)
        let sql = `INSERT INTO ${indicate} (${fields}) VALUES (${fieldsZWF})`
        return db.insertData(sql, insertData)
    }
    _splicingParamsBatch(list) {
        let sumList = []
        var fields = "";
        var fieldsZWF = "";
        debugger
        list.forEach(item => {
            fields = "";
            fieldsZWF = "";
            var insertData = [];
            for (var key in item) {
                insertData.push(item[key]);
                fields += `,${key}`;
                fieldsZWF += `,?`;
            }
            if (insertData.length > 0) {
                fields = fields.slice(1);
                fieldsZWF = fieldsZWF.slice(1);
            }
            sumList.push(insertData);
        })
        return {
            sumList,
            fields,
            fieldsZWF
        }
    }
    // 批量添加
    async getInsertDatas(indicate, list) {
        let { sumList, fields, fieldsZWF } = this._splicingParamsBatch(list)
        let sql = `INSERT INTO ${indicate} (${fields}) VALUES (${fieldsZWF})`
        console.log(sql)
        console.log(JSON.stringify(sumList))

        return db.insertWork(sql, sumList)
    }
    // 删除
    async getDeleteData(indicate, params = {}) {
        let str = this._handParams(params)
        let where = str ? `WHERE ${str}` : ''
        let sql = `DELETE FROM ${indicate} ${where}`
        return db.deleteData(sql)
    }
    // 修改

    // 处理参数  更新时为 UPDATE tb_dict SET CODE = '3333'  , VALUE = '4326,4490,4544,4549,4548_suqian111111'  , HTMLVALUE = ''  , TYPE = '1'  WHERE  id = '79540c3a-662f-4c6c-b763-246905998673'
    _handUpdateParams(obj) {
        let str = ''
        for (let key in obj) {
            str += `${key} = '${obj[key]}' , `
        }
        return str.slice(0, str.length - 2)
    }

    async getUpdateData(indicate, params, ID) {
        let str = this._handUpdateParams(params)
        let where = ID ? `WHERE ${this._handParams(ID)}` : ''
        let sql = `UPDATE ${indicate} SET ${str} ${where}`
        return db.update(sql)
    }
}


export { SqliteCom }
