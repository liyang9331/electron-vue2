/**
 * Created by cp on 2022/08/24.  计算圆
 */

class  MathC {
  constructor() {
    this.earthRadius = 6371008.8;

    //本部分配置 先不用看
    this.factors = {
      centimeters: this.earthRadius * 100,
      centimetres: this.earthRadius * 100,
      degrees: 360 / (2 * Math.PI),
      feet: this.earthRadius * 3.28084,
      inches: this.earthRadius * 39.37,
      kilometers: this.earthRadius / 1000,
      kilometres: this.earthRadius / 1000,
      meters: this.earthRadius,
      metres: this.earthRadius,
      miles: this.earthRadius / 1609.344,
      millimeters: this.earthRadius * 1000,
      millimetres: this.earthRadius * 1000,
      nauticalmiles: this.earthRadius / 1852,
      radians: 1,
      yards: this.earthRadius * 1.0936,
    };

  }

   //基于中心点 圆的边的个数    以及半径（单位为米）  计算原型的点数据
  getCircle(center=[119.12,22.1],steps=40,radius=500){
    // main
    const coordinates = [];
    for (let i = 0; i < steps; i++) {
      coordinates.push( this.destination(center, radius, (i * -360) / steps) );
    }
    //使其成为一个多边形
    coordinates.push(coordinates[0]);
    console.log(coordinates)
    return  coordinates;
  }

  destination(  origin,  distance,  bearing ){
    // Handle input
    const coordinates1 =  origin;
    const longitude1 = this.degreesToRadians(coordinates1[0]);
    const latitude1 = this.degreesToRadians(coordinates1[1]);
    const bearingRad = this.degreesToRadians(bearing);
    const radians = this.lengthToRadians(distance);

    // Main
    const latitude2 = Math.asin(
      Math.sin(latitude1) * Math.cos(radians) +
      Math.cos(latitude1) * Math.sin(radians) * Math.cos(bearingRad)
    );
    const longitude2 =
      longitude1 +
      Math.atan2(
        Math.sin(bearingRad) * Math.sin(radians) * Math.cos(latitude1),
        Math.cos(radians) - Math.sin(latitude1) * Math.sin(latitude2)
      );
    const lng = this.radiansToDegrees(longitude2);
    const lat = this.radiansToDegrees(latitude2);
    return [lng, lat];
  }
  //units 以米为单位
  lengthToRadians( distance) {
    const factor = this.earthRadius;
    return distance / factor;
  }
  // 弧度转度
  radiansToDegrees(radians) {
    const degrees = radians % (2 * Math.PI);
    return (degrees * 180) / Math.PI;
  }
  //度转弧度
  degreesToRadians(degrees) {
    const radians = degrees % 360;
    return (radians * Math.PI) / 180;
  }
}

export {MathC}
