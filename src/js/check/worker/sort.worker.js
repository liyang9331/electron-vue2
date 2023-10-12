import store from '@/store/index'
self.addEventListener('message', function (e) {
    // handleFunc(e.data.lineData,e.data.key)
    // 3. works接收参数并处理 不会影响主线程 不会造成主页面卡顿
    let lineData = JSON.parse(e.data.lineData);

    let key = e.data.key
    let data1 = lineData.sort(function
        (a, b) { return a[key] - b[key] } // 排序
    )
    let arr = getmathData(data1)
    // store.commit('fileUpload/setStateItem', {
    //     key: 'gxxjList',
    //     value: arr
    //   })
    postMessage(arr) // 4. works处理完数据 发送回主页面
    self.close() // 5.记得要关闭哦

}, false)


const getmathData = (xMinArr) => {
    let xjMap = {};
    let xjArr = [];
    for (let i = 0; i < xMinArr.length; i++) {
        let item = xMinArr[i];
        let tempMaxXMapItem = item.tempMaxValueX;

        for (let j = i + 1; j < xMinArr.length; j++) {
            let innerItem = xMinArr[j];
            let tempMinXMapItemInner = innerItem.tempMinValueX;

            //if 后面的不做判断
            if (tempMinXMapItemInner > tempMaxXMapItem) {
                //最小的x bi 需要比较的x大 则不需要再进行比较
                break
            }

            let isxj = mathData(item.xCoordinate, item.yCoordinate, item.xCoordinate2, item.yCoordinate2,
                innerItem.xCoordinate, innerItem.yCoordinate, innerItem.xCoordinate2, innerItem.yCoordinate2);


            let key = item.assetsId + "_" + item.assetsId2 + innerItem.assetsId + "_" + innerItem.assetsId2;
            if (xjMap[key]) {
                continue
            }
            xjMap[key] = 1;
            if (isxj) {
                item.isAbnormal = 1
                item.abnormalInfor = item.abnormalInfor ? [...new Set([...item.abnormalInfor, '管线碰撞'])] : ['管线碰撞']
                innerItem.isAbnormal = 1
                innerItem.abnormalInfor = innerItem.abnormalInfor ? [...new Set([...innerItem.abnormalInfor, '管线碰撞'])] : ['管线碰撞']
                xjArr.push([item, innerItem]);
            }

        }
    }
    
    return [1,2,3]
    
}
//
const getKeyMap = (valueArr, key) => {
    let keyMap = {};
    for (let i = 0; i < valueArr.length; i++) {
        let item = valueArr[i];
        let value = item[key]
        if (!keyMap[value]) {
            keyMap[value] = i;
        }
    }
    return keyMap;
}


const mathData = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    if (!isStartAdnEnd(x1, y1, x2, y2, x3, y3, x4, y4)) {
        return false;  //说明不重合
    }
    return judgeIntersect(x1, y1, x2, y2, x3, y3, x4, y4)
}

//判断两条现代起点终点是否 有重合  如果有重合则不再做计算
const isStartAdnEnd = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    //说明是是起点终点重合
    if ((x1 == x3 && y1 == y3) || (x2 == x4 && y2 == y4) || (x1 == x4 && y1 == y4) || (x2 == x3 && y2 == y3)) {
        //不需要在计算
        return false
    }
    //需要在进行计算
    return true
}


const judgeIntersect = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    //快速排斥：
    //两个线段为对角线组成的矩形，如果这两个矩形没有重叠的部分，那么两条线段是不可能出现重叠的
    //这里的确如此，这一步是判定两矩形是否相交
    //1.线段ab的低点低于cd的最高点（可能重合）
    //2.cd的最左端小于ab的最右端（可能重合）
    //3.cd的最低点低于ab的最高点（加上条件1，两线段在竖直方向上重合）
    //4.ab的最左端小于cd的最右端（加上条件2，两直线在水平方向上重合）
    //综上4个条件，两条线段组成的矩形是重合的
    //特别要注意一个矩形含于另一个矩形之内的情况

    if (!(Math.min(x1, x2) <= Math.max(x3, x4) && Math.min(y3, y4) <= Math.max(y1, y2) && Math.min(x3, x4) <= Math.max(x1, x2) && Math.min(y1, y2) <= Math.max(y3, y4)))
        return false;
    //跨立实验：
    //如果两条线段相交，那么必须跨立，就是以一条线段为标准，另一条线段的两端点一定在这条线段的两段
    //也就是说a b两点在线段cd的两端，c d两点在线段ab的两端
    var u, v, w, z
    u = (x3 - x1) * (y2 - y1) - (x2 - x1) * (y3 - y1);
    v = (x4 - x1) * (y2 - y1) - (x2 - x1) * (y4 - y1);
    w = (x1 - x3) * (y4 - y3) - (x4 - x3) * (y1 - y3);
    z = (x2 - x3) * (y4 - y3) - (x4 - x3) * (y2 - y3);
    return (u * v <= 0.00000001 && w * z <= 0.00000001);
}