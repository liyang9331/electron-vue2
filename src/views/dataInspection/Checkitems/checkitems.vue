<template>
  <div class="checkitems">
    <div class="checkitemsBox">
      <div class="table-item">
        <p class="title">空间要素检验</p>
        <table-one :tableConfig="tableConfig" :tableData="tableData1" :selected="true"
          @handleSelectionChange="handleSelectionChange1"></table-one>
      </div>
      <div class="table-item">
        <p class="title">数据规格检验</p>
        <table-one :tableConfig="tableConfig" :tableData="tableData5" :selected="true"
          @handleSelectionChange="handleSelectionChange5"></table-one>
      </div>
      <div class="table-item">
        <p class="title">管网拓扑检验</p>
        <table-one :tableConfig="tableConfig" :tableData="tableData2" :selected="true"
          @handleSelectionChange="handleSelectionChange2"></table-one>
      </div>
      <div class="table-item">
        <p class="title">管网混接检验</p>
        <table-one :tableConfig="tableConfig" :tableData="tableData3" :selected="true"
          @handleSelectionChange="handleSelectionChange3"></table-one>
      </div>

      <div class="table-item">
        <p class="title">空间数据处理</p>
        <table-one :tableConfig="tableConfig" :tableData="tableData4" :selected="true"
          @handleSelectionChange="handleSelectionChange4"></table-one>
      </div>
    </div>
    <div class="btns">
      <el-button size="small" @click="preStep">上一步</el-button>
      <el-button size="small" type="primary" @click="nextStep">开始扫描</el-button>
    </div>
    <!-- 配置参数弹窗 -->
    <config-params-com v-if="configParamsComShow" :centerDialogVisible="configParamsComShow" :configData="configData"
      @close="configParamsComClose"></config-params-com>
  </div>
</template>

<script>
import TableOne from "@/components/Table/table.vue";
import ConfigParamsCom from "../ConfigParams/configParamsCom.vue";
import {
  kJexamineData,
  gWexamineData,
  gWHJexamineData,
  gKJGXSCData,
  dataSpecificationVerification,
} from "@/utils/data";
import { mapMutations } from "vuex";
import { ElMessage } from "element-ui";
import { SqliteCom } from "@/js/sqlite/index.js";
export default {
  name: "checkitems",
  components: {
    TableOne,
    ConfigParamsCom,
  },
  created () {
    this.sqliteCom = new SqliteCom(window.dbPath);
    this.getConFigData();
  },
  data () {
    return {
      tableConfig: [
        {
          type: "text",
          label: "检验项",
          prop: "testName",
          minWidth: "120px",
          align: "center",
        },
        {
          type: "text",
          label: "检验项说明",
          prop: "testExplain",
          minWidth: "150px",
          tooltip: true,
          align: "center",
        },
        {
          type: "text",
          label: "配置参数",
          prop: "configParams",
          minWidth: "50px",
          align: "center",
        },
        {
          type: "textBtn",
          label: "操作",
          prop: "operation",
          minWidth: "80px",
          align: "center",
          fixed: "right",
          operations: [
            {
              title: "空间长度检验",
              name: "编辑",
              type: "pre",
              cb: this.onConfigParams,
            },
          ],
        },
      ],
      tableData1: [...kJexamineData],
      tableData2: [...gWexamineData],
      tableData3: [...gWHJexamineData],
      tableData4: [...gKJGXSCData],
      tableData5: [...dataSpecificationVerification],
      configParamsComShow: false,
      checkItemList: [], // 需要检查的项
      checkList1: [],
      checkList2: [],
      checkList3: [],
      checkList4: [],
      checkList5: [],
      configData: {},
      sqliteCom: null,
    };
  },
  methods: {
    ...mapMutations("fileUpload", ["setStateItem"]),
    // 获取默认的配置参数
    async getConFigData () {
      let res = await this.sqliteCom.getQueryData("tb_parameter");
      let obj = {};
      for (let i = 0; i < res.length; i++) {
        obj[res[i].CODE] = JSON.parse(res[i]["CONTENT"]);
      }
      this.setStateItem({
        key: "configAccident",
        value: obj,
      });
    },
    // 上一步事件
    preStep () {
      this.$emit("nextStep", 0);
    },
    // 下一步事件
    nextStep () {
      this.checkItemList = [
        ...this.checkList1,
        ...this.checkList2,
        ...this.checkList3,
        ...this.checkList4,
        ...this.checkList5,
      ];
      if (this.checkItemList.length == 0) {
        ElMessage.error("请选择检查项");
        return;
      }

      this.setStateItem({
        key: "checkItemData",
        value: this.checkItemList,
      });
      this.$emit("nextStep", 2);
    },
    // 配置参数
    onConfigParams (row) {
      this.configData = row;
      this.configParamsComShow = true;
    },
    // 关闭弹窗
    configParamsComClose () {
      this.configParamsComShow = false;
    },
    // 复选框选中的值
    handleSelectionChange1 (list) {
      this.checkList1 = [...list];
    },
    handleSelectionChange2 (list) {
      this.checkList2 = [...list];
    },
    handleSelectionChange3 (list) {
      this.checkList3 = [...list];
    },
    handleSelectionChange4 (list) {
      this.checkList4 = [...list];
    },
    handleSelectionChange5 (list) {
      this.checkList5 = [...list];
    },
  },
};
</script>

<style lang="scss" scoped>
.checkitems {
  height: calc(100% - 110px);
  font-size: $font14;

  .checkitemsBox {
    height: 100%;
    overflow: auto;
  }

  .table-item {
    margin-bottom: 20px;

    .title {
      margin-bottom: 10px;
      color: $color_theme;
    }
  }

  .btns {
    text-align: right;
    margin-top: 20px;
  }
}
</style>
