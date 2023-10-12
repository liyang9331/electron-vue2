/**
 * Created by supervisor on 2022/11/27
 */

class Relationship {
  constructor() {
    this.pointArr = [];
    this.lineArr = [];
    this.list = []
    this.lineMap = {};
    this.generateRelationshipData=null
  }


  rad(d){
    return d * Math.PI / 180.0;
  }
  getDistance (lat1, lng1, lat2, lng2){
    var radLat1 = this.rad(lat1);
    var radLat2 = this.rad(lat2);
    var a = radLat1 - radLat2;
    var b = this.rad(lng1) - this.rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137; // EARTH_RADIUS;

    return s * 1000;
  }

  init(pointArr, lineArr) {

    this.pointArr = pointArr;
    this.lineArr = lineArr;

    this.createCode();
  }

  S4(){
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  }
  getGuid(){
    return this.S4()+"_"+this.S4();
  }
  //生成编号
  createCode(){
    //排序依据x进行
    this.pointArr = this.pointArr.sort(function
        (a, b) { return a.xCoordinate  - b.xCoordinate  } // 排序
    )
    for(let item  of  this.pointArr){
      item.code=this.getGuid()
    }


  }




  //开始进行计算
  //按照x进行排序
  checkData() {
    debugger
    let that = this;
    //先基于线段的y 排序
    //基于X排序

    let tempArr = []
    for (let item of this.lineArr) {
      let tempItem = item;
      if (item.xCoordinate && item.yCoordinate && item.xCoordinate2 && item.yCoordinate2) {
        //需要有对应的数据
        let minValueX1 = Math.min(item.xCoordinate, item.xCoordinate2);
        // let minValueY1 = Math.min(item.yCoordinate, item.yCoordinate2);
        let maxValueX1 = Math.max(item.xCoordinate, item.xCoordinate2);
        // let maxValueY1 = Math.max(item.yCoordinate, item.yCoordinate2);
        tempItem.tempMinValueX = minValueX1;
        // tempItem.tempMinValueY = minValueY1
        tempItem.tempMaxValueX = maxValueX1
        // tempItem.tempMaxValueY = maxValueY1
        tempItem.reverse =false
        tempItem.minPoint=[item.xCoordinate,item.yCoordinate]
        tempItem.maxPoint=[item.xCoordinate2,item.yCoordinate2]
        if(minValueX1!=item.xCoordinate){
          //说明是逆向的
          tempItem.reverse =true
          tempItem.minPoint=[item.xCoordinate2,item.yCoordinate2]
          tempItem.maxPoint=[item.xCoordinate,item.yCoordinate]
        }

        tempArr.push(tempItem)
      }
    }
    let key = 'tempMinValueX'
    let data1 = tempArr.sort(function
        (a, b) { return a[key] - b[key] } // 排序
    )
    that.getmathData(data1)
  }


  getmathData(xMinArr) {
    let distNum =0.5
    let tempKey=0;
    for (let i = 0; i < xMinArr.length; i++) {
      let item = xMinArr[i];
      let isStartSelect=false
      for (let j= tempKey; j < this.pointArr.length; j++) {
        let pointItem  =this.pointArr[j]
        if(!isStartSelect){
          //起点的x
          let dist= this.getDistance(item.minPoint[0],item.minPoint[1],pointItem.xCoordinate,pointItem.yCoordinate)
          //小于两米
          if(dist<distNum){
            //说明是线关联的点
            tempKey=j
            isStartSelect=true;
            if(item.reverse ){
              item.endCode=pointItem.code;
            }else{
              item.startCode=pointItem.code;
            }
          }
        }else{
          //终点
          let dist= this.getDistance(item.maxPoint[0],item.maxPoint[1],pointItem.xCoordinate,pointItem.yCoordinate)
          // console.log(dist)
          //小于两米
          if(dist<distNum){
            //说明是线关联的点   逆向的话  起点和终点相反
            if(item.reverse ){
              item.startCode=pointItem.code;
            }else{
              item.endCode=pointItem.code;
            }
            break
          }
        }
      }
    }

    // let endArr= this.pointArr.concat(xMinArr);
    this.generateRelationshipData={point:this.pointArr ,line:xMinArr}
  }







}
export { Relationship }
