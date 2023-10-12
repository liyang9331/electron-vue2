/**
 * Created by supervisor on 2021/03/15
 */
import { DbSaveData } from '@/js/dbSaveData.js'
import { ElMessage } from "element-ui";
const fs = require('fs')
const path = require('path')

class DbOpenApi {
  constructor(rowData) {
    this.dbServerObj = {};
    this.dbIndexServerObj = {};
    this.rowData = rowData
    this.type = "zxy"
    this.lastDb = null;

    //rowData.type
  }

  init () {
    let that = this
    this.fileArr = [];
    this.fileIndexArr = [];
    this.dbpath = this.rowData.dbpath + "\\"
    //判断文件是否存在 如果不存在则创建对应的数据库
    try {
      let exist = this.IsExist(this.dbpath);
      if (exist) {
        this.setCallbackData({ open: false, data: "" })
        if (this.callBackStatus) {
          this.callBackStatus(false)
        }
        return;
      }

      this.preParellDeep(this.dbpath)
      setTimeout(function () {
        that.setCallbackData({ open: false, data: "正在创建数据库链接" })
        that.linkDataDb()
      }, 3000)
    } catch (e) {
      ElMessage.error(e.toString())
      this.closeAll()
      this.setCallbackData({ open: false, data: "" })
      if (this.callBackStatus) {
        this.callBackStatus(false)
      }
    }
  }

  setSererStatus (value) {
    this.callBackStatus = value
  }

  //判断数据库是否存在
  IsExist (path) {
    var checkDir = fs.existsSync(path);
    if (!checkDir) {
      ElMessage.error('数据文件不存在，请检查!')
      return true
    }
    return false
  }

  setCallbackData (data) {
    if (this.callbackFunc) {
      this.callbackFunc(data)
    }
  }


  //遍历文件数据
  preParellDeep (dir) {
    let that = this
    return new Promise((resolve, reject) => {
      fs.stat(dir, function (err, statObj) {
        if (statObj.isFile()) {
          let pathArr = dir.split("\\");
          let fileName = pathArr[pathArr.length - 1]
          if (fileName.indexOf(".cpData") > -1) {
            that.fileArr.push(dir)
          }
          if (fileName.indexOf(".index") > -1) {
            that.fileIndexArr.push(dir)
          }
        } else {
          fs.readdir(dir, function (err, dirs) {
            dirs.map(item => that.preParellDeep(path.join(dir, item)))
          })
        }
      })
    })
  }

  //链接数据库db
  linkDataDb () {
    //建立图片索引链接
    for (let i = 0; i < this.fileIndexArr.length; i++) {
      let indexPath = this.fileIndexArr[i];
      let paths = indexPath.split("\\");
      let fileAllName = paths[paths.length - 1]
      let fileName = fileAllName.split(".")[0]

      let dbPath = indexPath.replace(".index", ".cpData")
      let dbSaveData = new DbSaveData(dbPath)
      this.dbServerObj[fileName] = dbSaveData
      //为了缓存一个数据库链接方便直接进行读取
      this.lastDb = dbSaveData;
      //创建数据库链接
      let indexSaveData = new DbSaveData(indexPath)
      this.getIndexData(indexSaveData, fileName);
    }

    this.setCallbackData({ open: false, data: "" })
    if (this.callBackStatus) {
      this.callBackStatus(true)
    }
  }

  //查询索引数据
  getIndexData (dbServer, dbname) {
    var sqlStr = `select * from indexTable `
    if (!this.dbIndexServerObj[dbname]) {
      this.dbIndexServerObj[dbname] = {}
    }
    dbServer.select(sqlStr).then((res) => {
      for (var i in res) {
        let key = res[i].z + res[i].x + res[i].y;
        //把对应的索引缓存在地图中
        this.dbIndexServerObj[dbname][key] = dbname
      }
      //查询完数据库之后关闭数据库链接
      dbServer.close()
    }, (err) => {
      console.log('error：', err)
    })

  }


  closeAll () {
    let that = this;
    //索引清空
    this.dbIndexServerObj = {};
    //清空数据库链接
    let tasks = [];
    for (let key in this.dbServerObj) {
      if (this.dbServerObj[key]) {
        //关闭数据库链接
        tasks.push(this.dbServerObj[key].closePromise())
      }
    }
    Promise.all(tasks).then((res) => {
      that.dbServerObj = {}
    }, (err) => {
      console.log('error：', err)
    })
  }

  setCallbask (callbackFunc) {
    this.callbackFunc = callbackFunc
  }


}
export { DbOpenApi }
