/* eslint-disable no-unused-vars */

// const sq3 = require('sqlite3')
import sq3 from 'sqlite3'

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

//创建对应的数据库存储表
const tableInit = function () {
  var createImageTableSql = 'create table if not exists image(z INTEGER,x INTEGER, y INTEGER,img BLOB ,type INTEGER);'
  createTable(createImageTableSql)

  // //创建索引
  //   var createIndexX = ' CREATE INDEX image on table_name (x, y)'
  //   createTable(createIndexX)
}

//创建对应的数据库存储表
const tableInitIndex = function () {
  // 创建索引表
  var createImageTableSql = 'create table if not exists indexTable(z INTEGER,x INTEGER, y INTEGER);'
  createTable(createImageTableSql)

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
//开启事务 基于事务完成数据的插入
const insertWork = function (sql, objects) {
  let num = 50
  let dataLength = Math.ceil((objects.length) / num)
  let list = []
  return new Promise((resolve, _reject) => {
    db.serialize(function () {
      let k = 0;
      for (let j = 0; j < dataLength; j++) {
        list = objects.slice(j * num, (j + 1) * num)
        db.run('BEGIN TRANSACTION;');
        for (var i = 0; i < list.length; i++) {
          let insertData = list[i];
          db.run(sql, insertData, (err) => {
            k++;
            // console.log(sql)
            //             console.log(JSON.stringify(insertData))
            // console.log(k)

            if (k == (list.length)) {
              resolve(true)
            };
          })
        };
        db.run('COMMIT TRANSACTION;');
      }
    })
  })
}
const insertWork2 = function (sql, objects) {
  // console.log(objects);
  return new Promise((resolve, _reject) => {
    db.serialize(function () {
      db.run('BEGIN TRANSACTION;');
      let k = 0;
      for (var i = 0; i < objects.length; i++) {
        let insertData = objects[i];
        let sqlStr = sql[i]
        db.run(sqlStr, insertData, (err) => {
          k++;
          if (k == (objects.length)) {
            resolve(true)
          };
        })
      };
      db.run('COMMIT TRANSACTION;');
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
          resolve(true)
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
          resolve(true)
        } else {
          _reject(err)
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
  tableInitIndex,
  insert,
  insertWork,
  insertWork2,
  insertData,
  select,
  update,
  deleteData,
  execSQL,
  close,
  tableFields
}
