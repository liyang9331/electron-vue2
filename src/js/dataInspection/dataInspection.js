/**
 * Created by supervisor on 2021/03/15
 */

import fs from 'fs'
import path from 'path'
const XLSX = require('xlsx')
// import * as XLSX from 'xlsx'
import { ElMessage } from 'element-ui'
import isUtf8 from '../../utils/index'
const cptable = require("xlsx/dist/cpexcel.js");
// import cptable from 'xlsx/dist/cpexcel.js'
// import db from "@/utils/db";
// import '@/utils/ProjData'
import shp from 'shpjs'





class DataInspection {
    constructor() {
        this.pointData = {};
        this.lineData = {};
        this.pointArr = [];
        this.lineArr = [];
        this.lineObj = {};
        this.mathCallback = null;
        this.marhEndObj = {}
        this.shpData = []
    }

    init () {

    }
    setMathCallback (value) {
        this.mathCallback = value
    }

    cleanData () {
        this.pointData = {};
        this.lineData = {};
        this.pointArr = [];
        this.lineArr = [];
        this.lineObj = {};
    }
    //设置管点数据
    setPoint (fileData, rowNum, dataNum, cb) {
        return new Promise((resolve, reject) => {
            // for (let i= 0; i<100000000; i++) {
            //     i % 1000 == 0 ? console.log(i) : '';
            // }
            let objInfor = this.getFileData(fileData, rowNum, dataNum)
            this.pointArr = objInfor.results
            resolve(objInfor)
            // cb && cb(objInfor)
        })


    }

    // 存储到本地数据库
    addCheckData (tableName, fieldInfo, type) {
        var arr1 = []
        var arr2 = []
        var fields = ""
        var fieldsZWF = ""
        var parmsurl = ''
        var parmsurlArr = []
        // 批量处理数据
        fieldInfo.forEach(item => {
            arr1 = []
            fields = ''
            fieldsZWF = ''
            parmsurl = ''
            for (var key in item) {
                arr1.push(item[key])
                fields += `,'${key}'`
                fieldsZWF += `,?`
            }
            if (arr1.length > 0) {
                fields = fields.slice(1)
                fieldsZWF = fieldsZWF.slice(1)
            }
            arr2.push(arr1)
            parmsurl = `INSERT OR IGNORE INTO ${tableName} (${fields}) VALUES (${fieldsZWF})`
            parmsurlArr.push(parmsurl)

        })
        db.insertWork2(parmsurlArr, arr2).then(res => {
            if (res) {
                ElMessage.success('创建成功')
            }
        })
    }


    //设置管线数据
    setLine (fileData, rowNum, dataNum, cb) {
        return new Promise((resolve, reject) => {
            let objInfor = this.getFileData(fileData, rowNum, dataNum)
            this.lineArr = objInfor.results
            resolve(objInfor)
            // cb && cb(objInfor)
        })
    }
    // 解析shp文件数据
    analysisShp (fileData, cb) {
        if (!fileData) {
            return
        }
        let that = this;
        fs.readFile(path.join(fileData), function (err, data) {
            if (err) {
                return console.error(err)
            }
            var fileData = that.toArrayBuffer(data)
            shp(fileData).then(function (geojson) {
                console.log(geojson);
                cb && cb(geojson)
            }).catch(err => {
                console.error(err);
            })
        })
    }

    //方法1
    //Buffer转ArrayBuffer
    toArrayBuffer (buf) {
        var ab = new ArrayBuffer(buf.length);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; ++i) {
            view[i] = buf[i];
        }
        return ab;
    }

    //ArrayBuffer转Buffer
    toBuffer (ab) {
        var buf = new Buffer(ab.byteLength);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; ++i) {
            buf[i] = view[i];
        }
        return buf;
    }


    getFileData (fileData, rouNUm, dataNum, data) {

        let workbook = ''
        // 根据文件路径加载文件
        // var data = fs.readFileSync(path.join(fileData))
        // 判断文件是否为scv类型
        const isCSV = fileData.split(".")[1] == "csv"
        if (isCSV) {
            // 判断文件格式是否是utf-8,不是给转化下
            const buf = new Uint8Array(data)
            const isUtf8File = isUtf8(buf)
            workbook = XLSX.read(isUtf8File ? data : cptable.utils.decode(936, buf), { type: isUtf8File ? "array" : 'string', cellDates: true });
        } else {
            // 加载excel
            workbook = XLSX.read(data)
        }

        // 获取第一个sheet名字
        const firstSheetName = workbook.SheetNames[0]
        // 根据第一个sheet名字获取表格信息
        const worksheet = workbook.Sheets[firstSheetName]
        // 获取首行
        const header = this.getHeaderRow(worksheet, rouNUm)
        // 处理获取表格指定行后面的数据
        var xlsxLth = workbook.Sheets[workbook.SheetNames[0]]["!ref"];
        var stopX = xlsxLth.substr(xlsxLth.indexOf(':') + 1, workbook.Sheets[workbook.SheetNames[0]]["!ref"].length);
        workbook.Sheets[workbook.SheetNames[0]]["!ref"] = `A${dataNum - 1}:` + stopX
        // 获取表格内容
        const sheet2JSONOpts = {
            // defval: ''//给defval赋值为空的字符串
        }
        const results = XLSX.utils.sheet_to_json(worksheet, sheet2JSONOpts)

        let obj = {}
        obj.header = header;
        obj.results = results;
        return obj
    }

    // 获取表格首行
    getHeaderRow (sheet, row) {
        const headers = []
        const range = XLSX.utils.decode_range(sheet['!ref'])
        let C
        const R = Number(row) - 1
        /* start in the first row */
        for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
            const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
            /* find the cell in the first row */
            let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
            if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
            headers.push(hdr)
        }
        return headers
    }

}
export { DataInspection }


