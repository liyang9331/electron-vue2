import {
    PipeLineRepeat,
    PointDuplicate,
    NodeIsolation,
    AbnormalLength,
    MathRelPoint,
    SpatialElements,
    ConnectBoth,
    LineAdverseSlope,
    CheckoutDataSpecs
} from "@/js/check/check2";


import { IntersectCheck } from "@/js/check/intersectCheck";
import { Relationship } from "@/js/check/Relationship";
self.addEventListener('message', function (e) {
    // handleFunc(e.data.lineData,e.data.key)
    // 3. works接收参数并处理 不会影响主线程 不会造成主页面卡顿
    let { checkItemData, activeNum, progressBarNum, pipePointData, pipeLineData, configAccident } = e.data
    checkItemData = JSON.parse(checkItemData)
    pipePointData = JSON.parse(pipePointData)
    pipeLineData = JSON.parse(pipeLineData)
    configAccident = JSON.parse(configAccident)
    let data1 = init(checkItemData, activeNum, progressBarNum, pipePointData, pipeLineData, configAccident)
    postMessage(data1) // 4. works处理完数据 发送回主页面
    self.close() // 5.记得要关闭哦
}, false)


const onPublic = (item, pipePointData, pipeLineData, configAccident) => {
    if (item.computationalFunction == 'spatialPart') {
        return spatialPart(pipePointData, pipeLineData, configAccident)
    } else if (item.computationalFunction == 'lengthInspection') {
        return lengthInspection(pipePointData, pipeLineData, configAccident)
    } else if (item.computationalFunction == 'notConnectedPoint') {
        return notConnectedPoint(pipePointData, pipeLineData, configAccident)
    } else if (item.computationalFunction == 'coincidence') {
        return coincidence(pipePointData, pipeLineData, configAccident)
    } else if (item.computationalFunction == 'notConnectedLine') {
        return notConnectedLine(pipePointData, pipeLineData, configAccident)
    } else if (item.computationalFunction == 'inconsistentCoordinates') {
        return inconsistentCoordinates(pipePointData, pipeLineData, configAccident)
    } else if (item.computationalFunction == 'multipleTubes') {
        return multipleTubes(pipePointData, pipeLineData, configAccident)
    } else if (item.computationalFunction == 'collision') {
        return collision(pipePointData, pipeLineData, configAccident)
    } else if (item.computationalFunction == 'intersectCheck') {
        return intersectCheck(pipePointData, pipeLineData, configAccident)
    } else if (item.computationalFunction == 'pipelineAdverseSlope') {
        return pipelineAdverseSlope(pipePointData, pipeLineData, configAccident)
    } else if (item.computationalFunction == 'generateRelationship') {
        return generateRelationship(pipePointData, pipeLineData, configAccident)
    } else if (item.computationalFunction == 'epsgTransform') {
        return epsgTransform(pipePointData, pipeLineData, configAccident)
    } else if (item.computationalFunction == 'dataSpecificationVerification') {
        return handleDataSpecificationVerification(pipePointData, pipeLineData)
    }
}

const init = (checkItemData, activeNum, progressBarNum, pipePointData, pipeLineData, configAccident) => {
    let item = checkItemData[activeNum];
    let value = {}
    try {
        value = onPublic(item, pipePointData, pipeLineData, configAccident);
    } catch (error) {
        console.error(error);
    }
    progressBarNum += parseInt(100 / checkItemData.length);
    if (activeNum == checkItemData.length - 1) {
        progressBarNum = 100;
    }
    return {
        item,
        activeNum,
        progressBarNum,
        value
    }
}


//管线长度检验
const lengthInspection = (pipePointData, pipeLineData, configAccident) => {
    let abnormalLength = new AbnormalLength();
    abnormalLength.onShortLine(
        pipeLineData,
        configAccident["lengthInspection"]
    );
    return abnormalLength.sortLineData;
}
// 未连接的井点
const notConnectedPoint = (pipePointData, pipeLineData, configAccident) => {
    let nodeIsolation = new NodeIsolation();
    nodeIsolation.mathPointNotLine(
        pipePointData,
        pipeLineData
    );
    return nodeIsolation.pointNotLine;
}
// 多点坐标重合或过近
const coincidence = (pipePointData, pipeLineData, configAccident) => {
    let pointDuplicate = new PointDuplicate();
    pointDuplicate.nodeDuplicate(pipePointData);
    return pointDuplicate.nodeDuplicateData;
}
// 未连接井的管线
const notConnectedLine = (pipePointData, pipeLineData, configAccident) => {
    let nodeIsolation = new NodeIsolation();
    nodeIsolation.mathLineNotPoint(
        pipePointData,
        pipeLineData
    );
    return nodeIsolation.lineNotPoint;
}
// 管坐标与所连井坐标不一致
const inconsistentCoordinates = (pipePointData, pipeLineData, configAccident) => {
    let mathRelPoint = new MathRelPoint();
    mathRelPoint.mathRelPoint(
        pipeLineData,
        pipePointData,
        configAccident["inconsistentCoordinates"]
    );
    return mathRelPoint.marhRelList;
}
// 两井之间有多条管
const multipleTubes = (pipePointData, pipeLineData, configAccident) => {
    let pipeLineRepeat = new PipeLineRepeat();
    pipeLineRepeat.pipelineRepeat(pipeLineData);
    return pipeLineRepeat.pipelineRepeatData;
}
// 空间要素缺失
const spatialPart = (pipePointData, pipeLineData, configAccident) => {
    let spatialElements = new SpatialElements();
    spatialElements.spatialElements(
        pipePointData,
        pipeLineData
    );
    return spatialElements.spatialElementsData;
}
// 井是否同时连接雨水管、污水管
const collision = (pipePointData, pipeLineData, configAccident) => {
    let connectBoth = new ConnectBoth();
    connectBoth.connectBoth(pipePointData);
    return connectBoth.connectBothData;
}
// 管线逆坡
const pipelineAdverseSlope = (pipePointData, pipeLineData, configAccident) => {
    let lineAdverseSlope = new LineAdverseSlope();
    lineAdverseSlope.lineAdverseSlope(
        pipeLineData,
        configAccident["pipelineAdverseSlope"]
    );
    return lineAdverseSlope.lineAdverseSlopeData;
}
//管线相交判断
const intersectCheck = (pipePointData, pipeLineData, configAccident) => {
    let intersectCheckObj = new IntersectCheck();
    intersectCheckObj.init(pipePointData, pipeLineData);
    intersectCheckObj.checkData()
    return intersectCheckObj.list
}




//生成挂线之间的关联关系
const generateRelationship = (pipePointData, pipeLineData, configAccident) => {
    let relationship = new Relationship();
    relationship.init(pipePointData, pipeLineData);
    relationship.checkData()

    let obj = {};
    //数据不纳入错误范围
    obj.status = "notErr";
    obj.type = "generateRelationship";
    obj.pipeLineData = relationship.generateRelationshipData.line
    obj.pipePointData = relationship.generateRelationshipData.point
    return obj
}



//返回空间数据信息 转换后的4326数据  数据不纳入错误范围
const epsgTransform = (pipePointData, pipeLineData, configAccident) => {
    let obj = {};
    //数据不纳入错误范围
    obj.status = "notErr";
    obj.type = "transform";
    obj.pipeLineData = pipeLineData
    obj.pipePointData = pipePointData

    //没有用处 已经在初始化时处理完成
    //偏移数据
    // obj.epsgTransform =  configAccident["epsgTransform"]
    // obj.pipeLineData =distXY(pipeLineData,obj.epsgTransform)
    // obj.pipeLineData = distXY(pipePointData,obj.epsgTransform)
    return obj
}


//xy 偏移值
const  distXY =(pipeData,distObj)=>{
    console.log(JSON.stringify(distObj))
    let distX=Number(distObj.dist_x);
    let distY=Number(distObj.dist_y);
    console.log(distX)
    console.log(distY)

    pipeData= pipeData.map((item) => {
            console.log(JSON.stringify(item))
        if (item["xCoordinate"] && item["yCoordinate"]) {
            item["xCoordinate"] = Number(item["xCoordinate"]) + distX;
            item["yCoordinate"] = Number(item["yCoordinate"]) + distY;
        }
        if (item["xCoordinate2"] && item["yCoordinate2"]) {
            item["xCoordinate2"] = Number(item["xCoordinate2"]) +distX;
            item["yCoordinate2"] = Number(item["yCoordinate2"]) + distY;
        }
        return item
    })

    return pipeData;
}

// 判断选项规格检验
const handleDataSpecificationVerification = (pipePointData, pipeLineData) => {
    let checkoutDataSpecs = new CheckoutDataSpecs();
    checkoutDataSpecs.handleFun(pipePointData, pipeLineData);
    return checkoutDataSpecs.checkoutDataSpecsList
}
