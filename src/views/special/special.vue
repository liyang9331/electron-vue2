<template>
  <div class="special">
    <div id="map"></div>
    <div class="globalSearch">
      <!-- 展开 -->
      <div
        class="open switchBtn"
        v-show="!isShowDetail"
        @click="isShowDetail = true"
      >
        {{ "<<" }}
      </div>
      <!-- 收起 -->
      <div
        class="putAway switchBtn"
        v-show="isShowDetail"
        @click="isShowDetail = false"
      >
        >>
      </div>
      <!-- 内容区域 -->
      <div class="content" v-show="isShowDetail">
        <div class="title">全局搜索</div>
        <div class="search">
          <el-select
            v-model="activeType"
            style="width: 80px; margin-right: 10px"
            @change="changeActiveType"
          >
            <el-option
              v-for="item in typeData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input v-model="identificationCode" placeholder="请输入标识码">
            <template #append
              ><el-button type="primary" @click="onSearch"
                >查询</el-button
              ></template
            >
          </el-input>
        </div>
        <point-data
          v-show="activeType == '管点'"
          :pointArray="tableData"
          @handPointData="handPointData"
        ></point-data>
        <line-data
          v-show="activeType == '管线'"
          :lineArray="tableData"
          @handLineData="handLineData"
        ></line-data>
        <!-- 分页器 -->
        <div
          class="pagination"
          v-if="
            (pointArrData.length !== 0 && activeType == '管点') ||
            (lineArrData.length !== 0 && activeType == '管线')
          "
        >
          <el-pagination
            small
            background
            layout="prev, pager, next"
            :total="
              activeType == '管点' ? pointArrData.length : lineArrData.length
            "
            v-model:currentPage="currentPage"
            :page-size="20"
            :pager-count="4"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 统计区域 -->
    <div class="statistics" v-show="statisticsShow">
      <div class="statistics-top">
        <div>管线统计</div>
        <div class="icon">
          <i class="iconfont icon-chevronsleftshuangzuojiantou"></i>
          <i class="iconfont icon-shuxian"></i>
          <i class="iconfont icon-guanbi" @click="statisticsShow = false"></i>
        </div>
      </div>
      <div class="statistics-item">
        <span class="left">查询设备</span>
        <div class="select">
          <el-autocomplete
            v-model="state1"
            :fetch-suggestions="querySearch"
            clearable
            class="inline-input w-50"
            placeholder="请输入标识码"
            @select="handleSelect"
          />
        </div>
      </div>
      <div class="statistics-item">
        <span class="left">绘制地块</span>
        <div class="massif">
          <span
            class="massif-item"
            :class="{ 'active-massif': selectMassifType == item.label }"
            v-for="item in massifTypeList"
            :key="item.label"
            @click="changeMassifType(item)"
            >{{ item.label }}</span
          >
        </div>
      </div>
      <div class="statistics-item">
        <span class="left">添加条件</span>
        <div class="select condition">
          <el-input
            :rows="2"
            type="textarea"
            placeholder="Please input"
            style="width: 100%"
          />
        </div>
      </div>
      <div class="statistics-item">
        <span class="left">关系</span>
        <div class="relationship">
          <el-radio-group v-model="radio1" class="ml-4">
            <el-radio label="1" size="large">并且</el-radio>
            <el-radio label="2" size="large">或者</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="searchBtn">
        <el-button type="primary" size="small" @click="onClearAll"
          >清除</el-button
        >
        <el-button type="primary" size="small" @click="handQuery"
          >查询</el-button
        >
      </div>
    </div>
    <!-- 统计结果区域 -->
    <statistical-results
      v-if="statisticalResultsShow"
      :tableDataList="tableDataList"
      @showSelectLine="showSelectLine"
    ></statistical-results>
  </div>
</template>

<script>
import * as maptalks from "maptalks";
import { conigObj } from "@/utils/map";
import PointData from "./pointData.vue";
import LineData from "./lineData.vue";
import * as turf from "@turf/turf";
import { booleanContains, pointSeekLine } from "@/utils/index";
import StatisticalResults from "./statisticalResults.vue";
import db from "@/utils/db";
import { mapState } from "vuex";

export default {
  components: {
    PointData,
    LineData,
    StatisticalResults,
  },
  computed: {
    ...mapState("check", ["shpData"]),
  },
  data() {
    return {
      pointArrData: [],
      lineArrData: [],
      state1: "",
      selectMassifType: "全区",
      radio1: "",
      massifTypeList: [
        {
          label: "全区",
          type: "",
        },
        {
          label: "多边形",
          type: "Polygon",
        },
        {
          label: "矩形",
          type: "Rectangle",
        },
        {
          label: "点",
          type: "Point",
        },
        {
          label: "管点",
          type: "",
        },
      ],
      value: "Option1",
      options: [
        {
          value: "Option1",
          label: "Option1",
        },
        {
          value: "Option2",
          label: "Option2",
        },
        {
          value: "Option3",
          label: "Option3",
        },
      ],
      markers: [],
      map: null,
      multipoint: null,
      multiline: null,
      layer: null,
      drawTool: null,
      drawtoollayer: null,
      isShowDetail: true,
      special: "",
      objData: {},
      pointFile: "",
      lineFile: "",
      pointArray: [],
      lineArray: [],
      typeData: [
        {
          label: "管点",
          value: "管点",
        },
        {
          label: "管线",
          value: "管线",
        },
      ],
      activeType: "管点",
      identificationCode: "", // 标识码
      regionPoint: [], // 选中区域内的点
      regionLine: [], // 选中区域内的线
      ponitIcon: require("../../assets/images/point.png"),
      changePonitIcon: require("../../assets/images/point-select.png"),
      lineColor: "#1bbc9b",
      changeLineColor: "#ff0000",
      tipBox: null,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      tableData: [], // 列表数据
      drawendPointNum: [], // 绘制点的数量
      pointOfPolygon: null,
      tableDataList: [], // 查询结果框的表格数据
      statisticsShow: false,
      statisticalResultsShow: false,
      connectPipelinePoint: [], // 选择的两个管点
      connectLine: [], // 选择的两个管点 连接的管线
      tableName: "check_info",
      tableNameLine: "check_info_line",
    };
  },
  created() {},
  mounted() {
    this.getInitMap();
    // 获取数据
    this.getListAll();
    window.closeTipBox = this.closeTipBox;
  },
  watch: {
    currentPage() {
      this.tableData = [...this.handTableData()];
    },
  },
  methods: {
    handleSelect(item) {
      this.identificationCode = this.state1;
      this.onSearch();
    },
    // 自动补全事件
    querySearch(queryString, cb) {
      let arr = [];
      let results = [];
      if (!queryString) {
        cb(arr);
        return;
      }
      if (this.activeType == "管点") {
        this.pointArray.forEach((item) => {
          if (
            item["标识码"].toLowerCase().indexOf(queryString.toLowerCase()) ===
            0
          ) {
            results.push({
              ...item,
              value: item["标识码"],
            });
          }
        });
      } else {
        arr = [...this.lineArray];
        this.lineArray.forEach((item) => {
          if (
            item["起始节点标识码"]
              .toLowerCase()
              .indexOf(queryString.toLowerCase()) === 0
          ) {
            results.push({
              value: item["起始节点标识码"],
            });
          }
          if (
            item["终止节点标识码"]
              .toLowerCase()
              .indexOf(queryString.toLowerCase()) === 0
          ) {
            results.push({
              value: item["终止节点标识码"],
            });
          }
        });
      }
      cb(results.length > 10 ? results.slice(0, 10) : results);
    },
    // 获取点的数据
    getListPointData() {
      var sqlStr = `select * from '${this.tableName}' order by id DESC;`;
      return new Promise((resolve, reject) => {
        db.select(sqlStr).then(
          (res) => {
            resolve(res);
          },
          (err) => {
            console.log("error：", err);
          }
        );
      });
    },
    // 获取线的数据
    getListLineData() {
      var sqlStr = `select * from '${this.tableNameLine}' order by id DESC;`;
      return new Promise((resolve, reject) => {
        db.select(sqlStr).then(
          (res) => {
            resolve(res);
          },
          (err) => {
            console.log("error：", err);
          }
        );
      });
    },
    getListAll() {
      Promise.all([this.getListPointData(), this.getListLineData()]).then(
        (res) => {
          this.pointArrData = [...res[0]];
          this.lineArrData = [...res[1]];
          this.pointArray = [...res[0]];
          this.lineArray = [...res[1]];
          this.init();
          this.tableData = this.handTableData();
        }
      );
    },
    // 选择两个点位后链接管线
    connectPipeline() {
      let arr = pointSeekLine(
        this.connectPipelinePoint[0].markerData["标识码"],
        this.connectPipelinePoint[1].markerData["标识码"],
        this.map.getLayer("vector1")
      );
      arr.forEach((feature) => {
        feature.updateSymbol({
          lineColor: this.changeLineColor,
        });
      });
      this.connectLine = [...arr];
      this.tableDataList = [...arr];
      // this.markLine(arr);
    },
    // 恢复管线的初始颜色
    recoveryLineColor(arr) {
      arr.forEach((feature) => {
        feature.updateSymbol({
          lineColor: this.lineColor,
        });
      });
    },
    // 点击表格的某一行查找对应的管线
    showSelectLine(item) {
      let that = this;
      let str = item["起始节点标识码"] + item["终止节点标识码"];
      let vector = "vector1";
      const camera = this.map.getLayer(vector).getGeometryById(str);
      if (camera == null) return;
      var targetStyles = {
        symbol: {
          lineColor: "aqua",
          lineWidth: 5,
        },
      };
      // animate by maptalks.animation.Animation
      var player = maptalks.animation.Animation.animate(
        targetStyles,
        {
          duration: 1000,
          easing: "linear",
        },
        // callback of each frame
        function step(frame) {
          if (frame.state.playState === "running") {
            camera.updateSymbol(frame.styles.symbol);
          } else if (frame.state.playState === "finished") {
            camera.updateSymbol({
              lineColor: that.lineColor,
              lineWidth: 3,
            });
          }
        }
      );
      player.play();
    },
    // 查询事件
    handQuery() {
      this.tableDataList = [];
      if (this.selectMassifType == "点") {
        // 还是判断管点和管线
        this.selectTwoPoint(this.drawendPointNum);
      } else if (
        this.selectMassifType == "多边形" ||
        this.selectMassifType == "矩形"
      ) {
        // 判断点
        this.selectedAreaPoint(this.pointOfPolygon);
        // 判断线
        this.selectedAreaLine(this.pointOfPolygon);
      } else if (this.selectMassifType == "管点") {
        this.connectPipeline();
        this.connectPipelinePoint = [];
      }
    },
    // 切换地块类型
    changeMassifType(item) {
      this.selectMassifType = item.label;
      this.regionLine = [];
      if (item.type == "Point") {
        this.setDrawToolPoint(item.type);
      } else if (item.type == "Polygon" || item.type == "Rectangle") {
        this.setDrawTool(item.type);
      }
    },
    // 下拉框切换事件
    changeActiveType() {
      this.currentPage = 1;
      this.tableData = [...this.handTableData()];
    },
    // 点击页码
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    // 处理表格数据
    handTableData() {
      let arr = [];
      if (this.activeType == "管点") {
        if (this.pointArrData.length == 0) return [];
        arr = [...this.pointArrData].slice(
          (this.currentPage - 1) * this.pageSize,
          this.currentPage * this.pageSize
        );
      } else {
        if (this.lineArrData.length == 0) return [];
        arr = [...this.lineArrData].slice(
          (this.currentPage - 1) * this.pageSize,
          this.currentPage * this.pageSize
        );
      }
      return arr;
    },
    // 点
    handPointData(item) {
      // this.identificationCode = item["标识码"];
      this.lockingPosition(item["标识码"]);
    },
    // 线
    handLineData(item) {
      // this.identificationCode = item["标识码"];
      this.lockingPosition(item["起始节点标识码"] + item["终止节点标识码"]);
    },
    // 查询按钮的方法
    onSearch() {
      if (!this.identificationCode) return;
      if (this.activeType == "管点") {
        // 管点的定位
        this.lockingPosition(this.identificationCode);
      } else {
        // 获取查询的管线
        let arr = this.lineArray.filter((item) => {
          return (
            item["起始节点标识码"] === this.identificationCode ||
            item["终止节点标识码"] === this.identificationCode
          );
        });
        let str = arr[0]["起始节点标识码"] + arr[0]["终止节点标识码"];
        this.lockingPosition(str);
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
      // 自动适配区域
      // this.map.fitExtent(camera.getExtent(), 2);
      camera.fire("click");
    },
    init() {
      if (this.pointArray.length !== 0) {
        this.markInfo(this.pointArray);
      }
      if (this.lineArray.length !== 0) {
        this.markLine(this.lineArray);
      }
    },
    // 初始化地图
    getInitMap() {
      this.map = new maptalks.Map("map", conigObj);
      if (this.shpData.length == 0) return;
      new maptalks.VectorLayer("vector3", this.shpData).addTo(this.map);
    },
    // 往地图上添加线
    markLine(arr) {
      if (arr.length === 0) return;
      let multiline = [];
      arr.forEach((item) => {
        var line = new maptalks.LineString(
          [
            [item.lon, item.lat],
            [item.lon2, item.lat2],
          ],
          {
            id: item["起始节点标识码"] + item["终止节点标识码"],
            arrowStyle: null, // arrow-style : now we only have classic
            arrowPlacement: "vertex-last", // arrow's placement: vertex-first, vertex-last, vertex-firstlast, point
            visible: true,
            editable: true,
            cursor: null,
            shadowBlur: 0,
            shadowColor: "black",
            draggable: false,
            dragShadow: false, // display a shadow during dragging
            drawOnAxis: null, // force dragging stick on a axis, can be: x, y
            symbol: {
              lineColor: this.lineColor,
              lineWidth: 3,
            },
          }
        );

        line.markerData = item;
        line.on("click", (e) => {
          this.onClickLine(e);
        });
        multiline.push(line);
      });

      if (!this.map.getLayer("vector1")) {
        let lineArr = new maptalks.VectorLayer("vector1", multiline)
          .addTo(this.map)
          .setZIndex(1);
        // 自动适配区域
        this.map.fitExtent(lineArr.getExtent(), 0);
      }
    },
    // 往地图上添加点位
    markInfo(arr) {
      if (arr.length === 0) return;
      this.markers = [];
      arr.forEach((item) => {
        let point = new maptalks.Marker([item.lon, item.lat], {
          id: item["标识码"], //  给每个点添加id
          visible: true,
          editable: true,
          cursor: "pointer",
          shadowBlur: 0,
          shadowColor: "black",
          draggable: false,
          dragShadow: false, // display a shadow during dragging
          drawOnAxis: null, // force dragging stick on a axis, can be: x, y
          symbol: {
            textFaceName: "sans-serif",
            textName: "",
            textFill: "#34495e",
            textHorizontalAlignment: "right",
            textSize: 40,
            markerFile: this.ponitIcon,
            markerWidth: 30,
            markerHeight: 30,
            markerHorizontalAlignment: "middle",
            markerVerticalAlignment: "middle",
          },
        });
        point.markerData = item;
        point.on("click", (e) => {
          this.onClick(e);
          // 点击点位
          if (this.connectPipelinePoint.length == 2) return;
          this.connectPipelinePoint.push(point);
        });
        this.markers.push(point);
      });
      if (!this.map.getLayer("vector2")) {
        let pointArr = new maptalks.VectorLayer("vector2", this.markers)
          .addTo(this.map)
          .setZIndex(3);
        this.map.fitExtent(pointArr.getExtent(), 0);
      }
    },
    // 点的点击事件
    onClick(e) {
      let options = {
        custom: true,
        dx: 0,
        dy: -12,
        content: `
          <div class='tip-content'>
            <div class='tip-title'>
              <div>${e.target.markerData["标识码"]}</div>
              <div class='close' onClick="closeTipBox()"> X </div>
            </div>
            <div class='tip-content-box'>
              <div class='tip-content-box-item'>
                <div><span>类型：</span>${e.target.markerData["检查井类型"]}</div>
                <div><span>井盖/盖板尺寸：</span>${e.target.markerData["井盖/盖板尺寸（mm）"]}</div>
              </div>
              <div class='tip-content-box-item'>
                <div><span>地址描述：</span>${e.target.markerData["地址描述"]}</div>
              </div>
            </div>
            <div class="tip-arrow"></div>
          </div>
        `,
      };
      e.target.setInfoWindow(options);
      this.tipBox = e.target.openInfoWindow();
    },
    // 隐藏弹框
    closeTipBox() {
      this.tipBox.closeInfoWindow();
    },
    // 点击线
    onClickLine(e) {
      let options = {
        custom: true,
        dx: 0,
        dy: -12,
        content: `
          <div class='tip-content'>
            <div class='tip-title'>
              <div>${e.target.markerData["起始节点标识码"]} - ${e.target.markerData["终止节点标识码"]}</div>
              <div class='close' onClick="closeTipBox()"> X </div>
            </div>
            <div class='tip-content-box'>
              <div class='tip-content-box-item'>
                <div><span>管渠长度 （m）：</span>${e.target.markerData["管渠长度 （m）"]}</div>
              </div>
              <div class='tip-content-box-item'>
                <div><span>管径（mm）：</span>${e.target.markerData["管径（mm）"]}</div>
              </div>
              <div class='tip-content-box-item'>
                <div><span>管渠起点埋深（m）：</span>${e.target.markerData["管渠起点埋深（m）"]}</div>
              </div>
              <div class='tip-content-box-item'>
                <div><span>管渠终点埋深（m）：</span>${e.target.markerData["管渠终点埋深（m）"]}</div>
              </div>
              <div class='tip-content-box-item'>
                <div><span>管底起点标高 （m）：</span>${e.target.markerData["管底起点标高 （m）"]}</div>
              </div>
              <div class='tip-content-box-item'>
                <div><span>管底终点标高 （m）：</span>${e.target.markerData["管底终点标高 （m）"]}</div>
              </div>
              <div class='tip-content-box-item'>
                <div><span>所处位置：</span>${e.target.markerData["所处位置"]}</div>
              </div>
            </div>
            <div class="tip-arrow"></div>
          </div>
        `,
      };
      e.target.setInfoWindow(options);
      this.tipBox = e.target.openInfoWindow();
    },

    // 清除选中区域中的管点和管道颜色
    clearSelectArea() {
      this.regionPoint.forEach((feature) => {
        feature.updateSymbol({
          markerFile: this.ponitIcon,
        });
      });
      if (this.regionLine.length != 0) {
        this.recoveryLineColor(this.regionLine);
      }
    },
    // 绘制图形
    setDrawTool(type) {
      let symbol = [
        {
          lineColor: "#34495e",
          lineWidth: 3,
          polygonFill: "#fff",
          opacity: 0.2,
        },
        {
          textWeight: "bold",
          textSize: 30,
          textFill: "#fff",
        },
      ];
      if (!this.map.drawTool) {
        this.map.drawTool = new maptalks.DrawTool({
          mode: type,
          once: true,
        })
          .addTo(this.map)
          .disable();

        this.map.drawTool.on("drawend", (params) => {
          // console.log(params.geometry.toGeoJSON().geometry.coordinates);
          this.pointOfPolygon =
            params.geometry.toGeoJSON().geometry.coordinates;
          const drawtoollayer = this.map.getLayer("drawtoollayer");
          params.geometry.setProperties({
            coord:
              params.geometry.getCenter().x +
              "," +
              params.geometry.getCenter().y,
          });
          // 设置样式
          params.geometry.setSymbol(symbol);
          params.geometry.addTo(drawtoollayer);
        });
        if (!this.map.getLayer("drawtoollayer")) {
          this.drawtoollayer = new maptalks.VectorLayer("drawtoollayer").addTo(
            this.map
          );
        }
        this.map.drawTool.setMode(type).enable();
      }
    },
    // 绘制点
    setDrawToolPoint(type) {
      if (!this.map.drawTool) {
        this.map.drawTool = new maptalks.DrawTool({
          mode: type,
        })
          .addTo(this.map)
          .disable();
        this.map.drawTool.on("drawend", (params) => {
          const drawtoollayer = this.map.getLayer("drawtoollayer");
          this.drawendPointNum.push(
            params.geometry.toGeoJSON().geometry.coordinates
          );
          if (this.drawendPointNum.length > 2) return;
          let symbol = {
            textFaceName: "sans-serif",
            textName: "",
            textFill: "#34495e",
            textHorizontalAlignment: "right",
            markerFile:
              this.drawendPointNum.length == 1
                ? this.ponitIcon
                : this.changePonitIcon,
            markerWidth: 30,
            markerHeight: 30,
            markerHorizontalAlignment: "middle",
            markerVerticalAlignment: "middle",
          };
          params.geometry.setSymbol(symbol);
          params.geometry.addTo(drawtoollayer);
          if (this.drawendPointNum.length == 2) {
            // 画线
            var line = new maptalks.LineString(
              [this.drawendPointNum[0], this.drawendPointNum[1]],
              {
                arrowStyle: null, // arrow-style : now we only have classic
                arrowPlacement: "vertex-last", // arrow's placement: vertex-first, vertex-last, vertex-firstlast, point
                visible: true,
                editable: true,
                cursor: null,
                shadowBlur: 0,
                shadowColor: "black",
                symbol: {
                  lineColor: "#1bbc9b",
                  lineWidth: 3,
                },
              }
            );
            new maptalks.VectorLayer("drawendLine", line)
              .addTo(this.map)
              .setZIndex(-1);
            // 还是判断管点和管线
            // this.selectTwoPoint(this.drawendPointNum);
          }
        });
        if (!this.map.getLayer("drawtoollayer")) {
          this.drawtoollayer = new maptalks.VectorLayer("drawtoollayer").addTo(
            this.map
          );
        }
        this.map.drawTool.setMode(type).enable();
      }
    },
    // 判断选中的两个点中的管点和管线
    selectTwoPoint(target) {
      if (!this.map.getLayer("vector1")) return;
      let poly = target;
      this.map.getLayer("vector1").forEach((feature) => {
        let pt = [
          [feature.markerData.lon, feature.markerData.lat],
          [feature.markerData.lon2, feature.markerData.lat2],
        ];
        let bol = booleanContains(poly, pt);
        if (!bol) {
          this.regionLine.push(feature);
          this.tableDataList.push(feature);
          feature.updateSymbol({
            lineColor: this.changeLineColor,
          });
        }
      });
    },
    // 判断选中区域里面的点位
    selectedAreaPoint(range) {
      this.regionPoint = [];
      // 判断是否有该涂层
      if (!this.map.getLayer("vector2")) return;
      let poly = turf.polygon(range);
      this.map.getLayer("vector2").forEach((feature) => {
        let pt = turf.point([feature.markerData.lon, feature.markerData.lat]);
        let bol = turf.booleanPointInPolygon(pt, poly);
        if (bol) {
          this.regionPoint.push(feature);
          feature.updateSymbol({
            markerFile: this.changePonitIcon,
          });
        }
      });
    },
    // 判断选中区域的管线
    selectedAreaLine(range) {
      this.regionLine = [];
      this.tableDataList = [];
      // 判断是否有该涂层
      if (!this.map.getLayer("vector1")) return;
      let poly = turf.polygon(range);
      this.map.getLayer("vector1").forEach((feature) => {
        let pt = turf.lineString([
          [feature.markerData.lon, feature.markerData.lat],
          [feature.markerData.lon2, feature.markerData.lat2],
        ]);
        let bol = turf.booleanContains(poly, pt);
        let bol1 = turf.booleanDisjoint(poly, pt);
        if (bol || !bol1) {
          this.regionLine.push(feature);
          this.tableDataList.push(feature);
          feature.updateSymbol({
            lineColor: this.changeLineColor,
          });
        }
      });
    },
    // 移除所有图层
    onClearAll() {
      this.map.drawTool = null;
      this.tableDataList = [];
      this.clearSelectArea();
      if (this.drawtoollayer) {
        this.drawtoollayer.clear();
      }
      if (this.map.getLayer("drawendLine")) {
        this.map.removeLayer(this.map.getLayer("drawendLine"));
      }
      if (this.connectLine.length != 0) {
        this.recoveryLineColor(this.connectLine);
      }
    },
    // 关闭底部弹框
    onStatisticalResults() {
      this.statisticalResultsShow = false;
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
  padding: 15px 0;
  position: relative;
  .tip-title {
    font-size: 14px;
    color: #1f263e;
    line-height: 22px;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f1f1;
    padding: 0 15px 10px 15px;
    .close {
      cursor: pointer;
    }
  }
  .tip-content-box {
    padding: 10px 15px;
    .tip-content-box-item {
      font-size: 12px;
      color: #1f263e;
      line-height: 22px;
      font-weight: 500;
      display: flex;
      div {
        flex: 1;
      }
      span {
        color: rgba(31, 38, 62, 0.5);
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
<style scoped lang="scss">
::v-deep {
  .el-input-group__append {
    background: #0190e3;
    color: #fff;
  }
}

.special {
  position: relative;
}
#map {
  width: 100%;
  height: calc(100vh - 105px);
}
.globalSearch {
  background-color: #fff;
  height: 75vh;
  position: absolute;
  right: 0;
  top: 60px;
  border-radius: 10px;
  .switchBtn {
    padding: 43px 4px;
    background: #ffffff;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px 0 0 4px;
    position: absolute;
    top: 50%;
    left: 1px;
    transform: translate(-100%, -50%);
    cursor: pointer;
  }
  .content {
    padding: 15px 7px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    width: 30vw;
    box-sizing: border-box;
    transition: 0.3s ease;
    .title {
      font-size: 14px;
      color: #000a12;
      letter-spacing: 0;
      line-height: 22px;
      font-weight: 600;
      padding-left: 12px;
    }
    .search {
      padding-left: 12px;
      margin-top: 10px;
      display: flex;
      margin-bottom: 16px;
    }
  }
  .pagination {
    height: 30px;
    margin-top: 10px;
  }
}
.statistics {
  width: 300px;
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
  padding: 8px;
  font-size: 14px;
  .statistics-top {
    display: flex;
    justify-content: space-between;
    .icon {
      .icon-guanbi {
        font-size: 12px;
        cursor: pointer;
      }
      .icon-chevronsleftshuangzuojiantou {
        cursor: pointer;
      }
    }
  }
  .statistics-item {
    margin-top: 10px;
    display: flex;
    align-items: center;
    .left {
      color: #000a12;
      margin-right: 8px;
      width: 70px;
    }
    .select {
      flex: 1;
    }
    .massif {
      font-size: 12px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      cursor: pointer;
      .massif-item {
        padding: 2px 4px;
        border: 1px solid #0190e3;
        color: #0190e3;
        border-radius: 18px;
        margin-right: 5px;
      }
      .active-massif {
        background-color: #0190e3;
        color: #fff;
      }
    }
  }
  .searchBtn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
