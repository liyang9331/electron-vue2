import { coordinateTransformation } from '../../utils/index'
import fs from 'fs'
import path from 'path'
const XLSX = require('xlsx')
import { ElMessage } from 'element-ui'



class Special {
    constructor() {
        this.pointData = {};
        this.lineData = {};
        this.pointArr = [];
        this.lineArr = [];
        this.lineObj = {};
        this.mathCallback = null;
        this.marhEndObj = {}
    }

    init () {

    }
    setMathCallback (value) {
        this.mathCallback = value
    }

    //设置管点数据
    setPoint (fileData, cb) {
        this.pointArr = this.getFileData(fileData)
        this.pointArr = this.pointArr.map(item => {
            let arr = coordinateTransformation(item['2000X'], item['2000Y'])
            return {
                ...item,
                lon: arr.x,
                lat: arr.y
            }
        })
        for (let obj of this.pointArr) {
            this.pointData[obj.id] = obj;
        }
        cb && cb(this.pointArr)
        ElMessage.success({
            message: '管点读取成功,共计：' + this.pointArr.length + "个管点",
            type: 'success'
        })
    }
    //设置管线数据
    setLine (fileData, cb) {
        this.lineArr = this.getFileData(fileData)
        this.lineArr = this.lineArr.map(item => {
            let arr = coordinateTransformation(item['x1'], item['y1'])
            let arr2 = coordinateTransformation(item['x2'], item['y2'])
            return {
                ...item,
                lon: arr.x,
                lat: arr.y,
                lon2: arr2.x,
                lat2: arr2.y,
            }
        })
        let startObj = {};
        let endObj = {};
        let all = {}
        for (let obj of this.lineArr) {
            startObj[obj.start] = obj;
            endObj[obj.end] = obj;
            all[obj.end] = obj;
            all[obj.start] = obj;
        }
        this.lineObj.startObj = startObj
        this.lineObj.endObj = endObj
        this.lineObj.all = all
        cb && cb(this.lineArr)
        ElMessage.success({
            message: '管线读取成功,共计：' + this.lineArr.length + "个管线",
            type: 'success'
        })
    }
    //开始计算
    mathData () {
        this.marhEndObj = {}
        if (this.mathCallback) {
            this.mathCallback(this.marhEndObj)
        }
    }


    getFileData (fileData) {
        let workbook = ''
        // 根据文件路径加载文件
        var data = fs.readFileSync(path.join(fileData[0]))
        // 判断文件是否为scv类型
        const isCSV = fileData[0].split(".")[1] == "csv"
        if (isCSV) {
            // 判断文件格式是否是utf-8,不是给转化下
            const buf = new Uint8Array(data)
            const isUtf8File = isUtf8(buf)
            workbook = XLSX.read(isUtf8File ? data : cptable.utils.decode(936, buf), { type: isUtf8File ? "array" : 'string' });
        } else {
            // 加载excel
            workbook = XLSX.read(data)
        }

        // 获取第一个sheet名字
        const firstSheetName = workbook.SheetNames[0]
        // 根据第一个sheet名字获取表格信息
        const worksheet = workbook.Sheets[firstSheetName]
        // 获取首行
        const header = this.getHeaderRow(worksheet)
        // 获取表格内容
        const results = XLSX.utils.sheet_to_json(worksheet)

        let obj = {}
        obj.header = header;
        obj.results = results;
        return obj.results
    }

    // 获取表格首行
    getHeaderRow (sheet) {
        const headers = []
        const range = XLSX.utils.decode_range(sheet['!ref'])
        let C
        const R = range.s.r
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
export { Special }

