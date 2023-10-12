<template>
  <div class="progressBarCom">
    <el-dialog v-model="centerDialogVisible" title="数据检验" width="60%" :close-on-click-modal="false" :before-close="close"
      center>
      <div class="content">
        <div class="left">
          <el-progress type="circle" :percentage="progressBarNum" />
          <p class="text" v-if="progressBarNum == 100">
            <el-icon size="18px" style="vertical-align: middle"><Select /></el-icon>
            已完成
          </p>
        </div>
        <div class="right">
          <div class="test_list" v-for="(item, index) in checkItemData" :key="item.testName">
            <p :class="['text', activeNum >= index ? 'active' : '']">
              <i v-if="activeNum >= index" class="iconfont icon-yiwancheng"></i>
              {{ testTypeObj[item.type] }} - {{ item.testName }}
            </p>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onConfirm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Select } from "@element-ui/icons";
import { mapState, mapMutations } from "vuex";
import { testTypeObj } from "@/utils/data.js";
import {
  PipeLineRepeat,
  PointDuplicate,
  NodeIsolation,
  AbnormalLength,
  MathRelPoint,
  SpatialElements,
  ConnectBoth,
  LineAdverseSlope,
} from "@/js/check/check2";
export default {
  name: "progressBarCom",
  props: {
    centerDialogVisible: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapState("fileUpload", [
      "checkItemData",
      "configAccident",
      "pipeLineData",
      "pipePointData",
    ]),
  },
  watch: {},
  components: {
    Select,
  },
  data () {
    return {
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
      activeNum: null,
      testTypeObj: testTypeObj,
      timer: null,
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    ...mapMutations("fileUpload", ["setStateItem"]),
    onPublic (item) {
      this.from[item.computationalData] = this[item.computationalFunction]();
    },
    cb (index) {
      if (index > this.checkItemData.length - 1) return;
      let item = this.checkItemData[index];
      try {
        this.from[item.computationalData] = this[item.computationalFunction]();
      } catch (error) {
        console.error(error);
      }
      this.timer = setTimeout(() => {
        index++;
        this.onPublic(item);
        this.cb(index);
      }, 100);
      // new Promise((resolve, reject)=> {

      // }).then(data=> {

      // })
      this.activeNum = index;
      this.progressBarNum += parseInt(100 / this.checkItemData.length);
      if (index == this.checkItemData.length - 1) {
        this.progressBarNum = 100;
      }
    },
    init () {
      this.cb(0);
    },
    //管线长度检验
    lengthInspection () {
      this.abnormalLength = new AbnormalLength();
      this.abnormalLength.onShortLine(this.pipeLineData, this.configAccident);
      return this.abnormalLength.sortLineData;
    },
    // 未连接的井点
    notConnectedPoint () {
      this.nodeIsolation = new NodeIsolation();
      this.nodeIsolation.mathPointNotLine(
        this.pipePointData,
        this.pipeLineData
      );
      return this.nodeIsolation.pointNotLine;
    },
    // 多点坐标重合或过近
    coincidence () {
      this.pointDuplicate = new PointDuplicate();
      this.pointDuplicate.nodeDuplicate(this.pipePointData);
      return this.pointDuplicate.nodeDuplicateData;
    },
    // 未连接井的管线
    notConnectedLine () {
      this.nodeIsolation = new NodeIsolation();
      this.nodeIsolation.mathLineNotPoint(
        this.pipePointData,
        this.pipeLineData
      );
      return this.nodeIsolation.lineNotPoint;
    },
    // 管坐标与所连井坐标不一致
    inconsistentCoordinates () {
      this.mathRelPoint = new MathRelPoint();
      this.mathRelPoint.mathRelPoint(this.pipeLineData, this.pipePointData);
      return this.mathRelPoint.marhRelList;
    },
    // 两井之间有多条管
    multipleTubes () {
      this.pipeLineRepeat = new PipeLineRepeat();
      this.pipeLineRepeat.pipelineRepeat(this.pipeLineData);
      return this.pipeLineRepeat.pipelineRepeatData;
    },
    // 空间要素缺失
    spatialPart () {
      this.spatialElements = new SpatialElements();
      this.spatialElements.spatialElements(
        this.pipePointData,
        this.pipeLineData
      );
      return this.spatialElements.spatialElementsData;
    },
    // 井是否同时连接雨水管、污水管
    collision () {
      this.connectBoth = new ConnectBoth();
      this.connectBoth.connectBoth(this.pipePointData);
      return this.connectBoth.connectBothData;
    },
    // 管线逆坡
    pipelineAdverseSlope () {
      this.lineAdverseSlope = new LineAdverseSlope();
      this.lineAdverseSlope.lineAdverseSlope(this.pipeLineData);
      return this.lineAdverseSlope.lineAdverseSlopeData;
    },
    onConfirm () {
      this.setStateItem({
        key: "testResultInfor",
        value: this.from,
      });
      this.close();
    },
    close () {
      this.$emit("close", this.from);
    },
  },
  beforeDestroy () {
    clearTimeout(this.timer);
  },
};
</script>

<style lang="scss" scoped>
.progressBarCom {
  .content {
    padding: 0 30px;
    display: flex;

    .left {
      flex: 2;
      text-align: center;
      margin-right: 10px;

      p {
        margin-top: 10px;
        color: #469957;
      }
    }

    .right {
      flex: 4;

      .test_list {
        margin-bottom: 10px;
        color: #d7d7d7;

        .active {
          color: #000;
        }

        .icon-yiwancheng {
          color: #469957;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
