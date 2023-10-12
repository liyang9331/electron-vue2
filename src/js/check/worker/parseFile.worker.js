// import { DataInspection } from "@/js/dataInspection/dataInspection.js";
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// const XLSX = window.require('xlsx')
// const XLSX = window.require('xlsx')
let XLSX = require('xlsx')

// import  XLSX from  'xlsx'

// const dataInspection = new DataInspection()
self.addEventListener('message', function (e) {
    // handleFunc(e.data.lineData,e.data.key)
    // 3. works接收参数并处理 不会影响主线程 不会造成主页面卡顿
    let { filePath, headerRowNum, dataRowNum, data } = e.data
    // let data1 = getFileData(filePath, headerRowNum, dataRowNum, data)
    let data1 = getFileData(filePath, headerRowNum, dataRowNum, data)
    postMessage(data1) // 4. works处理完数据 发送回主页面
    self.close() // 5.记得要关闭哦
}, false)



const getFileData = (fileData, rouNUm, dataNum, data) => {

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
    const header = getHeaderRow(worksheet, rouNUm)
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
const getHeaderRow = (sheet, row) => {
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
