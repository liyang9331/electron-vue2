/**
 * Created by supervisor on 2021/03/15
 */

const sq3 = require('sqlite3')
const sqlite3 = sq3.verbose()
class DbSaveData{

  constructor(path) {
    this.db = new sqlite3.Database(path)
    this.path=path
  }


   getDb = function(){
    return this.db
  }

  cnn = function() {
    this.db = new sqlite3.Database(this.dbPath)
  }


  //服务发布方式必须以下的方式进行数据发布

//创建对应的数据库存储表
  tableInit = function() {
    var createImageTableSql = 'create table if not exists image(z INTEGER,x INTEGER, y INTEGER,img BLOB ,type INTEGER);'
    this.createTable(createImageTableSql)


  }

  //创建索引 文件写入之后创建是为了写入速度快
  createIndex = function(){
    //创建一个索引
    var createImageIndexTableSql = ' CREATE UNIQUE INDEX tile_index on image (z, x, y);'
    return  this.createTable(createImageIndexTableSql)
  }
//创建对应的数据库存储表
  tableInitIndex  = function() {
    // 创建索引表
    var createImageTableSql = 'create table if not exists indexTable(z INTEGER,x INTEGER, y INTEGER);'
     this.createTable(createImageTableSql)

  }

  createTable = function(sql) {
    let that=this;
    return new Promise((resolve, _reject) => {
      this.db.serialize(function() {
        that.db.run(sql, function(err) {
          if (err != null) {
            resolve(err)
          } else {
            resolve(true)
          }
        })
      })
    })
  }
//开启事务 基于事务完成数据的插入
  insertWork  = function(sql, objects) {
    let that=this
    return new Promise((resolve, _reject) => {
      this.db.serialize(function() {
        that.db.run('BEGIN TRANSACTION;');
        let k=0;
        for(var i = 0; i < objects.length; i++) {
          let insertData =objects[i];
          that.db.run(sql, insertData, (err) => {
            k++;
            if(k == (objects.length)) {
              resolve(true)
            };
          })
        };
        that.db.run('COMMIT TRANSACTION;');
      })
    })
  }

// / objects format; [[level, column, row, content], [level, column, row, content]]
  insert  = function(sql, objects){
    return new Promise((resolve, _reject) => {
      this.db.serialize(function() {
        var stmt = this.db.prepare(sql)
        for (var i = 0; i < objects.length; ++i) {
          stmt.run(objects[i])

        }
        stmt.finalize()
        resolve(true)
      })
    })
  }
  insertData = function(sql, insertData){
    return new Promise((resolve, _reject) => {
      this.db.serialize(() => {
        this.db.run(sql, insertData, (err) => {
          if (!err) {
            resolve(true)
          } else {
            _reject(err)
          }
        })
      })

    })
  }


  execSQL = function(sql){
    return new Promise((resolve, reject) => {
      this.db.run(sql, function(err) {
        if (err == null) {
          resolve(true)
        } else {
          reject(err)
        }
      })
    })
  }

  closePromise = () =>{
    let that=this;
    return new Promise((resolve, reject) => {
      that.db.close(function(err) {
        if (!err) {
          resolve(true)
        } else {
          reject(err)
        }
      })
      resolve(true)
    }, (reason) => {
      reason(false)
    })
  }

  close = () =>{
    this.db.close()
  }



  selectOne = (sql) => {
    return new Promise((resolve, reject) => {
      this.db.each(sql, function(err, res) {
        if (!err) {
          resolve(res)
        } else {
          reject(err)
        }
      })
    })
  }





  select = (sql) =>  {
    return new Promise((resolve, reject) => {
      this.db.all(sql, function(err, res) {
        if (!err) {
          resolve(res)
        } else {
          reject(err)
        }
      })
    }, (reason) => {
      reason(false)
    })
  }

// 获取表结构
  tableFields  = (tableName) =>{
    let that=this;
    return new Promise((resolve, _reject) => {
      const fieldStr = "PRAGMA  table_info('" + tableName + "');"
      that.db.queryData(fieldStr, (fieldDatas) => {
        resolve(fieldDatas)
      })
    })
  }

//更新 方法
  update  = (sql) =>{
    let that =this;
    return new Promise((resolve, _reject) => {
      this.db.serialize(() => {
        that.db.run(sql, (err) => {
          if (!err) {
            resolve()
          } else {
            _reject(err)
          }
        })
      })
    })
  }
//删除方法 方法
  deleteData  = (sql) =>{
    return new Promise((resolve, _reject) => {
      this.db.serialize(() => {
        this.db.run(sql, (err) => {
          if (!err) {
            resolve()
          } else {
            _reject()
          }
        })
      })
    })
  }
}
export {DbSaveData}
