<template>
  <div class="checkInformation">
    <div class="table-item">
      <div class="title">
        <p>已上传的文件</p>
      </div>
      <TableOne :tableData="checkInfor.uploadedFilesList" :tableConfig="tableConfig"></TableOne>
    </div>
    <div class="table-item">
      <div class="title">
        <p>空间要素检验结果</p>
      </div>
      <TableOne :tableData="kongJianResult" :tableConfig="tableConfigResult" :resultData="checkInfor.resultData">
      </TableOne>
    </div>
    <div class="table-item">
      <div class="title">
        <p>管网拓扑检验结果</p>
      </div>
      <TableOne :tableData="tuoPuResult" :tableConfig="tableConfigResult" :resultData="checkInfor.resultData"></TableOne>
    </div>
    <div class="table-item">
      <div class="title">
        <p>管网混接检验结果</p>
      </div>
      <TableOne :tableData="hunJieResult" :tableConfig="tableConfigResult" :resultData="checkInfor.resultData"></TableOne>
    </div>
    <!-- 设置详情页面 -->
    <set-detail v-if="setDetailShow" :centerDialogVisible="setDetailShow" :inforData="fileInforData"
      @closeSetDetail="closeSetDetail"></set-detail>
    <!-- 配置参数弹窗 -->
    <config-params-com v-if="paramsConfigShow" :centerDialogVisible="paramsConfigShow" :configData="paramsConfigInforData"
      clickType="history" @close="closeParamsConfig"></config-params-com>
  </div>
</template>

<script>
import { exportExcelFile } from "@/utils/index";
import TableOne from "@/components/Table/table.vue";
import SetDetail from "./setDetailHistory.vue";
import ConfigParamsCom from "./ConfigParams/configParamsCom.vue";
import { SqliteCom } from "@/js/sqlite/index.js";
import { ElMessage } from "element-ui";
export default {
  name: "checkInformation",
  components: {
    TableOne,
    SetDetail,
    ConfigParamsCom,
  },
  props: {
    checkInfor: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      paramsConfigInforData: "",
      fileInforData: "",
      tableData: [],
      tableConfig: [
        {
          type: "text",
          label: "文件名",
          prop: "file_name",
          minWidth: "150px",
          align: "center",
        },
        {
          type: "text",
          label: "文件类型",
          prop: "file_type",
          minWidth: "150px",
          align: "center",
        },
        {
          type: "text",
          label: "资产类型",
          prop: "assets_type",
          minWidth: "150px",
          align: "center",
        },
        {
          type: "textBtn",
          label: "操作",
          prop: "operation",
          minWidth: "100px",
          align: "center",
          fixed: "right",
          operations: [
            {
              name: "查看详情",
              type: "pre",
              cb: this.onSetDetail,
            }
            // {
            //   name: "下载",
            //   type: "pre",
            //   cb: this.onDownload,
            // },
          ],
        },
      ],
      tableConfigResult: [
        {
          type: "text",
          label: "检验项",
          prop: "testName",
          minWidth: "150px",
          align: "center",
        },
        {
          type: "text",
          label: "检验项说明",
          prop: "testExplain",
          minWidth: "150px",
          align: "center",
        },
        {
          type: "text",
          label: "配置参数",
          prop: "configParams1",
          minWidth: "150px",
          align: "center",
          cb: this.onConfigParams,
        },
        {
          type: "text",
          label: "异常数据条数",
          prop: "abnormalDataNum",
          minWidth: "80px",
          align: "center",
        },
        {
          type: "textBtn",
          label: "检测结果",
          prop: "operation",
          minWidth: "100px",
          align: "center",
          fixed: "right",
          operations: [
            {
              name: "下载",
              type: "pre",
              cb: this.onDownload,
            },
          ],
        },
      ],
      kongJianResult: [], // 空间要素检验结果
      tuoPuResult: [], // 管网拓扑检验结果
      hunJieResult: [], // 管网混接检验结果
      setDetailShow: false,
      paramsConfigShow: false,
      sqliteCom: null,
    };
  },
  created () {
    this.sqliteCom = new SqliteCom(window.dbPath);
    this.getTableHeaders();
  },
  methods: {
    resetTable () {
      this.kongJianResult = [];
      this.tuoPuResult = [];
      this.hunJieResult = [];
    },
    // 获取表格的表头
    getTableHeaders () {
      this.resetTable();
      this.checkInfor.checkItemData.forEach((item) => {
        if (item.type == 1) {
          this.kongJianResult.push(item);
        } else if (item.type == 2) {
          this.tuoPuResult.push(item);
        } else if (item.type == 3) {
          this.hunJieResult.push(item);
        }
      });
    },
    // 设置详情
    onSetDetail (row) {
      this.fileInforData = row;
      this.setDetailShow = true;
    },
    closeSetDetail () {
      this.setDetailShow = false;
    },
    // 数据库获取数据
    getResultData (history_id, code) {
      let params = {
        history_id,
        code,
      };
      return this.sqliteCom.getQueryData("tb_result", params);
    },
    // 下载
    async onDownload (row) {
      let data = await this.getResultData(
        this.checkInfor.ID,
        row.computationalData
      );
      let arr = JSON.parse(data[0].result);
      if (arr.length != 0) {
        exportExcelFile(row.testName, arr);
      } else {
        ElMessage.error("暂无数据");
      }
    },
    // 配置参数
    onConfigParams (row) {
      this.paramsConfigInforData = row;
      this.paramsConfigShow = true;
    },
    closeParamsConfig () {
      this.paramsConfigShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  padding: 0;
  margin: 0;
}

.checkInformation {
  .table-item {
    margin-bottom: 20px;

    .title {
      color: $color_theme;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      span {
        color: blue;
      }
    }
  }
}
</style>
