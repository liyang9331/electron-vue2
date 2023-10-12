/**
 * Created by supervisor on 2021/03/15
 */
import { getDistance } from '@/utils/GetDistance'

class IntersectCheck {

  constructor() {
    this.pointArr = [];
    this.lineArr = [];
    this.list = []
    this.lineMap = {};
  }
  init(pointArr, lineArr) {
    this.lineArr = pointArr;
    this.lineArr = lineArr;
  }

  //开始进行计算
  checkData() {
    let that = this;
    //先基于线段的y 排序
    //基于X排序

    let tempArr = []
    for (let item of this.lineArr) {
      let tempItem = item;
      if (item.xCoordinate && item.yCoordinate && item.xCoordinate2 && item.yCoordinate2) {
        //需要有对应的数据
        let minValueX1 = Math.min(item.xCoordinate, item.xCoordinate2);
        let minValueY1 = Math.min(item.yCoordinate, item.yCoordinate2);
        let maxValueX1 = Math.max(item.xCoordinate, item.xCoordinate2);
        let maxValueY1 = Math.max(item.yCoordinate, item.yCoordinate2);
        tempItem.tempMinValueX = minValueX1;
        tempItem.tempMinValueY = minValueY1
        tempItem.tempMaxValueX = maxValueX1
        tempItem.tempMaxValueY = maxValueY1
        tempArr.push(tempItem)
      }
    }
    let key = 'tempMinValueX'
    let data1 = tempArr.sort(function
        (a, b) { return a[key] - b[key] } // 排序
    )

    that.getmathData(data1)

    //从小到大  异步排序
    // let works = new sortWorker() // 1.新建works
    // works.postMessage({ lineData: JSON.stringify(tempArr), key: 'tempMinValueX' }) // 2 给works发送参数
    // works.onmessage = function (event) { // 6. 接收works的数据并处理操作
    //   console.log(event.data);
    //   store.commit('fileUpload/setStateItem', {
    //     key: 'gxxjList',
    //     value: [1, 2, 3]
    //   })
    //   works.terminate() // 7 关闭works主线程
    // }


    // let data1=  tempArr.sort(function
    //     (a, b) { return a['tempMinValueX'] - b['tempMinValueX'] } // 排序
    // )
    // let t1=(new Date()).getTime()
    // console.log(t1)
    // that.getmathData(data1)
    // let t2=(new Date()).getTime()
    // console.log(t2-t1)


    // return []
    //
    // let xMinArr = this.qsort(tempArr,'tempMinValueX');
    // //从小到大
    // // let yMinArr = this.qsort(tempArr,'tempMinValueY');
    // //
    // // //从小到大
    // // let xMaxArr = this.qsort(tempArr,'tempMaxValueX');
    // // //从小到大
    // // let yMaxArr = this.qsort(tempArr,'tempMaxValueY');
    //
    // let tempMinXMap =this.getKeyMap(xMinArr,'tempMinValueX')
    // // let tempMinYMap =this.getKeyMap(yMinArr,'tempMinValueY')
    // // let tempMaxXMap =this.getKeyMap(xMaxArr,'tempMaxValueX')
    // // let tempMaxYMap =this.getKeyMap(yMaxArr,'tempMaxValueY')
    //
    // let xjMap={};
    // let xjArr=[];
    // for(let i=0;i<tempMinXMap;i++){
    //   let item =tempMinXMap[i];
    //   let tempMaxXMapItem =item.tempMaxValueX;
    //
    //   for(let j=i+1;j<tempMinXMap.length;j++){
    //     let innerItem=tempMinXMap[j];
    //     let tempMinXMapItemInner =innerItem.tempMinValueX;
    //
    //     //if 后面的不做判断
    //     if(tempMinXMapItemInner>tempMaxXMapItem){
    //       //最小的x bi 需要比较的x大 则不需要再进行比较
    //       break
    //     }
    //
    //
    //     let isxj= this.mathData(item.xCoordinate,item.yCoordinate,item.xCoordinate2,item.yCoordinate2,
    //         innerItem.xCoordinate,innerItem.yCoordinate,innerItem.xCoordinate2,innerItem.yCoordinate2);
    //
    //
    //     let key=item.assetsId +"_"+item.assetsId2 +innerItem.assetsId +"_"+innerItem.assetsId2;
    //     if(xjMap[key]){
    //       continue
    //     }
    //     xjMap[key]=1;
    //     if(isxj){
    //       xjArr.push([item,innerItem]);
    //     }
    //
    //   }
    // }
    // // yArr = yArr.reverse()
    // // for(let item of lineArr){
    // //   let lineKey=item.startPoint+"_"+item.endPoint;
    // //   //如果已经初始化成本样例 则不需要在进行生成
    // //   this.lineMap[lineKey]=item;
    // // }
    // xjMap={}
    // return xjArr;
  }


  getmathData(xMinArr) {

    //从小到大
    // let yMinArr = this.qsort(tempArr,'tempMinValueY');
    //
    // //从小到大
    // let xMaxArr = this.qsort(tempArr,'tempMaxValueX');
    // //从小到大
    // let yMaxArr = this.qsort(tempArr,'tempMaxValueY');
    // let tempMinXMap =this.getKeyMap(xMinArr,'tempMinValueX')

    // let tempMinYMap =this.getKeyMap(yMinArr,'tempMinValueY')
    // let tempMaxXMap =this.getKeyMap(xMaxArr,'tempMaxValueX')
    // let tempMaxYMap =this.getKeyMap(yMaxArr,'tempMaxValueY')

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

        let key = item.assetsId + "_" + item.assetsId2 + innerItem.assetsId + "_" + innerItem.assetsId2;
        let key2 = innerItem.assetsId + "_" + innerItem.assetsId2 + item.assetsId + "_" + item.assetsId2 ;
        if (xjMap[key] || xjMap[key2] ) {
          continue
        }
        let isxj = this.mathData(item.xCoordinate, item.yCoordinate, item.xCoordinate2, item.yCoordinate2,
            innerItem.xCoordinate, innerItem.yCoordinate, innerItem.xCoordinate2, innerItem.yCoordinate2);

        if (isxj) {
          // console.log(item['资产标识码']+"____________"+innerItem['资产标识码'])
          //判断起点终点是否是一个点
          let isLinke= this.isLink(item.xCoordinate, item.yCoordinate, item.xCoordinate2, item.yCoordinate2, innerItem.xCoordinate, innerItem.yCoordinate, innerItem.xCoordinate2, innerItem.yCoordinate2)
          //是起点终点相连
          if(isLinke){
            continue
          }
        }
        xjMap[key] = 1;
        xjMap[key2] = 1;
        if (isxj) {
          //判断起点终点是否是一个点

          item.isAbnormal = 1
          item.abnormalInfor = item.abnormalInfor ? [...new Set([...item.abnormalInfor, '管线碰撞'])] : ['管线碰撞']
          innerItem.isAbnormal = 1
          innerItem.abnormalInfor = innerItem.abnormalInfor ? [...new Set([...innerItem.abnormalInfor, '管线碰撞'])] : ['管线碰撞']
          let obj={}

          obj['管线1类型'] = item.iconName

          obj['相交管线1编码'] = item['资产标识码']
          obj['相交管线1起点编码'] = item.assetsId
          obj['相交管线1起点经纬度'] = item.xCoordinate+" "+item.yCoordinate
          obj['相交管线1终点编码'] = item.assetsId2
          obj['相交管线1起点终点'] = item.xCoordinate2+" "+item.yCoordinate2

          obj['管线2类型'] = innerItem.iconName
          obj['相交管线2编码'] = innerItem['资产标识码']
          obj['相交管线2起点编码'] = innerItem.assetsId
          obj['相交管线2起点经纬度'] = innerItem.xCoordinate+" "+innerItem.yCoordinate
          obj['相交管线2终点编码'] = innerItem.assetsId2
          obj['相交管线2起点终点'] = innerItem.xCoordinate2+" "+innerItem.yCoordinate2

          xjArr.push(obj);
        }
      }
    }
    //直接把内部的数据给 处理掉了
    this.list = xjArr.flat()
    // console.log(this.list)

  }

  //先写后面在优化
  isLink(x1,y1,x2,y2,x3,y3,x4,y4){
    let dist1= getDistance(x1,y1,x3,y3)
    let distNum=0.5
    if(dist1<distNum){
      return true
    }
    // console.log(dist1+"___________"+1)
    dist1= getDistance(x1,y1,x4,y4)
    if(dist1<distNum){
      return true
    }
    // console.log(dist1+"___________"+2)

    dist1= getDistance(x2,y2,x3,y3)
    if(dist1<distNum){
      return true
    }
    // console.log(dist1+"___________"+3)

    dist1= getDistance(x2,y2,x4,y4)
    if(dist1<distNum){
      return true
    }
    // console.log(dist1+"___________"+1)

    return false
  }

  //
  getKeyMap(valueArr, key) {
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


  mathData(x1, y1, x2, y2, x3, y3, x4, y4) {
    if (!this.isStartAdnEnd(x1, y1, x2, y2, x3, y3, x4, y4)) {
      return false;  //说明不重合
    }
    return this.judgeIntersect(x1, y1, x2, y2, x3, y3, x4, y4)
  }

  //判断两条现代起点终点是否 有重合  如果有重合则不再做计算
  isStartAdnEnd(x1, y1, x2, y2, x3, y3, x4, y4) {
    //说明是是起点终点重合
    if ((x1 == x3 && y1 == y3) || (x2 == x4 && y2 == y4) || (x1 == x4 && y1 == y4) || (x2 == x3 && y2 == y3)) {
      //不需要在计算
      return false
    }
    //需要在进行计算
    return true
  }


  judgeIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
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
    return (u * v <= 0 && w * z <= 0);
  }


}
export { IntersectCheck }
