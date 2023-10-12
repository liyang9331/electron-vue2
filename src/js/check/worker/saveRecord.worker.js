import { guid, getCurrentTime } from "@/utils/index";
// const sqlite = require('sqlite3')
import { SqliteCom } from "@/js/sqlite/index";
// import db from '@/utils/db'
// import sq3 from 'sqlite3'
// const sq3 = require('sqlite3')
let surfaceName = "tb_history"
let surfaceNameFile = "tb_file"
let surfaceNameMath = "tb_math"
let surfaceNameResult = "tb_result"
let surfaceNameRawData = "tb_raw_data"
self.addEventListener('message', function (e) {
    // handleFunc(e.data.lineData,e.data.key)
    // 3. works接收参数并处理 不会影响主线程 不会造成主页面卡顿
    
    let { ruleForm, dbPath, uploadedFilesList, checkItemData, testResultInfor, pipeLineData, pipePointData } = e.data
    let sqliteCom = new SqliteCom(dbPath)
    // ruleForm = JSON.parse(ruleForm)
    // uploadedFilesList = JSON.parse(uploadedFilesList)
    // checkItemData = JSON.parse(checkItemData)
    // testResultInfor = JSON.parse(testResultInfor)
    // pipeLineData = JSON.parse(pipeLineData)
    // pipePointData = JSON.parse(pipePointData)
    // sqliteCom = JSON.parse(sqliteCom)
    let data1 = getSaveHistory(ruleForm, sqliteCom, uploadedFilesList, checkItemData, testResultInfor, pipeLineData, pipePointData)
    postMessage(data1) // 4. works处理完数据 发送回主页面
    self.close() // 5.记得要关闭哦

}, false)

// 获取最新的一条数据
const getNewData = () => {
    return new Promise((resolve, reject) => {
        sqliteCom.getQueryData(surfaceName, {}, "new").then((res) => {
            if (res.length != 0) {
                let code =
                    res[0].CODE.substring(res[0].CODE.length - 3) - 0 + 1 + "";
                while (code.length < 3) {
                    //当字符串长度小于设定长度时，在前面加0
                    code = "0" + code;
                }
                resolve(code);
            } else {
                resolve("001");
            }
        });
    });
}

// 保存历史记录
const getSaveHistory = async (ruleForm, sqliteCom, uploadedFilesList, checkItemData, testResultInfor, pipeLineData, pipePointData) => {
    let res = await sqliteCom.getQueryData(surfaceName, {
        record_name: ruleForm.record_name,
    });
    if (res.length == 0) {
        // 获取最新的一条数据
        let code = await getNewData();
        let params = {
            record_name: ruleForm.record_name,
            remark: ruleForm.remark,
            ID: guid(),
            CODE: `GW${getCurrentTime()}${code}`,
        };
        let res2 = this.sqliteCom.getInsertData(this.surfaceName, params);
        if (res2) {
            return allCallBack(sqliteCom, uploadedFilesList, checkItemData, testResultInfor, pipeLineData, pipePointData)
        }

    } else {
        return false
    }
}
const allCallBack = (history_id, uploadedFilesList, checkItemData, testResultInfor, pipeLineData, pipePointData) => {
    return Promise.all([
        getSaveFile(history_id, uploadedFilesList),
        getSaveMath(history_id, checkItemData),
        getSaveResult(history_id, testResultInfor),
        getMapData(history_id, pipeLineData, pipePointData),
    ])
}

// 存文件
const getSaveFile = (history_id, uploadedFilesList) => {
    let arr = uploadedFilesList.map((item) => {
        return {
            ID: guid(),
            history_id: history_id,
            file_name: item.file_name,
            file_type: item.file_type,
            file_path: item.file_path,
            data_type: item.data_type,
            assets_type: item.assets_type,
            title_index: item.title_index,
            data_index: item.data_index,
            field_match: JSON.stringify(item.fieldDescription),
        };
    });
    return sqliteCom.getInsertDatas(surfaceNameFile, arr);
}
// 存计算公式
const getSaveMath = (history_id) => {
    let arr = checkItemData.map((item) => {
        return {
            ...item,
            config_value: configAccident[item.computationalFunction],
        };
    });
    let params = {
        ID: guid(),
        history_id: history_id,
        con_fig: JSON.stringify(arr),
    };
    return sqliteCom.getInsertData(surfaceNameMath, params);
}
// 存储计算结果
const getSaveResult = (history_id) => {
    let arr = [];
    for (let key in testResultInfor) {
        let obj = {
            ID: guid(),
            history_id: history_id,
            code: key,
            result: JSON.stringify(testResultInfor[key]),
        };
        arr.push(obj);
    }
    return sqliteCom.getInsertDatas(surfaceNameResult, arr);
}
// 存储地图上的数据
const getMapData = (history_id) => {
    let arr = [...pipeLineData, ...pipePointData];
    let list = arr.map((item) => {
        return {
            ID: guid(),
            history_id: history_id,
            code:
                item.data_type == "point"
                    ? item.assetsId
                    : item.assetsId + "-" + item.assetsId2,
            data_json: JSON.stringify(item),
            data_type: item.data_type,
        };
    });
    return sqliteCom.getInsertDatas(surfaceNameRawData, list);
}

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
  return new Promise((resolve, _reject) => {
    db.serialize(function () {
      db.run('BEGIN TRANSACTION;');
      let k = 0;
      for (var i = 0; i < objects.length; i++) {
        let insertData = objects[i];
        db.run(sql, insertData, (err) => {
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
const insertWork2 = function (sql, objects) {
  console.log(objects);
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