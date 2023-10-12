const XLSX = require('xlsx')
import proj4 from 'proj4'
import * as turf from "@turf/turf";
import './ProjData'
import { ElMessage } from 'element-ui'


// 判断是否是utf-8

export default function isUTF8 (bytes) {
    var i = 0;
    while (i < bytes.length) {
        if ((// ASCII
            bytes[i] == 0x09 ||
            bytes[i] == 0x0A ||
            bytes[i] == 0x0D ||
            (0x20 <= bytes[i] && bytes[i] <= 0x7E)
        )
        ) {
            i += 1;
            continue;
        }

        if ((// non-overlong 2-byte
            (0xC2 <= bytes[i] && bytes[i] <= 0xDF) &&
            (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF)
        )
        ) {
            i += 2;
            continue;
        }

        if ((// excluding overlongs
            bytes[i] == 0xE0 &&
            (0xA0 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
            (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
        ) ||
            (// straight 3-byte
                ((0xE1 <= bytes[i] && bytes[i] <= 0xEC) ||
                    bytes[i] == 0xEE ||
                    bytes[i] == 0xEF) &&
                (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
                (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
            ) ||
            (// excluding surrogates
                bytes[i] == 0xED &&
                (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0x9F) &&
                (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
            )
        ) {
            i += 3;
            continue;
        }

        if ((// planes 1-3
            bytes[i] == 0xF0 &&
            (0x90 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
            (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
            (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
        ) ||
            (// planes 4-15
                (0xF1 <= bytes[i] && bytes[i] <= 0xF3) &&
                (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
                (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
                (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
            ) ||
            (// plane 16
                bytes[i] == 0xF4 &&
                (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0x8F) &&
                (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
                (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
            )
        ) {
            i += 4;
            continue;
        }
        return false;
    }
    return true;
}


// 获取key对应Value的数据，例如：{ id: [1,2,3], name: ["lisa", "john", "james"]}
function _getKeyValueData (data) {
    let keyValueData = {};
    let keys = Object.keys(data[0]);    // 获取所有key的名字

    for (let key of keys) { // 循环key的名字
        for (let item of data) {    // 循环传入的数据
            if (keyValueData[key]) {    // 如果有对应的key，则放入list中，否则创建list
                keyValueData[key].push(item[key]);
            } else {
                keyValueData[key] = [item[key]];
            }
        }
    }
    return keyValueData;
}

// 根据数据获取Excel表的宽度
function _getExcelWidth (dataList) {
    let maxLength = 0;
    for (let item of dataList) {
        item = item.toString();
        if (item.length > maxLength) maxLength = item.length;
    }

    maxLength += 2; // 宽度增加2，可以更美观
    if (maxLength < 10) maxLength = 10;
    if (maxLength > 40) maxLength = 40;
    return maxLength;
}


// 多sheet页导出
export function exportMoreExcelFile (fileName, data) {
    var worksheet = XLSX.utils.json_to_sheet(data);

    // 调整宽度
    let wscols = [];
    // let keyValueData = _getKeyValueData(data);  // 获取Key对应Value的数据
    // for (let key in keyValueData) { // 循环数据，并获取对应的宽度，并放入到wscols中
    //     let width = _getExcelWidth(keyValueData[key]);
    //     wscols.push({ wch: width });
    // }
    // worksheet["!cols"] = wscols;

    // 新建空workbook，然后加入到worksheet
    var workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "result");

    // 生成xlsx文件
    let name = `${fileName}.xlsx`;
    XLSX.writeFile(workbook, name);
}


// 导出文件的方法
export function exportExcelFile (fileName, data) {
    var worksheet = XLSX.utils.json_to_sheet(data);
    // 新建空workbook，然后加入到worksheet
    var workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "result");

    // 生成xlsx文件
    let name = `${fileName}.xlsx`;
    XLSX.writeFile(workbook, name);
}

// 坐标转换
export function coordinateTransformation (longitude, latitude, firstEPSGid) {
    if (firstEPSGid == 4326) return
    // var firstEPSGid = 4549
    var secondEPSGid = 4326
    var firstProjection = new proj4.Proj(`EPSG:${firstEPSGid}`);
    var secondProjection = new proj4.Proj(`EPSG:${secondEPSGid}`);
    var result = proj4.transform(firstProjection, secondProjection, [Number(longitude), Number(latitude)]);
    return result;
}

// 判断管线是否相交
export const booleanContains = (targetLineData, judgeData) => {
    let judge = null
    let bol = null
    let targetLine = turf.lineString(targetLineData)
    judge = turf.lineString(judgeData)
    bol = turf.booleanDisjoint(judge, targetLine)
    return bol
}

// 选择两个点，画出两个点之间的线
export const pointSeekLine = (startPoint, endPoint, data) => {
    let satrt = startPoint
    let end = endPoint
    let arr = []
    arr = data.filter((item) => {
        return item.markerData['起始节点标识码'] == satrt
    })
    // if (arr[0].markerData['终止节点标识码'] == end) return
    return handPointSeekLine(data, arr, end)
}
// 递归
const handPointSeekLine = (data, target, end) => {
    if (target[target.length - 1].markerData['终止节点标识码'] == end) return target
    let arr = [...target]
    let arr1 = data.filter((item) => {
        return item.markerData['起始节点标识码'] == arr[arr.length - 1].markerData['终止节点标识码']
    })
    if (arr1.length == 0) {
        ElMessage.error('该管线无法连接')
        return []
    }
    arr = [...arr, ...arr1]
    return handPointSeekLine(data, arr, end)
}

// 生产uuid
export function guid () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const getCurrentTime = () => {
    //获取当前时间并打印
    let yy = new Date().getFullYear();
    let mm = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
    let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
    let hh = new Date().getHours();
    let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
    let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
    let str = yy + '' + mm + '' + dd;
    return str
}

const rad = (d) => {
    return d * Math.PI / 180.0;
}
export const getDistance = (lat1, lng1, lat2, lng2) => {
    var radLat1 = rad(lat1);
    var radLat2 = rad(lat2);
    var a = radLat1 - radLat2;
    var b = rad(lng1) - rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137; // EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000; //输出为公里

    // var distance = s;
    // var distance_str = "";

    // if (parseInt(distance) >= 1) {
    //     distance_str = distance.toFixed(1) + "km";
    // } else {
    //     distance_str = distance * 1000 + "m";
    // }
    return s * 1000;
}

// 校验是否为经纬度
export const checkLonLat = (type, value) => {
    if (type == 'lon') {
        let reg = /^-?((0|[1-9]\d?|1[1-7]\d)(\.\d{1,7})?|180(\.0{1,7})?)?$/;
        return new RegExp(reg).test(value)
    } else {
        let reg = /^-?((0|[1-8]\d|)(\.\d{1,7})?|90(\.0{1,7})?)?$/;
        return new RegExp(reg).test(value)
    }
}
