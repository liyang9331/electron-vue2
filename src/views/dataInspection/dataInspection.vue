<template>
  <div class="dataInspection">
    <div class="content">
      <div class="left_menu">
        <div v-for="item in rightList" :key="item.name" :class="['left-item', activeName == item.name ? 'active' : '']"
          @click="onStartTest(item.name)">
          <div class="img_box">
            <img :src="item.imgUrl" alt="" />
          </div>
          <div class="text">{{ item.name }}</div>
        </div>
      </div>
      <div class="right">
        <div class="table" v-if="!detailShow">
          <!-- <tableOne :tableData="tableData" :tableConfig="tableConfig" :xuHaoShow="true"></tableOne> -->
          <!-- 分页 -->
          <div class="pagination" v-if="total != 0">
            <el-pagination small background layout="total,prev, pager, next" :total="total"
              v-model:currentPage="currentPage" v-model:page-size="pageSize" @current-change="handleCurrentChange" />
          </div>
        </div>
        <!-- 详情弹窗页面 -->
        <Detail v-if="detailShow" :detailInfor="detailInfor" @onBeforeClose="close"></Detail>
      </div>
    </div>

    <!-- 开始检验弹窗 -->
    <start-test-com v-if="startTestComShow" :centerDialogVisible="startTestComShow"
      @onBeforeClose="onBeforeClose"></start-test-com>
  </div>
</template>

<script>
import tableOne from "@/components/Table/table.vue";
import Detail from "./detail.vue";
import StartTestCom from "./startTestCom.vue";
import { mapMutations, mapState } from "vuex";
import { ElMessage, ElMessageBox } from "element-ui";
import { SqliteCom } from "@/js/sqlite/index.js";
export default {
  name: "dataInspection",
  components: {
    tableOne,
    Detail,
    StartTestCom,
  },
  computed: {
    ...mapState("dataInspection", ["inspectionRecordList"]),
  },
  watch: {
    inspectionRecordList () {
      // this.tableData = [...this.inspectionRecordList];
    },
    currentPage () {
      this.tableData = [...this.handTableData()];
    },
  },
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      rightList: [
        {
          name: "检验记录",
          imgUrl: require("@/assets/images/menu/jianyanjilu.png"),
        },
        {
          name: "开始检验",
          imgUrl: require("@/assets/images/menu/kaishijiaoyan.png"),
        },
      ],
      activeName: "",
      detailInfor: "",
      detailShow: false,
      tableData: [],
      tableConfig: [
        {
          type: "text",
          label: "操作编号",
          prop: "CODE",
          minWidth: "150px",
          align: "center",
        },
        {
          type: "text",
          label: "操作记录名称",
          prop: "record_name",
          minWidth: "150px",
          align: "center",
        },
        {
          type: "text",
          label: "提交日期时间",
          prop: "CREATE_TIME",
          minWidth: "150px",
          align: "center",
        },
        {
          type: "text",
          label: "备注",
          prop: "remark",
          minWidth: "150px",
          align: "center",
        },
        {
          type: "textBtn",
          label: "操作",
          prop: "operation",
          minWidth: "150px",
          align: "center",
          fixed: "right",
          operations: [
            {
              name: "详情",
              type: "pre",
              cb: this.detail,
            },
            {
              name: "删除",
              type: "error",
              cb: this.onDelete,
            },
          ],
        },
      ],
      startTestComShow: false,
      total: 0,
      sumList: [],
      sqliteCom: null,
    };
  },
  created () {
    this.sqliteCom = new SqliteCom(window.dbPath);
  },
  mounted () {
    this.getDataList();
  },
  methods: {
    ...mapMutations("dataInspection", ["setStateItem"]),
    // 获取数据
    async getDataList () {
      let res = await this.sqliteCom.getQueryData("tb_history");
      this.total = res.length;
      this.sumList = res;
      this.tableData = this.handTableData();
    },
    // 处理表格数据
    handTableData () {
      let arr = [];
      if (this.sumList.length == 0) return [];
      arr = [...this.sumList.map((item) => item)].slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
      return arr;
    },
    handleCurrentChange (val) {
      this.currentPage = val;
      // this.getDataList();
    },
    // 开始检验
    onStartTest (text) {
      this.activeName = text;
      if (this.activeName == "检验记录") return;
      this.startTestComShow = true;
    },
    // 详情相关事件开始
    // 获取上传的文件
    getFileData (history_id) {
      return this.sqliteCom.getQueryData("tb_file", { history_id });
    },
    // 获取选择项
    getCheckItem (history_id) {
      return this.sqliteCom.getQueryData("tb_math", { history_id });
    },
    // 获取地图数据列表
    getMapData (history_id) {
      debugger
      return this.sqliteCom.getQueryData("tb_raw_data", { history_id });
    },
    // 获取计算结果数据
    getResultData (history_id) {
      return this.sqliteCom.getQueryData("tb_result", { history_id });
    },

    // 详情相关事件结束
    handleData (type, list) {
      let arr = [];
      list.forEach((item) => {
        if (item.data_type == type) {
          arr.push(JSON.parse(item.data_json));
        }
      });
      return arr;
    },
    handChangeData (arr) {
      let obj = {}
      arr.forEach(item => {
        obj[item.code] = JSON.parse(item.result)
      })
      return obj
    },
    // 详情页面
    detail (row) {
      Promise.all([
        this.getFileData(row.ID),
        this.getCheckItem(row.ID),
        this.getMapData(row.ID),
        this.getResultData(row.ID)
      ]).then((result) => {
        debugger
        this.detailInfor = {
          ...row,
          uploadedFilesList: result[0],
          checkItemData: JSON.parse(result[1][0]["con_fig"]),
          pipeLineData: this.handleData("line", result[2]),
          pipePointData: this.handleData("point", result[2]),
          resultData: this.handChangeData(result[3])
        };
        this.detailShow = true;
      });
    },
    close () {
      this.detailShow = false;
    },
    onBeforeClose (value) {
      if (value) {
        this.getDataList();
      }
      this.startTestComShow = false;
    },
    // 删除事件
    onDelete (row) {
      ElMessageBox.confirm("是否删除该条数据?", "Warning", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = { history_id: row.ID };
          let arr = [
            this.sqliteCom.getDeleteData("tb_file", params),
            this.sqliteCom.getDeleteData("tb_math", params),
            this.sqliteCom.getDeleteData("tb_raw_data", params),
            this.sqliteCom.getDeleteData("tb_result", params),
          ];
          // 先删除子表，在删除父表
          Promise.all(arr).then(async (data) => {
            let res = await this.sqliteCom.getDeleteData("tb_history", {
              ID: row.ID,
            });
            if (res) {
              ElMessage.success("删除成功");
              this.getDataList();
            } else {
              ElMessage.error("删除失败");
            }
          });
        })
        .catch(() => { });
    },
  },
};
</script>

<style lang="scss" scoped>
.dataInspection {
  height: 100%;
  width: 100%;
  font-size: 14px;

  .content {
    display: flex;
    height: 100%;

    .right {
      flex: 1;
      padding: 20px;
      overflow: auto;
      margin: 20px;
      background-color: #fff;
    }

    .pagination {
      margin-top: 10px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
