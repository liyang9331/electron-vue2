/**
 * Created by supervisor on 2021/03/15
 */

import fs from 'fs'
import path from 'path'
const XLSX = require('xlsx')
import { ElMessage } from 'element-ui'
import isUtf8 from '../../utils/index'
const cptable = require("xlsx/dist/cpexcel.js");
import { AbnormalPipeDiameter } from './check2'
import { intersectCheck } from './intersectCheck'

import { coordinateTransformation } from '../../utils/index'
import store from '../../store/index'
import db from "@/utils/db";
import proj4 from 'proj4'
import shp from 'shpjs'



class Check {
  constructor() {
    this.pointData = {};
    this.lineData = {};
    this.pointArr = [];
    this.lineArr = [];
    this.lineObj = {};
    this.mathCallback = null;
    this.marhEndObj = {}
    this.abnormalPipeDiameter = new AbnormalPipeDiameter()
    this.checkName = 'check_info'
    this.checkNameLine = 'check_info_line'

    this.intersectCheck = new intersectCheck();

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
  setPoint (fileData) {
    this.pointArr = this.getFileData(fileData)
    this.pointArr = this.pointArr.map(item => {
      let arr = coordinateTransformation(item['2000X'], item['2000Y'])
      return {
        ...item,
        lon: arr.x.toFixed(8),
        lat: arr.y.toFixed(8)
      }
    })
    this.addCheckData(this.checkName, this.pointArr)
    // 存储到vuex中
    // store.commit('check/changePoint', this.pointArr)
    for (let obj of this.pointArr) {
      this.pointData[obj.id] = obj;
    }
    ElMessage.success({
      message: '管点读取成功,共计：' + this.pointArr.length + "个管点",
      type: 'success'
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
  setLine (fileData) {
    this.lineArr = this.getFileData(fileData)
    this.lineArr = this.lineArr.map(item => {
      let arr = coordinateTransformation(item['x1'], item['y1'])
      let arr2 = coordinateTransformation(item['x2'], item['y2'])
      return {
        ...item,
        lon: arr.x.toFixed(8),
        lat: arr.y.toFixed(8),
        lon2: arr2.x.toFixed(8),
        lat2: arr2.y.toFixed(8),
      }
    })
    this.addCheckData(this.checkNameLine, this.lineArr)
    // store.commit('check/changeLine', this.lineArr)
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

    ElMessage.success({
      message: '管线读取成功,共计：' + this.lineArr.length + "个管线",
      type: 'success'
    })
  }
  // 解析shp文件数据
  analysisShp (fileData) {
    if (fileData.length <= 0) {
      return
    }
    let that = this;
    fs.readFile(path.join(fileData[0]), function (err, data) {
      if (err) {
        return console.error(err)
      }

      //       let  startData  = 'PROJCS["CGCS2000_3_Degree_GK_CM_120E",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",120.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]'
      //                         'PROJCS["CGCS2000_3_Degree_GK_CM_120E",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",
      //                         DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],
      //                         PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],
      //                         PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",500000.0],
      //                         PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",120.0],
      //                         PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]'

      //       let g1984='"GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],VERTCS["EGM96_Geoid",VDATUM["EGM96_Geoid"],PARAMETER["Vertical_Shift",0.0],PARAMETER["Direction",1.0],UNIT["Meter",1.0]]"'
      //       let g123e='PROJCS["CGCS2000_GK_CM_123E",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",123.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]'
      //      let g1231="+proj=tmerc +lat_0=0 +lon_0=123 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs"
      //                   // GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]
      // //       let test1='PROJCS["CGCS2000_GK_CM_117E",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",117.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]'
      // //       var firstProjection = 'PROJCS["NAD83 / Massachusetts Mainland",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4269"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",42.68333333333333],PARAMETER["standard_parallel_2",41.71666666666667],PARAMETER["latitude_of_origin",41],PARAMETER["central_meridian",-71.5],PARAMETER["false_easting",200000],PARAMETER["false_northing",750000],AUTHORITY["EPSG","26986"],AXIS["X",EAST],AXIS["Y",NORTH]]';
      //       var secondProjection = "+proj=gnom +lat_0=90 +lon_0=0 +x_0=6300000 +y_0=6300000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
      // // //I'm not going to redefine those two in latter examples.
      //      let obj = proj4(g1231,secondProjection,[2,5]);


      var fileData = that.toArrayBuffer(data)
      shp(fileData).then(function (geojson) {
        console.log(geojson);
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
  //开始计算
  mathData () {
    this.marhEndObj = {}
    this.mathPointNotLine()
    this.mathLineNotPoint()
    this.mathRelPoint()
    this.intersectCheckFunc()
    if (this.mathCallback) {
      this.mathCallback(this.marhEndObj)
    }
    // this.CheckTwo.nodeDuplicate(this.pointArr)
    this.abnormalPipeDiameter.onAbnormalPipeDiameter(this.lineArr)
  }
  //查询管点未找到管线
  mathPointNotLine () {
    let dataArr = []
    let ids = []
    for (let key in this.pointData) {
      // this.lineObj.startObj=startObj
      // this.lineObj.endObj=endObj
      if (!this.lineObj.all[key]) {
        dataArr.push(this.pointData[key])
        ids.push(key);
      }
    }
    this.marhEndObj.pointNotLineStr = ids.join(",")
    this.marhEndObj.pointNotLine = dataArr
    // console.log('未找到管线的点位',dataArr)
  }
  //查询管线未找到管点
  mathLineNotPoint () {
    let dataArr = []
    for (let key in this.lineObj.all) {
      if (!this.pointData[key]) {
        dataArr.push(this.lineObj.all[key])
      }
    }
    this.marhEndObj.LineNotPoint = dataArr
    // console.log('未找到管点的管线',dataArr)
  }
  //查询管线管点关联与真实位置的点数据
  mathRelPoint () {
    let dataArr = []
    let cdataArr = []

    for (let obj of this.lineArr) {
      let startPoint = this.pointData[obj.start];
      let endPoint = this.pointData[obj.end];
      if (startPoint) {
        let px = Math.pow(startPoint.x - obj.x1, 2)
        let py = Math.pow(startPoint.y - obj.y1, 2)
        let math = Math.sqrt(px + py);
        if (math > 10) {
          let objItem = {}
          objItem.title = "起点太远";
          objItem.value = math;
          objItem.line = obj;
          objItem.point = startPoint;
          dataArr.push(objItem)
        }
      }
      if (endPoint) {
        let px = Math.pow(endPoint.x - obj.x2, 2)
        let py = Math.pow(endPoint.y - obj.y2, 2)
        let math = Math.sqrt(px + py);
        if (math > 10) {
          let objItem = {}
          objItem.title = "结束点太远";
          objItem.value = math;
          objItem.line = obj;
          objItem.point = endPoint;
          dataArr.push(objItem)
        }
      }

      let px = Math.pow(obj.x1 - obj.x2, 2)
      let py = Math.pow(obj.y1 - obj.y2, 2)
      let cmath = Math.sqrt(px + py);
      if (cmath > 2000) {
        let objItem = {}
        objItem.title = "管线过长";
        objItem.value = cmath;
        objItem.line = obj;
        cdataArr.push(objItem)
      }

    }
    this.marhEndObj.notNearCmath = cdataArr

    this.marhEndObj.notNear = dataArr
  }


  //查看管线是否相交
  intersectCheckFunc () {
    this.intersectCheck.init(this.lineArr, this.pointArr)
    let currentDate = new Date();
    console.log(currentDate.getTime())
    let intersectArr = this.intersectCheck.checkData()
    let endDate = new Date();
    console.log(endDate.getTime())
    console.log("计算时间：", endDate.getTime() - currentDate.getTime())
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
      workbook = XLSX.read(isUtf8File ? data : cptable.utils.decode(936, buf), { type: isUtf8File ? "array" : 'string', cellDates: true });
    } else {
      // 加载excel
      workbook = XLSX.read(data)
    }

    // 获取第一个sheet名字
    const firstSheetName = workbook.SheetNames[0]
    // 根据第一个sheet名字获取表格信息
    const worksheet = workbook.Sheets[firstSheetName]
    console.log(worksheet);
    // 获取首行
    const header = this.getHeaderRow(worksheet)
    const sheet2JSONOpts = {
      /** Default value for null/undefined values */
      defval: null,           //单元格为空时的默认值,
    }
    // 获取表格内容
    const results = XLSX.utils.sheet_to_json(worksheet)
    // console.log('表头', header)
    // console.log('表内容', results)
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
      // 表格内容为空时，该格自动填写__EMPTY
      if (hdr.indexOf('UNKNOWN') > -1) {
        if (!i) {
          hdr = '__EMPTY';
        } else {
          hdr = '__EMPTY_' + i;
        }
        i++;
      }
      headers.push(hdr)
    }
    return headers
  }

}
export { Check }


// CREATE TABLE "check_info" (
//   "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
//   "标识码" INTEGER,
//   "lon" REAL,
//   "lat" REAL,
//   "2000X" REAL,
//   "2000Y" REAL,
//   "地面高程" TEXT,
//   "数据来源" REAL,
//   "填报人员" TEXT,
//   "填报单位" TEXT,
//   "填报日期" TEXT,
//   "备注" TEXT,
//   "排水系统类型" TEXT,
//   "建筑物规格" TEXT,
//   "层数" REAL,
//   "建筑面积（m²）" REAL,
//   "池（井）体横向截面形状" TEXT,
//   "截面形状" TEXT,
//   "截面尺寸1（mm）" REAL,
//   "截面尺寸2（mm）" REAL,
//   "底部标高（m）" REAL,
//   "顶部标高（m）" REAL,
//   "深度（m）" REAL,
//   "主体材质" TEXT,
//   "型号" TEXT,
//   "产地" TEXT,
//   "联系人" TEXT,
//   "联系电话" TEXT,
//   "资产原值（万元）" TEXT,
//   "资产现值（万元）" TEXT,
//   "管渠类型" TEXT,
//   "管渠长度 （m）" TEXT,
//   "管底起点标高 （m）" TEXT,
//   "管渠起点埋深（m）" TEXT,
//   "管渠终点埋深（m）" TEXT,
//   "管底终点标高 （m）" TEXT,
//   "管渠断面形状" TEXT,
//   "管径（mm）" TEXT,
//   "管渠断面数据1（mm）" TEXT,
//   "管渠断面数据2（mm）" TEXT,
//   "管渠壁厚（mm）" TEXT,
//   "管渠断面数据3" TEXT,
//   "管渠断面数据4" TEXT,
//   "外防腐材质" TEXT,
//   "管渠衬里材质" TEXT,
//   "是否热水管" TEXT,
//   "检查井类型" TEXT,
//   "管理归属" TEXT,
//   "井室高度（m）" REAL,
//   "井盖/盖板形状" TEXT,
//   "井盖/盖板尺寸（mm）" REAL,
//   "井盖/盖板材质" TEXT,
//   "所处位置" TEXT,
//   "地址描述" TEXT,
//   "设施状态" TEXT,
//   "设施状态" TEXT,
//   "设施状态" TEXT,
//   "设施状态" TEXT,
//   "设施状态" TEXT,
//   "设施状态" TEXT,
//   "设施状态" TEXT,
//   "设施状态" TEXT,
//   "设施状态" TEXT,
//   "设施状态" TEXT,
//   "设施状态" TEXT,
//   "设施状态" TEXT,
//   "设施状态" TEXT,
// );


