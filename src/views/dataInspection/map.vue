<template>
  <div class="mapBox" ref="mapBox">
    <div :id="mapDiv" class="mapClass" ref="map"></div>
    <!-- 搜索框 -->
    <div class="search">
      <div>
        <span class="label">资产标识码</span>
        <el-autocomplete
          v-model="assetsBsm"
          :fetch-suggestions="querySearch"
          class="inline-input w-50"
          placeholder="搜索"
          @select="handleSelect"
        >
          <template #default="{ item }">
            <div class="autocompleteBox">
              <div class="left">{{ item.type }}</div>
              <div class="right" v-if="item.type == '管点'">
                {{ item.value }}
              </div>
              <div class="right" v-if="item.type == '管线'">
                {{ item.assetsId + "-" + item.assetsId2 }}
              </div>
            </div>
          </template>
        </el-autocomplete>
        <el-button
          style="margin: 0 0 0 6px"
          type="primary"
          size="small"
          @click="onSearch"
          >搜索</el-button
        >
        <i class="iconfont icon-quanping1" @click="fullScreenFun"></i>
      </div>
    </div>
    <!-- 图例框 -->
    <div class="legend">
      <div class="title">
        <div class="left">图层控制</div>
        <div class="right" @click="legendShow = !legendShow">
          <span v-if="legendShow"
            >收起 <i class="iconfont icon-shuangxiajiantou-"></i>
          </span>
          <span v-if="!legendShow"
            >展开 <i class="iconfont icon-shuangshangjiantou-"></i
          ></span>
        </div>
      </div>
      <div class="tree" v-if="legendShow">
        <el-tree
          :data="legendData"
          :props="defaultProps"
          show-checkbox
          node-key="sszlNm"
          :expand-on-click-node="false"
          :check-strictly="true"
          :default-checked-keys="defaultChecked"
          @check-change="getCheckData"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span class="icon">
                <!-- 点 -->
                <img
                  v-if="judgeLegendType(data.featureType) == 'point'"
                  :src="data.sszlLegend.pointPictureUrl"
                />
                <!-- 线 -->
                <span
                  v-else-if="judgeLegendType(data.featureType) == 'line'"
                  class="line"
                >
                  <i
                    :style="{ color: data.sszlLegend.lineColor }"
                    class="iconfont icon-henggang"
                  ></i>
                </span>
                <!-- 面 -->
                <img
                  v-else-if="judgeLegendType(data.featureType) == 'polygon'"
                  :src="data.sszlLegend.pointPictureUrl"
                />
              </span>
              <span class="text">{{ node.label }}</span>
            </span>
          </template>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
import { getMapConfig } from "@/utils/map";
import "maptalks/dist/maptalks.css";
import { mapState } from "vuex";
import legend from "@/utils/style_aisensi.json";
import { assetsType } from "@/utils/asetsType";

import proj4 from 'proj4'
import '@/utils/ProjData'




export default {
  name: "myMap",
  props: {
    source: {
      type: String,
      default() {
        return "upload";
      },
    },
    mapData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  created() {
    if (this.source == "upload") {
      this.lineArray = this.pipeLineData;
      this.pointArray = this.pipePointData;
    } else if (this.source == "history") {
      this.lineArray = this.mapData.pipeLineData;
      this.pointArray = this.mapData.pipePointData;
    }
  },
  computed: {
    ...mapState("fileUpload", ["pipeLineData", "pipePointData", "shpData"]),
  },
  watch: {
    pipeLineData() {
      this.lineArray = this.pipeLineData;
      // this.markLine(this.lineArray);
    },
    pipePointData() {
      this.pointArray = this.pipePointData;
      // this.markInfo(this.pointArray);
    },
  },
  data() {
    return {
      mapDiv: "map" + new Date().getTime(),
      map: null,
      assetsBsm: "",
      markers: [],
      lineArray: [], // 管线的数据
      pointArray: [], // 管线的数据
      lineColor: "#ff0000",
      ponitIcon: require("../../assets/icon/wtb.png"),
      activeType: "",
      iFullscreen: false,
      threeLayer: null,
      points: [], // 转换后的点
      lines: [], // 转换后的线
      activeLineData: {}, // 下拉框选中线
      legendData: [],
      legendShow: true,
      defaultProps: {
        children: "shjZcflSsxl",
        label: "sszlNm",
      },
      sortPointData: {},
      sortLineData: {},
      defaultChecked: [],
      selectLine: new THREE.LineBasicMaterial({
        linewidth: 1,
        color: 0x1818de,
        // opacity: 0.8,
        transparent: true,
      }),
      selectMeshList: [],
      displayFieldsList: [
        {
          name: "资产名称",
          key: "资产名称",
        },
        {
          name: "资产标识码",
          key: "assetsId",
        },
        {
          name: "所属标识码",
          key: "所属标识码",
        },
        {
          name: "在源表格的第几行",
          key: "data_location",
        },
        {
          name: "X坐标",
          key: "xCoordinate",
        },
        {
          name: "Y坐标",
          key: "yCoordinate",
        },
        {
          name: "高程",
          key: "高程",
        },
      ],
      displayFieldsList2: [
        {
          name: "资产名称",
          key: "资产名称",
        },
        {
          name: "资产标识码",
          key: "assetsId",
        },
        {
          name: "所属标识码",
          key: "所属标识码",
        },
        {
          name: "在源表格的第几行",
          key: "data_location",
        },
        {
          name: "起始X坐标",
          key: "xCoordinate",
        },
        {
          name: "起始Y坐标",
          key: "yCoordinate",
        },
        {
          name: "终止X坐标",
          key: "xCoordinate2",
        },
        {
          name: "终止Y坐标",
          key: "yCoordinate2",
        },
        {
          name: "高程",
          key: "高程",
        },
      ],
    };
  },
  mounted() {
    this.getlegendData();
    this.getInitMap();
    window.closeTipBox = this.closeTipBox;
    // this.markInfo(this.pointArray);
    // this.markLine(this.lineArray);
  },
  methods: {
    // 选中的树形结构
    getCheckData(data, isSelect) {
      let str = data.sszlNm;
      let type = this.judgeLegendType(data.featureType);
      if (type == "point") {
        let arr = this.points.filter(
          (item) => item.dataType == str || item.dataType == str + "abnormal"
        );
        if (arr.length == 0) return;
        for (let i = 0; i < arr.length; i++) {
          if (isSelect) {
            arr[i].show();
          } else {
            arr[i].hide();
          }
        }
      } else if (type == "line") {
        let arr = this.lines.filter(
          (item) => item.dataType == str || item.dataType == str + "abnormal"
        );
        if (arr.length == 0) return;
        for (let i = 0; i < arr.length; i++) {
          if (isSelect) {
            arr[i].show();
          } else {
            arr[i].hide();
          }
        }
      }
    },
    judgeLegendType(featureType) {
      return featureType.split("_")[1];
    },
    // 获取图例数据
    getlegendData() {
      this.legendData = JSON.parse(
        JSON.stringify(legend.result)
          .replace(/ssxlId/g, "sszlId")
          .replace(/ssxlLegend/g, "sszlLegend")
          .replace(/ssxlName/g, "sszlNm")
      );
    },
    handleSelect(item) {
      this.activeType = item.type;
      if (item.type == "管线") {
        this.activeLineData = item;
        this.assetsBsm = item.assetsId + "-" + item.assetsId2;
      } else {
        this.assetsBsm = item.value;
      }
    },
    // 自动补全事件
    querySearch(queryString, cb) {
      let arr = [];
      let results = [];
      if (!queryString) {
        cb(arr);
        return;
      }
      this.pointArray.forEach((item) => {
        if (
          item["assetsId"].toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        ) {
          results.push({
            type: "管点",
            value: item["assetsId"],
          });
        }
      });
      this.lineArray.forEach((item) => {
        if (
          item["assetsId"].toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        ) {
          results.push({
            ...item,
            value: item["assetsId"],
            type: "管线",
          });
        }
        if (
          item["assetsId2"].toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        ) {
          results.push({
            ...item,
            value: item["assetsId2"],
            type: "管线",
          });
        }
      });

      cb(results.length > 10 ? results.slice(0, 10) : results);
    },
    // 搜索事件
    onSearch() {
      if (!this.assetsBsm) return;
      if (this.activeType == "管点") {
        let point = "";
        let index = 0;
        for (let i = 0; i < this.points.length; i++) {
          let arr = this.points[i].options.points;
          for (let j = 0; j < arr.length; j++) {
            if (arr[j].markerData.assetsId == this.assetsBsm) {
              point = arr[j];
              index = i;
            }
          }
        }
        this.onClick(point, index, 2);
      } else {
        let line = "";
        let index = 0;
        for (let i = 0; i < this.lines.length; i++) {
          let arr = this.lines[i].options.lineStrings;
          for (let j = 0; j < arr.length; j++) {
            if (
              arr[j].markerData["assetsId"] ===
                this.activeLineData["assetsId"] &&
              arr[j].markerData["assetsId2"] ===
                this.activeLineData["assetsId2"]
            ) {
              line = arr[j];
              index = i;
            }
          }
        }
        this.onClickLine(line, index, 2);
      }
    },
    // 锁定定位到某元素 管点和管线
    lockingPosition(str) {
      let vector = this.activeType == "管点" ? "vector2" : "vector1";
      const camera = this.map.getLayer(vector).getGeometryById(str);
      if (camera == null) return;
      // this.map.panTo(camera.getCenter());
      this.map.animateTo(
        {
          center: [camera.markerData.lon, camera.markerData.lat],
          zoom: 18.5,
        },
        {
          duration: 1000,
        }
      );
      camera.fire("click");
    },
    // 地图放大
    fullScreenFun() {
      var fullscreenEnabled =
        document.fullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.msFullscreenEnabled;
      if (fullscreenEnabled) {
        let de = this.$refs.mapBox;
        //打开全屏
        if (de.requestFullscreen) {
          de.requestFullscreen();
        } else if (de.mozRequestFullScreen) {
          de.mozRequestFullScreen();
        } else if (de.webkitRequestFullScreen) {
          de.webkitRequestFullScreen();
        }
      }
    },
    // 初始化地图
    getInitMap() {
      let configObj = getMapConfig();
      this.map = new maptalks.Map(this.mapDiv, configObj);

      // 设置地图的中心点
      if (this.pointArray.length != 0 || this.lineArray.length != 0) {
        let coordinate =
          this.pointArray.length != 0
            ? [this.pointArray[0].lon, this.pointArray[0].lat]
            : [this.lineArray[0].lon, this.lineArray[0].lat];
        this.map.setCenter(coordinate);
      }

      this.threeLayer = new maptalks.ThreeLayer("t", {
        forceRenderOnMoving: true,
        forceRenderOnRotating: true,
        animation: true,
      });
      // new maptalks.VectorLayer("vector3", this.shpData).addTo(this.map);
      this.threeLayer.addTo(this.map);
      this.addThreeLayer();
    },
    // 添加three.js图层  点
    addThreeLayer() {
      this.threeLayer.prepareToDraw = (gl, scene, camera) => {
        this.getMapSetPoint();
        this.getMapSetLine();
      };
    },
    // 数据分类
    getDataClassification(arrList, typeStr) {
      return arrList.reduce((prev, cur) => {
        let type =
          cur.isAbnormal && cur.isAbnormal == 1
            ? cur[typeStr] + "abnormal"
            : cur[typeStr];
        if (Object.keys(prev).includes(type)) {
          prev[type].push(cur);
        } else {
          prev[type] = [];
          prev[type].push(cur);
        }
        return prev;
      }, {});
    },
    // 处理默认选中的数据
    getDefaultData(list) {
      let arr = [];
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (item.includes("abnormal")) {
          arr.push(item.replace("abnormal", ""));
        } else {
          arr.push(item);
        }
      }
      return [...new Set(arr)];
    },
    // 画点
    getMapSetPoint() {
      if (this.pointArray.length == 0) return;
      const material = (item) => {
        return new THREE.PointsMaterial({
          sizeAttenuation: false,
          size: 25,
          transparent: true, //使材质透明
          depthTest: true, //深度测试关闭，不消去场景的不可见面
          depthWrite: false,
          map: new THREE.TextureLoader().load(this.judgeIsAbnormal(item)),
        });
      };
      this.sortPointData = this.getDataClassification(
        this.pointArray,
        "iconName"
      );

      this.defaultChecked = [
        ...this.defaultChecked,
        ...this.getDefaultData(Object.keys(this.sortPointData)),
      ];
      for (let key in this.sortPointData) {
        let item = this.sortPointData[key];
        let pointData = item.map((item1) => {

         // let reItem = this.coordinateTransformation(item1.lon, item1.lat)
         //  console.log(JSON.stringify(reItem))
          return {
            coordinate: [item1.lon, item1.lat],
            height: 0,
            value: Math.random() * 10000,
            markerData: item1,
          };
        });
        const point = this.threeLayer.toPoints(
          pointData,
          {},
          material(item[0])
        );
        point.dataType = key;
        this.points.push(point);
        point.on("click", (e) => {
          this.onClick(e);
        });
      }
      this.threeLayer.addMesh(this.points);
      this.animation();
    },
    // 画线
    getMapSetLine() {
      if (this.lineArray.length == 0) return;
      const material2 = (item) => {
        return new THREE.LineBasicMaterial({
          linewidth: 40,
          color:
            item.isAbnormal && item.isAbnormal == 1
              ? this.lineColor
              : item.lineColor,
        });
      };
      this.sortLineData = this.getDataClassification(
        this.lineArray,
        "iconName"
      );
      this.defaultChecked = [
        ...this.defaultChecked,
        ...Object.keys(this.sortLineData),
      ];
      for (let key in this.sortLineData) {
        let item = this.sortLineData[key];
        let lineStrings = [];
        item.forEach((item1) => {
          if (item1.lon&&item1.lat&&item1.lon2&& item1.lat2&&
            item1.lon != "" &&
            item1.lat != "" &&
            item1.lon2 != "" &&
            item1.lat2 != ""
          ) {
            let lineString = new maptalks.LineString([
              [item1.lon, item1.lat],
              [item1.lon2, item1.lat2],
            ]);
            lineString.markerData = item1;
            lineStrings.push(lineString);
          }
        });
        const meshLine = this.threeLayer.toLines(
          lineStrings,
          {},
          material2(item[0])
        );
        meshLine.dataType = key;
        meshLine.on("click", (e) => {
          this.onClickLine(e);
        });
        this.lines.push(meshLine);
      }
      this.threeLayer.addMesh(this.lines);
      this.animation();
    },
    animation() {
      this.threeLayer._needsUpdate = !this.threeLayer._needsUpdate;
      if (this.threeLayer._needsUpdate) {
        this.threeLayer.redraw();
      }
      requestAnimationFrame(this.animation);
    },
    // 隐藏弹框
    closeTipBox() {
      this.tipBox.closeInfoWindow();
    },
    // 点击线
    onClickLine(e, index, type = 1) {
      let data = null;
      let baseObject = null;
      if (type == 2) {
        data = e;
        baseObject = e;
      } else {
        data = e.selectMesh.data;
        baseObject = e.selectMesh.baseObject;
      }
      let str = "";
      this.displayFieldsList2.forEach((item) => {
        str += `<div style="display:${
          data.markerData[item.key] != undefined ? "block" : "none"
        } " class='tip-content-box-item'>
                <div><span>${item.name}：</span>${
          data.markerData[item.key]
        }</div>
              </div>`;
      });
      let options = {
        custom: true,
        dx: 0,
        dy: -20,
        content: `
          <div class='tip-content'>
            <div class='tip-title'>
              <div>${data.markerData["assetsId"]} - ${
          data.markerData["assetsId2"]
        }</div>
              <div class='close' onClick="closeTipBox()"> X </div>
            </div>
            <div class='tip-content-box'>
              ${str}
              <div style="display:${
                data.markerData["isAbnormal"] == 1 ? "block" : "none"
              } "class='tip-content-box-item'>
                <div><span>异常信息：</span>${
                  data.markerData["isAbnormal"] == 1
                    ? data.markerData["abnormalInfor"].join()
                    : ""
                }</div>
              </div>
            </div>
            <div class="tip-arrow"></div>
          </div>
        `,
      };
      if (this.selectMeshList.length != 0) {
        this.threeLayer.removeMesh(this.selectMeshList);
        this.selectMeshList = [];
      }
      if (type == 1) {
        baseObject.setSymbol(this.selectLine);
        this.threeLayer.addMesh(baseObject);
        this.selectMeshList.push(baseObject);
        e.target.setInfoWindow(options);
        this.tipBox = e.target.openInfoWindow(e.coordinate);
      } else {
        this.lines[index].setInfoWindow(options);
        let line = this.threeLayer.toLine(e, { altitude: 0 }, this.selectLine);
        this.threeLayer.addMesh(line);
        this.selectMeshList.push(line);
        this.tipBox = this.lines[index].openInfoWindow(e._coordinates[0]);
      }
    },
    // 判断是否是异常点位
    judgeIsAbnormal(data) {
      if (data.isAbnormal && data.isAbnormal == 1) {
        // 异常数据
        return this.ponitIcon;
      } else {
        // return require(`../../assets/icon/${data.iconText}.png`);
        return `https://weam.capitalwater.cn/assets-oss/bucket/scshj/layerManage/${data.iconText}.png`;
      }
    },


// // 坐标转换
//     coordinateTransformation(longitude, latitude) {
//       var firstProjection = new proj4.Proj(`EPSG:4326`);
//       var secondProjection = new proj4.Proj('EPSG:4490_7c' );
//       var result = proj4.transform(firstProjection, secondProjection, [Number(longitude), Number(latitude)]);
//       return result;
//     },


    // 点的点击事件
    onClick(e, index, type = 1) {
      let data = null;
      if (type == 2) {
        data = e;
      } else {
        data = e.selectMesh.data;
      }
      let str = "";
      this.displayFieldsList.forEach((item) => {
        str += `<div style="display:${
          data.markerData[item.key] != undefined ? "block" : "none"
        } " class='tip-content-box-item'>
                <div><span>${item.name}：</span>${
          data.markerData[item.key]
        }</div>
              </div>`;
      });
      let options = {
        custom: true,
        dx: 0,
        dy: -20,
        content: `
          <div class='tip-content'>
            <div class='tip-title'>
              <div>${data.markerData["assetsId"]}</div>
              <div class='close' onClick="closeTipBox()"> X </div>
            </div>
            <div class='tip-content-box'>
              ${str}
              <div style="display:${
                data.markerData["isAbnormal"] == 1 ? "block" : "none"
              } "class='tip-content-box-item'>
                <div><span>异常信息：</span>${
                  data.markerData["isAbnormal"] == 1
                    ? data.markerData["abnormalInfor"].join()
                    : ""
                }</div>
              </div>
            </div>
            <div class="tip-arrow"></div>
          </div>
        `,
      };
      if (type == 1) {
        e.target.setInfoWindow(options);
        this.tipBox = e.target.openInfoWindow(e.coordinate);
      } else {
        this.points[index].setInfoWindow(options);
        this.tipBox = this.points[index].openInfoWindow(e.coordinate);
      }
    },
  },
};
</script>
<style lang="scss">
.tip-content {
  width: 288px;
  background: #ffffff;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  border-radius: 4px;
  padding: 10px 0;
  position: relative;
  .tip-title {
    font-size: 14px;
    font-weight: 600;
    color: #1f263e;
    line-height: 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f1f1;
    padding: 0 15px 6px 15px;
    .close {
      cursor: pointer;
      font-size: 12px;
      color: #1f263e;
    }
  }
  .tip-content-box {
    padding: 10px 15px;
    max-height: 200px;
    overflow: auto;
    .tip-content-box-item {
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);

      line-height: 22px;
      display: flex;
      div {
        flex: 1;
      }
      span {
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
      }
    }
  }
  .tip-arrow {
    position: absolute;
    display: inline-block;
    height: 0;
    width: 0;
    border-top: 8px solid #fff;
    border-bottom: 8px solid transparent;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    bottom: -16px;
    left: 50%;
    transform: translate(-50%);
  }
}
</style>
<style lang="scss" scoped>
::v-deep {
  .el-autocomplete-suggestion {
    max-height: 200px;
  }
}
.autocompleteBox {
  display: flex;
  align-items: center;
  font-weight: 400;
  line-height: 28px;
  .left {
    margin-right: 20px;
    color: rgba(0, 0, 0, 0.5);
  }
  .right {
    color: #000000;
  }
}
.mapBox {
  position: relative;
  height: calc(100vh - 105px);
  .mapClass {
    width: 100%;
    height: 100%;
  }
  .search {
    background-color: #fff;
    padding: 6px 10px;
    position: absolute;
    top: 4px;
    right: 4px;
    border: 1px solid #eee;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    div {
      display: flex;
      white-space: nowrap;
      font-size: 16px;
      align-items: center;
      .label {
        padding-right: 6px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
      }
      .icon-quanping1 {
        font-size: 18px;
        color: #099dfd;
        margin-left: 10px;
      }
    }
  }

  .legend {
    width: 218px;
    overflow: hidden;
    background-color: #fff;
    position: absolute;
    bottom: 20px;
    right: 20px;
    padding: 14px 16px;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    .tree {
      height: 240px;
      overflow: auto;
    }
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
      .left {
        font-weight: 600;
        color: #000a12;
        line-height: 20px;
      }
      .right {
        font-size: 11px;
        font-weight: 300;
        color: #0190e3;
        line-height: 16px;
        cursor: pointer;
        .iconfont {
          font-size: 11px;
        }
      }
    }
    .custom-tree-node {
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        margin-right: 6px;
        .line {
          width: 10px;
          display: inline-block;
          font-weight: bold;
        }
        img {
          width: 12px;
          height: 12px;
        }
      }
      .text {
        font-weight: 400;
        color: rgba(31, 38, 62, 0.5);
        line-height: 17px;
        font-size: 12px;
      }
    }
  }
}
</style>
