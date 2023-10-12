<template>
  <div class="startTestCom">
    <el-dialog v-model="centerDialogVisible" title="开始检验" width="90%" :close-on-click-modal="false"
      :before-close="onClickClose">
      <div class="content">
        <!-- 步骤条 -->
        <div class="stepBox">
          <el-steps :active="stepNum" align-center>
            <el-step v-for="item in stepsList" :key="item" :title="item.title"></el-step>
          </el-steps>
        </div>
        <!-- 文件上传 -->
        <file-upload v-show="stepNum == 0" @nextStep="changeStepNum"></file-upload>
        <!-- 选择检查项 -->
        <check-items v-show="stepNum == 1" @nextStep="changeStepNum"></check-items>
        <!-- 查看检验结果 -->
        <test-result-com v-show="stepNum == 2" @nextStep="changeStepNum"></test-result-com>
        <!-- 地图展示 -->
        <map-show-com v-if="stepNum == 3" @nextStep="changeStepNum"></map-show-com>
        <!-- 保存记录 -->
        <save-record v-show="stepNum == 4" @nextStep="changeStepNum" @close="onBeforeClose"></save-record>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
import FileUpload from "./fileUpload/fileUpload.vue";
import CheckItems from "./Checkitems/checkitems.vue";
import TestResultCom from "./TestResult/testReaultCom.vue";
import MapShowCom from "./MapShow/mapShowCom.vue";
import SaveRecord from "./SaveRecord/saveRecordCom.vue";
import { ElMessageBox } from "element-ui";
import { mapMutations } from "vuex";
export default {
  components: { FileUpload, CheckItems, TestResultCom, MapShowCom, SaveRecord },
  name: "startTestCom",
  props: {
    centerDialogVisible: {
      type: Boolean,
      required: true,
    },
  },
  data () {
    return {
      activeName: "first",
      stepsList: [
        {
          title: "文件上传",
        },
        {
          title: "选择检验项",
        },
        {
          title: "查看检验结果",
        },
        {
          title: "地图显示",
        },
        {
          title: "保存记录",
        },
      ],
      stepNum: 0, // 步骤条的进度
    };
  },
  created () { },
  methods: {
    ...mapMutations("fileUpload", ["resetState"]),
    // 点击关闭按钮
    onClickClose () {
      ElMessageBox.confirm("关闭弹窗可能会导致数据丢失", "确认关闭？", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.resetState();
          this.$emit("onBeforeClose", false);
        })
        .catch(() => { });
    },
    // 关闭抽屉
    onBeforeClose () {
      this.$emit("onBeforeClose", true);
    },
    // tab切换事件
    handleClick () { },
    // 下一步事件
    changeStepNum (index) {
      this.stepNum = index;
    },
  },
};
</script>
  
<style lang="scss" scoped>
::v-deep {

  .el-tabs__nav-wrap::after {
    display: none;
  }

  .el-dialog {
    margin-top: 40px;
  }
}

.startTestCom {
  .content {
    height: calc(100vh - 170px);
  }

  .stepBox {
    margin-bottom: 10px;
  }
}
</style>