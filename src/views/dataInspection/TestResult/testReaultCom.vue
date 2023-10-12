<template>
  <div class="testReaultCom">
    <div class="testReaultComBox">
      <div class="startBtn">
        <!-- <el-button type="primary" @click="onStartTest">
          <el-icon class="el-icon--right"><CaretRight /></el-icon>
          开始检验
        </el-button> -->
        <!-- 数据校验中的动画效果 -->
        <div class="startTest">
          <div class="circle">
            <div :class="['bigCircle', animateShow ? 'zhuan' : '']"></div>
            <div class="smallCircle"></div>
          </div>

          <div class="right">
            <div class="first">
              <div class="text" v-if="progressBarNum != 100">数据校验中</div>
              <div class="text" v-if="progressBarNum == 100">数据校验完成</div>
              <el-button type="primary" v-if="progressBarNum != 100 && testText.type == undefined"
                @click="onStartTest">开始校验</el-button>
              <el-button type="primary" v-if="progressBarNum != 100 && testText.type != undefined"
                @click="onStartTest">重新校验</el-button>
              <!-- <el-button
                v-if="progressBarNum != 100 && btnType == 1"
                @click="onStop"
                >暂停校验</el-button
              > -->
            </div>
            <div class="second">
              <el-progress :percentage="progressBarNum" />
            </div>
            <div class="three">
              {{ testTypeObj[testText.type] }} - {{ testText.testName }}
            </div>
          </div>
        </div>
      </div>
      <div class="resultBox" v-if="tableResultShow">
        <div class="table-item">
          <p class="title">空间要素检验</p>
          <table-one :tableConfig="tableConfig" :tableData="tableData1" :resultData="from"></table-one>
        </div>
        <div class="table-item">
          <p class="title">数据规格检验</p>
          <table-one :tableConfig="tableConfig" :tableData="tableData5" :resultData="from"></table-one>
        </div>
        <div class="table-item">
          <p class="title">管网拓扑检验</p>
          <table-one :tableConfig="tableConfig" :tableData="tableData2" :resultData="from"></table-one>
        </div>
        <div class="table-item">
          <p class="title">管网混接检验</p>
          <table-one :tableConfig="tableConfig" :tableData="tableData3" :resultData="from"></table-one>
        </div>

        <div class="table-item">
          <p class="title">空间数据处理</p>
          <table-one :tableConfig="tableConfig" :tableData="tableData4" :resultData="from"></table-one>
        </div>
      </div>
    </div>
    <div class="btns">
      <el-button size="small" @click="preStep">上一步</el-button>
      <el-button size="small" type="primary" @click="nextStep">下一步</el-button>
    </div>
  </div>
</template>

<script>
import TableOne from "@/components/Table/table.vue";
import { ElMessage } from "element-ui";
import { mapState, mapMutations } from "vuex";
import { exportExcelFile } from "@/utils/index";
import { IntersectCheck } from "@/js/check/intersectCheck";
import { Relationship } from "@/js/check/Relationship";
import testResultWorker from "@/js/check/worker/testResult.worker";
import { testTypeObj } from "@/utils/data.js";
import { CheckoutDataSpecs } from "@/js/check/check2.js";
export default {
  name: "testReaultCom",
  components: {
  },
  computed: {
    ...mapState("fileUpload", [
      "checkItemData",
      "configAccident",
      "pipeLineData",
      "pipePointData",
      "gxxjList",
    ]),
  },
  created () { },
  data () {
    return {
      tableConfig: [
        {
          type: "text",
          label: "检验项",
          prop: "testName",
          minWidth: "120px",
          align: "center",
          tooltip: true,
        },
        {
          type: "text",
          label: "检验项说明",
          prop: "testExplain",
          minWidth: "150px",
          align: "center",
          tooltip: true,
        },
        {
          type: "text",
          label: "异常数据条数",
          prop: "abnormalDataNum",
          minWidth: "60px",
          align: "center",
          tooltip: true,
        },
        {
          type: "text",
          label: "检测结果",
          prop: "testResult",
          minWidth: "50px",
          align: "center",
          cb: this.onTestResult,
        },
      ],
      tableData1: [],
      tableData2: [],
      tableData3: [],
      tableData4: [],
      tableData5: [],
      progressBarComShow: false,
      pipeLineRepeat: null,
      pointDuplicate: null,
      lineAdverseSlope: null,
      nodeIsolation: null,
      abnormalPipeDiameter: null,
      abnormalLength: null,
      mathRelPoint: null,
      spatialElements: null,
      connectBoth: null,
      from: {},
      progressBarNum: 0,
      testText: {},
      testTypeObj: testTypeObj,
      animateShow: false,
      btnType: 0,
      activeNum: 0,
      tableResultShow: false,
      relationship: null,
    };
  },
  methods: {
    ...mapMutations("fileUpload", ["setStateItem"]),
    onPublic (item) {
      this.from[item.computationalData] = this[item.computationalFunction]();
    },
    cb () {
      return new Promise((resolve, reject) => {
        if (this.activeNum > this.checkItemData.length - 1) {
          this.animateShow = false;
          this.getTableHeaders();
          this.tableResultShow = true;
          return;
        }
        let item = this.checkItemData[this.activeNum];
        try {
          this.testText = item;
          this.onPublic(item);
        } catch (error) {
          console.error(error);
        }
        this.progressBarNum += parseInt(100 / this.checkItemData.length);
        if (this.activeNum == this.checkItemData.length - 1) {
          this.progressBarNum = 100;
        }
        return resolve(true);
      });
    },
    init () {
      if (this.activeNum == 0) {
        this.testText = this.checkItemData[0];
      }
      let workers = new testResultWorker();
      // 测试代码
      // let relationship =new Relationship()
      // relationship.init(this.pipePointData,this.pipeLineData)
      // relationship.checkData()
      // console.log(relationship.generateRelationshipData)
      // 测试代码
      // let checkoutDataSpecs = new CheckoutDataSpecs();
      // checkoutDataSpecs.handleFun(this.pipePointData, this.pipeLineData);
      // console.log(checkoutDataSpecs.checkoutDataSpecsList);
      workers.postMessage({
        key: "tempMinValueX",
        checkItemData: JSON.stringify(this.checkItemData),
        activeNum: this.activeNum,
        progressBarNum: this.progressBarNum,
        pipePointData: JSON.stringify(this.pipePointData),
        pipeLineData: JSON.stringify(this.pipeLineData),
        configAccident: JSON.stringify(this.configAccident),
      }); // 2 给works发送参数
      workers.onmessage = (event) => {
        let { activeNum, item, progressBarNum, value } = event.data;
        this.handAbnormalData(value);
        this.activeNum = activeNum;
        this.progressBarNum = progressBarNum;
        this.from[item.computationalData] = value;
        this.activeNum++;
        if (this.activeNum > this.checkItemData.length - 1) {
          this.animateShow = false;
          this.getTableHeaders();
          this.tableResultShow = true;
          return;
        }
        this.testText = this.checkItemData[this.activeNum];
        this.init();
        workers.terminate(); // 7 关闭works主线程
      };

      // this.cb().then((res) => {
      //   this.timer = setTimeout(() => {
      //     this.activeNum++;
      //     this.init();
      //   }, 500);
      // });
    },
    // 处理异常数据
    handAbnormalData (list) {
      if (!(list instanceof Array) && list.status == "notErr") {
        //不需要进行错误判断只是进行数据的转换 操作
        return;
      }

      if (list.length == 0) return;
      let arrPoint = [...this.pipePointData];
      let arrLine = [...this.pipeLineData];
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (item.data_type == "point") {
          arrPoint.unshift(item);
        } else if (item.data_type == "line") {
          arrLine.unshift(item);
        }
      }
      this.setStateItem({
        key: "pipePointData",
        value: this.dealRdata(arrPoint, "data_location"),
      });
      this.setStateItem({
        key: "pipeLineData",
        value: this.dealRdata(arrLine, "data_location"),
      });
    },
    dealRdata (attchments, keyname) {
      //attchments:数组，键值
      let list = [...attchments];
      let result = [];
      let obj = {};
      for (let i = 0; i < list.length; i++) {
        if (!obj[list[i][keyname]]) {
          result.push(list[i]);
          obj[list[i][keyname]] = true;
        }
      }
      return result;
    },

    resetTable () {
      this.tableData1 = [];
      this.tableData2 = [];
      this.tableData3 = [];
      this.tableData4 = [];
    },
    // 获取表格的表头
    getTableHeaders () {
      this.resetTable();
      this.checkItemData.forEach((item) => {
        if (item.type == 1) {
          this.tableData1.push(item);
        } else if (item.type == 2) {
          this.tableData2.push(item);
        } else if (item.type == 3) {
          this.tableData3.push(item);
        } else if (item.type == 4) {
          this.tableData4.push(item);
        } else if (item.type == 5) {
          this.tableData5.push(item);
        }
      });
    },

    // 上一步事件
    preStep () {
      this.progressBarNum = 0;
      this.activeNum = 0;
      this.$emit("nextStep", 1);
    },
    // 下一步事件
    nextStep () {
      if (this.progressBarNum != 100) {
        ElMessage.error("请先检验数据");
        return;
      }
      this.setStateItem({
        key: "testResultInfor",
        value: this.from,
      });
      this.$emit("nextStep", 3);
    },
    // 检验结果  导出数据
    onTestResult (row) {
      //判断是不是空间数据转换的信息 需要分sheet 数据
      let restData = this.from[row.computationalData];
      if (
        restData &&
        !(restData instanceof Array) &&
        (restData.type == "transform" ||
          restData.type == "generateRelationship")
      ) {
        //转换数据需要分sheet下载
        //管点
        let pointMap = {};
        for (let item of restData.pipePointData) {
          let type = item.data_location.split(".")[0];
          if (pointMap[type]) {
            pointMap[type].push(item);
          } else {
            pointMap[type] = [item];
          }
        }

        //管线
        let lineMap = {};
        for (let item of restData.pipeLineData) {
          let type = item.data_location.split(".")[0];
          if (lineMap[type]) {
            lineMap[type].push(item);
          } else {
            lineMap[type] = [item];
          }
        }

        for (let key in pointMap) {
          exportExcelFile(key, pointMap[key]);
        }

        for (let key in lineMap) {
          exportExcelFile(key, lineMap[key]);
        }

        return;
      }

      if (restData && restData instanceof Array && restData.length != 0) {
        exportExcelFile(row.testName, this.from[row.computationalData]);
      } else {
        ElMessage.error("暂无数据");
      }
    },
    // 开始检验事件
    onStartTest () {
      if (this.progressBarNum == 100) {
        return;
      }
      this.btnType = 1;
      this.progressBarNum = 0;
      this.animateShow = true;
      this.init();
    },
    // 暂停事件
    onStop () {
      this.btnType = 0;
    },
  },
  beforeDestroy () {
    clearTimeout(this.timer);
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-icon--right {
    margin-left: 0px;
    margin-right: 4px;
  }

  .el-progress__text {
    display: none;
  }

  .el-progress-bar__inner {
    background: linear-gradient(90deg, #7af2e4 0%, #0190e3 100%);
  }
}

.testReaultCom {
  height: calc(100% - 110px);

  .testReaultComBox {
    height: 100%;
    overflow: auto;
  }

  .startBtn {
    margin-bottom: 20px;

    .startTest {
      display: flex;

      .circle {
        position: relative;
        width: 142px;
        height: 142px;
      }

      .bigCircle {
        width: 142px;
        height: 142px;
        background: url("../../../assets/images/jiaoduizhuan.png") no-repeat center;
        background-size: 100%;
        position: absolute;
        left: 0;
        top: 0;
      }

      .smallCircle {
        width: 100px;
        height: 100px;
        background: url("../../../assets/images/jiaodui.png") no-repeat center;
        background-size: 100%;
        position: absolute;
        left: 21px;
        top: 21px;
      }
    }

    .right {
      flex: 1;
      margin-left: 20px;
      margin-top: 2%;

      .first {
        display: flex;
        align-items: center;

        .text {
          font-size: 30px;
          font-weight: 400;
          color: #1f263e;
          line-height: 56px;
          margin-right: 20px;
        }
      }

      .second {
        width: 70%;
      }

      .three {
        margin-top: 10px;
        font-weight: 400;
        color: rgba(31, 38, 62, 0.6);
        line-height: 22px;
      }
    }
  }

  .resultBox {
    .table-item {
      margin-bottom: 20px;

      .title {
        margin-bottom: 10px;
      }
    }
  }

  .btns {
    text-align: right;
    margin-top: 20px;
  }

  .zhuan {
    animation: turn 1s linear infinite;
    transform-origin: 50% 50%;
  }

  @keyframes turn {
    100% {
      transform: rotateZ(1turn);
    }
  }
}
</style>
