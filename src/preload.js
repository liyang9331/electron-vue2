// 建表脚本，导出db对象供之后使用
const path = require('path')
// const sq3 = require('sqlite3')

var dataFile = ''

if (process.env.WEBPACK_DEV_SERVER_URL) {
    dataFile = '../'
} else {
    dataFile = '../../'
}
const appPath = __dirname
const rootPath = path.join(appPath, dataFile)
const dbPath = path.join(rootPath, '/data/db.db')
// const sqlite3 = sq3.verbose()
// const db = new sqlite3.Database(dbPath)

const sq3 = require('sqlite3')
const sqlite3 = sq3.verbose()
var db = new sqlite3.Database(dbPath)

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
var config = []
select('select * from config').then(res => {
    db.close()
    // var sysConfig = {}
    if (res && res.length > 0) {
        config = res
        // for (var i in res) {
        //   sysConfig[res[i]['name']] = res[i]['value']
        // }
    }
    // windows 全局对象
    global.config = function (confName) {
        for (var i in config) {
            if (config[i].name === confName) {
                return config[i]
            }
        }
    }
})
process.once('loaded', () => {
    global.appPath = appPath
    global.rootPath = rootPath
    global.dbPath = dbPath
})