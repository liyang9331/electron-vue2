// import { coordinateTransformation, checkLonLat } from "@/utils/index";

//由于windos 下进行坐标转换存在问题 所以把本部分抽出来
import proj4 from 'proj4'
import '@/utils/ProjData'

import {LonlatTrans} from '@/utils/map/LonlatTrans'
import {mapState} from "vuex";
// 坐标转换
function coordinateTransformation(longitude, latitude,firstEPSGid) {
    if (firstEPSGid == 4326) return
    // var firstEPSGid = 4549
    var secondEPSGid = 4326
    var firstProjection = new proj4.Proj(`EPSG:${firstEPSGid}`);
    var secondProjection = new proj4.Proj(`EPSG:${secondEPSGid}`);
    var result = proj4.transform(firstProjection, secondProjection, [Number(longitude), Number(latitude)]);
    return result;
}


// 校验是否为经纬度
const checkLonLat = (type, value) => {
    let lolat= Number(value)

    if (type == 'lon') {
        if(lolat&&lolat<=180&&lolat>=-180){
            return true
        }
    } else {
        if(lolat&&lolat<=90&&lolat>=-90){
            return true
        }
    }
    return false
}
self.addEventListener('message', function (e) {
    // handleFunc(e.data.lineData,e.data.key)
    // 3. works接收参数并处理 不会影响主线程 不会造成主页面卡顿
    let { list, projectionValue, dataType, iconText, iconName, lineColor, fileName, data_index,distObj } = e.data
    list = JSON.parse(list)

    let data1 = getChangeData(list, projectionValue, dataType, iconText, iconName, lineColor, fileName, data_index,distObj)
    postMessage(data1) // 4. works处理完数据 发送回主页面
    self.close() // 5.记得要关闭哦

}, false)

// 判断是否需要转换经纬度
const handisChange = (list, type) => {
    let bol = false;
    if (list.length == 0) return;
    let len = list.length > 10 ? 10 : list.length;
    for (let i = 0; i < len; i++) {
        let lon = list[i]["xCoordinate"];
        let lat = list[i]["yCoordinate"];
        let isShow1 = checkLonLat("lon", lon);
        let isShoW2 = checkLonLat("lat", lat);
        if (!isShow1 || !isShoW2) {
            bol = true;
            return bol;
        } else {
            bol = false;
        }
        return bol;
    }
}

const getEndX =(xCoordinate,isDH) =>{
    if(isDH){
        //数据带带号
        xCoordinate=xCoordinate.toString();
        xCoordinate =Number(xCoordinate.substring(2,(xCoordinate.length-1)))
    }
    return xCoordinate
}

//普通坐标系 如高德 GCJ-02 百度（BD-09） 转84
function  lonlatTrans(list, projectionValue, dataType, iconText, iconName, lineColor, fileName, data_index){
    let lonlatTransObj=new LonlatTrans();
    let gps= lonlatTransObj.getGPSTrans()
    let transformFunc=null
    if(projectionValue=="GCJ-02"){
        transformFunc=gps.gcj_decrypt
    }else if(projectionValue=="BD-09"){
        transformFunc=gps.bd_wgs84
    }

    let data = []
    if (dataType == "point") {
        data = list.map((item) => {
            let arr =[];
            if(item["xCoordinate"] && item["yCoordinate"]){
                let xCoordinate=    item["xCoordinate"];
                let yCoordinate=    item["yCoordinate"];
                arr =transformFunc(yCoordinate,xCoordinate)
            }else{
                arr=  ""
            }
            return {
                ...item,
                lon: arr != "" ? arr.lon.toFixed(8) : "",
                lat: arr != "" ? arr.lat.toFixed(8) : "",
                iconText: iconText,
                iconName: iconName,
                data_type: dataType,
                data_location: `${fileName} - ${data_index++}`
            };
        });
    } else {
        data = list.map((item) => {
            let arr =
                item["xCoordinate"] != "" && item["yCoordinate"] != ""
                    ? transformFunc(item["yCoordinate"],item["xCoordinate"])
                    : "";
            let arr2 =
                item["xCoordinate2"] != "" && item["yCoordinate2"] != ""
                    ?  transformFunc(item["yCoordinate2"],item["xCoordinate2"])
                    : "";
            return {
                ...item,
                lon: arr != "" ? Number(arr.lon.toFixed(8)) : "",
                lat: arr != "" ? Number(arr.lat.toFixed(8)) : "",
                lon2: arr2 != "" ? Number(arr2.lon.toFixed(8)) : "",
                lat2: arr2 != "" ? Number(arr2.lat.toFixed(8)) : "",
                lineColor: lineColor,
                iconName: iconName,
                data_type: dataType,
                data_location: `${fileName} - ${data_index++}`
            };
        });
    }
    return data
}



// 数据转换
const getChangeData = (list, projectionValue, dataType, iconText, iconName, lineColor, fileName, data_index,distObj) => {
    try {


        let data = []
        let isDH=false
        if(list[0].xCoordinate && list[0].xCoordinate.toString().split(".")[0].length>=8 ){
            //说明头两位是带号 如 39615673.935   中的39   三度带
            isDH=true
        }

        let distX=Number(distObj.distX)?Number(distObj.distX):0;
        let distY=Number(distObj.distY)?Number(distObj.distY):0;

        if (handisChange(list)) {
            if (dataType == "point") {
                data = list.map((item) => {
                    let arr =[];
                    if(item["xCoordinate"] && item["yCoordinate"]){
                        let xCoordinate=    Number(item["xCoordinate"]) +distX;
                        let yCoordinate=    Number(item["yCoordinate"]) +distY;
                        if(isDH){
                            //数据带带号
                            xCoordinate=xCoordinate.toString();
                            xCoordinate =Number(xCoordinate.substring(2,(xCoordinate.length-1)))
                        }

                        arr = coordinateTransformation(
                            xCoordinate,
                            yCoordinate,
                            projectionValue
                        )
                    }else{
                        arr=  ""
                    }
                    // console.log(11111)
                    // console.log(JSON.stringify(item))
                    return {
                        ...item,
                        lon: arr != "" ? arr.x.toFixed(8) : "",
                        lat: arr != "" ? arr.y.toFixed(8) : "",
                        iconText: iconText,
                        iconName: iconName,
                        data_type: dataType,
                        data_location: `${fileName} - ${data_index++}`
                    };
                });
            } else {
                data = list.map((item) => {
                    let arr =
                        item["xCoordinate"] != "" && item["yCoordinate"] != ""
                            ? coordinateTransformation(
                            getEndX( Number(item["xCoordinate"])+distX,isDH),
                            Number(item["yCoordinate"])+distY,
                            projectionValue
                            )
                            : "";
                    let arr2 =
                        item["xCoordinate2"] != "" && item["yCoordinate2"] != ""
                            ? coordinateTransformation(
                            getEndX( Number(item["xCoordinate2"])+distX,isDH),
                            Number(item["yCoordinate2"])+distY,
                            projectionValue
                            )
                            : "";
                    return {
                        ...item,
                        lon: arr != "" ? Number(arr.x.toFixed(8)) : "",
                        lat: arr != "" ? Number(arr.y.toFixed(8)) : "",
                        lon2: arr2 != "" ? Number(arr2.x.toFixed(8)) : "",
                        lat2: arr2 != "" ? Number(arr2.y.toFixed(8)) : "",
                        lineColor: lineColor,
                        iconName: iconName,
                        data_type: dataType,
                        data_location: `${fileName} - ${data_index++}`
                    };
                });
            }
        } else {

            if(projectionValue&&(projectionValue=="GCJ-02"||projectionValue=="BD-09")){
                data= lonlatTrans(list, projectionValue, dataType, iconText, iconName, lineColor, fileName, data_index)
            }else{
                if (dataType == "point") {
                    data = list.map((item) => {
                        return {
                            ...item,
                            lon:  Number(item["xCoordinate"])+distX,
                            lat:  Number(item["yCoordinate"])+distY,
                            iconText: iconText,
                            iconName: iconName,
                            data_type: dataType,
                            data_location: `${fileName} - ${data_index++}`
                        };
                    });
                } else {
                    data = list.map((item) => {
                        return {
                            ...item,
                            lon:  Number(item["xCoordinate"])+distX,
                            lat:  Number(item["yCoordinate"])+distY,
                            lon2:  Number(item["xCoordinate2"])+distX,
                            lat2:  Number(item["yCoordinate2"])+distY,
                            lineColor: lineColor,
                            iconName: iconName,
                            data_type: dataType,
                            data_location: `${fileName} - ${data_index++}`
                        };
                    });
                }
            }



        }
        return data
    }catch (e) {
        console.error(e)
    }
    return null
}
