/* eslint-disable no-unused-vars */
import { ElMessage } from "element-ui";

const sq3 = require('sqlite3')
// const db = window.db

let dbPath = null;
//window.dbPath

let sqlite3 = null;
var db = null;
const init = function (path) {
  dbPath = path
  sqlite3 = sq3.verbose()
  db = new sqlite3.Database(dbPath)
}
const getDb = function () {
  return db
}


const cnn = function () {
  db = new sqlite3.Database(dbPath)
}

const tableInit = function () {
  var createTileTableSql = 'create table if not exists tables(table_name TEXT, update_time INTEGER,table_remarks TEXT );'
  var createLabelTableSql = 'create table if not exists fields(table_name TEXT, field_name TEXT, field_type TEXT, field_remarks TEXT, field_size integer, update_time integer, sort integer );'
  createTable(createTileTableSql)
  createTable(createLabelTableSql)

  // 创建并生成表
  select('select * from tables').then((res) => {
    console.log('创建并生成表')
    for (var i = 0; i < res.length; ++i) {
      // 获取fields表中的所有数据
      var getFields = function () {
        return new Promise((resolve, _reject) => {
          const fieldsStr = "select * from fields where table_name='" + res[i].table_name + "';"
          select(fieldsStr).then((res2) => {
            let fStr = ''
            let cStr = ''
            for (var j = 0; j < res2.length; ++j) {
              fStr += res2[j].field_name + ' ' + res2[j].field_type
              if (j < res2.length - 1) {
                fStr += ','
              }
              cStr = 'create table if not exists ' + res2[j].table_name + '(' + fStr + ');'
            }
            createTable(cStr)
            resolve(res2)
          })
        })
      }
      // 根据表名获取表结构
      var getTableFields = (tableName) => {
        return new Promise((resolve, _reject) => {
          const fieldStr = "PRAGMA  table_info('" + tableName + "');"
          db.queryData(fieldStr, (fieldDatas) => {
            resolve(fieldDatas)
          })
        })
      }
      getFields(res[i].table_name).then(async (res) => {
        for (var j = 0; j < res.length; ++j) {
          // 根据表名获取表结构
          await getTableFields(res[j].table_name).then((res2) => {
            var yes = false
            for (var k = 0; k < res2.length; ++k) {
              // 判断自定义结构表中的字段是否在表中已生成
              if (res[j].field_name === res2[k].name) {
                yes = true
                break
              }
            }
            // 表中没有生成字段则创建字段
            if (yes === false) {
              var alSql = 'ALTER TABLE ' + res[j].table_name + ' ADD ' + res[j].field_name + ' ' + res[j].field_type + ';'
              createTable(alSql)
            }
          })
        }
      })
    }
  })
}

const createTable = function (sql) {
  return new Promise((resolve, _reject) => {
    db.serialize(function () {
      db.run(sql, function (err) {
        if (err != null) {
          resolve(err)
        } else {
          resolve(true)
        }
      })
    })
  })
}

// / objects format; [[level, column, row, content], [level, column, row, content]]
const insert = function (sql, objects) {
  return new Promise((resolve, _reject) => {
    db.serialize(function () {
      var stmt = db.prepare(sql)
      for (var i = 0; i < objects.length; ++i) {
        stmt.run(objects[i])
      }
      stmt.finalize()
      resolve(true)
    })
  })
}
const insertData = function (sql, insertData) {
  return new Promise((resolve, _reject) => {
    db.serialize(() => {
      db.run(sql, insertData, (err) => {
        if (!err) {
          resolve(true)
        } else {
          _reject(err)
        }
      })
    })

  })
}





const execSQL = function (sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, function (err) {
      if (err == null) {
        resolve(true)
      } else {
        reject(err)
      }
    })
  })
}

const close = function () {
  db.close()
}

const select = (sql) => {
  return new Promise((resolve, reject) => {
    db.all(sql, function (err, res) {
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
const tableFields = (tableName) => {
  return new Promise((resolve, _reject) => {
    const fieldStr = "PRAGMA  table_info('" + tableName + "');"
    db.queryData(fieldStr, (fieldDatas) => {
      resolve(fieldDatas)
    })
  })
}

//更新 方法
const update = function (sql) {
  return new Promise((resolve, _reject) => {
    db.serialize(() => {
      db.run(sql, (err) => {
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
const deleteData = function (sql) {
  return new Promise((resolve, _reject) => {
    db.serialize(() => {
      db.run(sql, (err) => {
        if (!err) {
          resolve()
        } else {
          _reject()
        }
      })
    })
  })
}


export default {
  db,
  init,
  cnn,
  getDb,
  createTable,
  tableInit,
  insert,
  insertData,
  select,
  update,
  deleteData,
  execSQL,
  close,
  tableFields
}
