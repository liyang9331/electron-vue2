import { coordinateTransformation, checkLonLat } from "@/utils/index";
self.addEventListener('message', function (e) {
    // handleFunc(e.data.lineData,e.data.key)
    // 3. works接收参数并处理 不会影响主线程 不会造成主页面卡顿
    let { list, dataType, iconText, iconName, lineColor } = e.data
    list = JSON.parse(list)
    let data1 = handShpData(list, dataType, iconText, iconName, lineColor)
    postMessage(data1) // 4. works处理完数据 发送回主页面
    self.close() // 5.记得要关闭哦

}, false)

// 处理shp文件的数据
const handShpData = (list, dataType, iconText, iconName, lineColor) => {
    let arr = [];
    if (dataType == 'point') {
        for (let i = 0; i < list.length; i++) {
            let lonLatArr = list[i].geometry.coordinates;
            arr.push({
                lon: lonLatArr[0],
                lat: lonLatArr[1],
                iconText: iconText,
                iconName: assetsName,
                data_type: dataType,
                ...list[i].properties,
            });
        }
    } else if (dataType == 'line') {
        for (let i = 0; i < list.length; i++) {
            let lonLatArr = list[i].geometry.coordinates[0];
            let lonLatArr2 = list[i].geometry.coordinates[1];
            arr.push({
                lon: lonLatArr[0],
                lat: lonLatArr[1],
                lon2: lonLatArr2[0],
                lat2: lonLatArr2[1],
                iconText: iconText,
                iconName: assetsName,
                data_type: dataType,
                ...list[i].properties,
            });
        }
    }
    return arr

}