// import { getDistance } from '@/utils/index'
//windos 下不能  下一级不能有requre 之类的 应用额否则会报错

import { getDistance } from '@/utils/GetDistance'
import { dataOptionType } from '@/utils/data'

// 判断管线重复是否重复
class PipeLineRepeat {



    constructor() {
        this.pipelineRepeatData = []
    }

    pipelineRepeat(lineArr) {
        for (let index = 1; index < lineArr.length; index++) {
            let startLineX = lineArr[index - 1].xCoordinate
            let startLineY = lineArr[index - 1].yCoordinate
            let endLineX = lineArr[index - 1].xCoordinate2
            let endLineY = lineArr[index - 1].yCoordinate2
            let startLineX1 = lineArr[index].xCoordinate
            let startLineY1 = lineArr[index].yCoordinate
            let endLineX1 = lineArr[index].xCoordinate2
            let endLineY1 = lineArr[index].yCoordinate2
            if (startLineX === startLineX1 && startLineY === startLineY1 && endLineX === endLineX1 && endLineY === endLineY1) {
                lineArr[index - 1].isAbnormal = 1
                lineArr[index - 1].abnormalInfor = lineArr[index - 1].abnormalInfor ? [...new Set([...lineArr[index - 1].abnormalInfor, '两井之间有多条管'])] : ['两井之间有多条管']
                this.pipelineRepeatData.push(lineArr[index - 1])
            }
        }
    }

    // 判断
}
// 判断节点是否重复
class PointDuplicate {
    constructor() {
        this.nodeDuplicateData = []
    }
    nodeDuplicate(pointArr) {
        for (let index = 1; index < pointArr.length; index++) {
            let pointX1 = pointArr[index]['xCoordinate']
            let pointY1 = pointArr[index]['yCoordinate']
            let pointX2 = pointArr[index - 1]['xCoordinate']
            let pointY2 = pointArr[index - 1]['yCoordinate']
            if (pointX1 === pointX2 && pointY1 === pointY2) {
                // 1 是异常数据
                pointArr[index - 1].isAbnormal = 1
                pointArr[index - 1].abnormalInfor = pointArr[index - 1].abnormalInfor ? [...new Set([...pointArr[index - 1].abnormalInfor, '多点坐标重合或过近'])] : ['多点坐标重合或过近']
                this.nodeDuplicateData.push(pointArr[index - 1])
            }
        }
    }
}

// 判断管线逆坡  管线反向
class LineAdverseSlope {
    constructor() {
        this.lineAdverseSlopeData = []
    }
    lineAdverseSlope(lineArr, target) {
        lineArr.forEach(item => {
            let start = item['管底起点标高 （m）']
            let end = item['管底终点标高 （m）']
            let difference = start - end
            if (difference > target.adverseSlope) {
                item.isAbnormal = 1
                item.abnormalInfor = item.abnormalInfor ? [...new Set([...item.abnormalInfor, '管线逆坡'])] : ['管线逆坡']
                this.lineAdverseSlopeData.push(item)
            }
        })
    }
}


// 节点孤立
class NodeIsolation {
    constructor() {
        this.pointNotLine = [] // 孤立的节点
        this.lineNotPoint = []
    }
    mathPointNotLine(pointData, lineArr) {
        let dataArr = []
        let ids = []
        let lineObj = handleLineData(lineArr)
        let pointObj = handlePointData(pointData)
        for (let key in pointObj) {
            if (!lineObj.all[key]) {
                pointObj[key].isAbnormal = 1
                pointObj[key].abnormalInfor = pointObj[key].abnormalInfor ? [...new Set([...pointObj[key].abnormalInfor, '未连接的井点'])] : ['未连接的井点']
                dataArr.push(pointObj[key])
                ids.push(key);
            }
        }
        this.pointNotLine = [...dataArr]
    }
    //查询管线未找到管点
    mathLineNotPoint(pointData, lineArr) {
        let lineObj = handleLineData(lineArr)
        let pointObj = handlePointData(pointData)
        let dataArr = []
        for (let key in lineObj.all) {
            if (!pointObj[key]) {
                lineObj.all[key].isAbnormal = 1
                lineObj.all[key].abnormalInfor = lineObj.all[key].abnormalInfor ? [...new Set([...lineObj.all[key].abnormalInfor, '未连接井的管线'])] : ['未连接井的管线']
                dataArr.push(lineObj.all[key])
            }
        }
        this.lineNotPoint = dataArr
        // console.log('未找到管点的管线',dataArr)
    }
}

// 查询管线管点关联与真实位置的点数据

class MathRelPoint {
    constructor() {
        this.marhRelList = []
    }
    mathRelPoint(lineArr, pointData, target) {
        let dataArr = []
        let pointObj = handlePointData(pointData)
        for (let obj of lineArr) {
            let startPoint = pointObj[obj['assetsId']];
            let endPoint = pointObj[obj['assetsId2']];
            if (startPoint) {
                let math = getDistance(startPoint.lon, startPoint.lat, obj.lon, obj.lat)
                if (math > target.misTake) {
                    startPoint.isAbnormal = 1
                    startPoint.abnormalInfor = startPoint.abnormalInfor ? [...new Set([...startPoint.abnormalInfor, '管坐标与所连井坐标不一致'])] : ['管坐标与所连井坐标不一致']
                    let objItem = {
                        title: "管坐标与所连井坐标不一致",
                        value: math,
                        line: obj,
                        ...startPoint
                    }
                    dataArr.push(objItem)
                }
            }
            if (endPoint) {
                let math = getDistance(endPoint.lon, endPoint.lat, obj.lon2, obj.lat2)
                if (math > target.misTake) {
                    endPoint.isAbnormal = 1
                    endPoint.abnormalInfor = endPoint.abnormalInfor ? [...new Set([...endPoint.abnormalInfor, '管坐标与所连井坐标不一致'])] : ['管坐标与所连井坐标不一致']
                    let objItem = {
                        title: "管坐标与所连井坐标不一致",
                        value: math,
                        line: obj,
                        ...endPoint
                    }

                    objItem.point = endPoint;
                    dataArr.push(objItem)
                }
            }
        }
        this.marhRelList = dataArr
    }
}


// 管线数据处理
function handleLineData(arr) {
    let obj = {}
    let startObj = {};
    let endObj = {};
    let all = {}
    for (let obj of arr) {
        startObj[obj['assetsId']] = obj;
        endObj[obj['assetsId2']] = obj;
        all[obj['assetsId2']] = obj;
        all[obj['assetsId']] = obj;
    }
    obj.startObj = startObj
    obj.endObj = endObj
    obj.all = all
    return obj
}
// 管点数据处理
function handlePointData(arr) {
    let object = {}
    for (let obj of arr) {
        object[obj['assetsId']] = obj;
    }
    return object
}

// 长度判断
class AbnormalLength {
    constructor() {
        this.sortLineData = []
        this.longLineData = []
    }
    onShortLine(lineArr, target) {
        let cdataArr1 = []
        for (let obj of lineArr) {
            let cmath = getDistance(obj.lon, obj.lat, obj.lon2, obj.lat2)
            if (cmath < target.minNum) {
                obj.isAbnormal = 1
                obj.abnormalInfor = obj.abnormalInfor ? [...new Set([...obj.abnormalInfor, '管线长度检验'])] : ['管线长度检验']
                let objItem = {}
                objItem = {
                    title: '管线过短',
                    value: cmath,
                    ...obj,
                };
                cdataArr1.push(objItem)
            }
            if (cmath > target.maxNum) {
                obj.isAbnormal = 1
                obj.abnormalInfor = obj.abnormalInfor ? [...new Set([...obj.abnormalInfor, '管线长度检验'])] : ['管线长度检验']
                let objItem = {}
                objItem = {
                    title: '管线过长',
                    value: cmath,
                    ...obj,
                };
                cdataArr1.push(objItem)
            }

        }
        this.sortLineData = cdataArr1
        // this.longLineData = cdataArr2
    }
}


// 管径异常，出现小管接大管
class AbnormalPipeDiameter {
    constructor() {
        this.abnormalPipeDiameterData = []
        this.targetData = []
    }
    onAbnormalPipeDiameter(lineArr) {
        // lineArr.forEach(item => {
        //     this.handleArr(lineArr, item)
        // })
        this.handleArr(lineArr, 20)
    }
}

// 空间要素缺失
class SpatialElements {
    constructor() {
        this.spatialElementsData = []
    }
    spatialElements(pointData, lineArr) {
        let arr1 = []
        let arr2 = []
        if (pointData.length != 0) {
            for (let i = pointData.length - 1; i >= 0; i--) {
                let item = pointData[i]
                if (item['xCoordinate'] == '' || item['yCoordinate'] == '') {
                    item.isAbnormal = 1
                    item.abnormalInfor = item.abnormalInfor ? [...new Set([...item.abnormalInfor, '空间要素缺失'])] : ['空间要素缺失']
                    arr1.push(item)
                    pointData.splice(i, 1)
                }
            }
        } else if (lineArr.length != 0) {
            for (let i = lineArr.length - 1; i >= 0; i--) {
                let item = lineArr[i]
                if (item['xCoordinate'] == '' || item['yCoordinate'] == '' || item['xCoordinate2'] == '' || item['yCoordinate2'] == '') {
                    item.isAbnormal = 1
                    item.abnormalInfor = item.abnormalInfor ? [...new Set([...item.abnormalInfor, '空间要素缺失'])] : ['空间要素缺失']
                    arr2.push(item)
                    lineArr.splice(i, 1)
                }
            }
        }
        this.spatialElementsData = [...arr1, ...arr2]
    }
}

// 井是否同时连接雨水管、污水管

class ConnectBoth {
    constructor() {
        this.connectBothData = []
    }
    connectBoth(pointArr) {
        for (let index = 1; index < pointArr.length; index++) {
            let pointX1 = pointArr[index]['xCoordinate']
            let pointY1 = pointArr[index]['yCoordinate']
            let pointX2 = pointArr[index - 1]['xCoordinate']
            let pointY2 = pointArr[index - 1]['yCoordinate']
            let type1 = pointArr[index]['排水系统类型']
            let type2 = pointArr[index - 1]['排水系统类型']
            if (pointX1 === pointX2 && pointY1 === pointY2 && (type1 != type2 && (type1 == '污水' && type2 == '雨水') || (type1 == '雨水' && type2 == '污水'))) {
                // 1 是异常数据
                pointArr[index - 1].isAbnormal = 1
                pointArr[index - 1].abnormalInfor = pointArr[index - 1].abnormalInfor ? [...pointArr[index - 1].abnormalInfor, '井同时连接雨水管、污水管'] : ['井同时连接雨水管、污水管']
                pointArr[index].isAbnormal = 1
                pointArr[index].abnormalInfor = pointArr[index].abnormalInfor ? [...pointArr[index].abnormalInfor, '井同时连接雨水管、污水管'] : ['井同时连接雨水管、污水管']
                this.connectBothData.push(pointArr[index])
                this.connectBothData.push(pointArr[index - 1])
            }
        }
    }
}



// 检验选项是否符合条件
class CheckoutDataSpecs {
    constructor() {
        this.checkoutDataSpecsList = []
    }
    handleFun(pointArr, lineArr) {
        for (let i = 0; i < pointArr.length; i++) {
            let item = pointArr[i]
            let bolList = []
            let errorKey = []
            for (let key in item) {
                if (dataOptionType[key] != undefined) {
                    if (dataOptionType[key].indexOf("其他，并注明") != -1) {
                        bolList.push(item[key].includes('其他，并注明') || item[key].includes('其他-') || dataOptionType[key].indexOf(item[key]) != -1)
                        if (!(item[key].includes('其他，并注明') || item[key].includes('其他-') || dataOptionType[key].indexOf(item[key]) != -1)) {
                            errorKey.push(key)
                        }
                    } else {
                        bolList.push(dataOptionType[key].indexOf(item[key]) != -1)
                        if (!(dataOptionType[key].indexOf(item[key]) != -1)) {
                            errorKey.push(key)
                        }
                    }
                }
            }
            let IsSatisfy = bolList.every(bol => bol)
            if (!IsSatisfy) {
                pointArr[i].isAbnormal = 1
                pointArr[i].abnormalInfor = pointArr[i].abnormalInfor ? [...new Set([pointArr[i].abnormalInfor, '选项不合规'])] : ['选项不合规']
                this.checkoutDataSpecsList.push(pointArr[i])
            }
        }
        for (let i = 0; i < lineArr.length; i++) {
            console.log(lineArr);
            let item = lineArr[i]
            let bolList = []
            let errorKey = []
            for (let key in item) {
                if (dataOptionType[key] != undefined) {
                    if (dataOptionType[key].indexOf("其他，并注明") != -1) {
                        bolList.push(item[key].includes('其他，并注明') || item[key].includes('其他-') || dataOptionType[key].indexOf(item[key]) != -1)
                        if (!(item[key].includes('其他，并注明') || item[key].includes('其他-') || dataOptionType[key].indexOf(item[key]) != -1)) {
                            errorKey.push(key)
                        }
                    } else {
                        bolList.push(dataOptionType[key].indexOf(item[key]) != -1)
                        if (!(dataOptionType[key].indexOf(item[key]) != -1)) {
                            errorKey.push(key)
                        }
                    }
                }
            }
            let IsSatisfy = bolList.every(bol => bol)
            if (!IsSatisfy) {
                lineArr[i].isAbnormal = 1
                lineArr[i].abnormalInfor = lineArr[i].abnormalInfor ? [...new Set([lineArr[i].abnormalInfor, '选项不合规'])] : ['选项不合规']
                this.checkoutDataSpecsList.push(lineArr[i])
            }
            console.log(this.checkoutDataSpecsList);
        }
    }
}


export {
    PipeLineRepeat,
    PointDuplicate,
    LineAdverseSlope,
    NodeIsolation,
    AbnormalPipeDiameter,
    AbnormalLength,
    MathRelPoint,
    SpatialElements,
    ConnectBoth,
    CheckoutDataSpecs
}
