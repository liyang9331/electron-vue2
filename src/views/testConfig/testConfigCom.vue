<template>
  <div class="dataInspection">
    <div class="content">
      <div class="left_menu">
        <div
          v-for="item in rightList"
          :key="item.name"
          :class="['left-item', activeName == item.name ? 'active' : '']"
          @click="onStartTest(item.name)"
        >
          <div class="img_box">
            <img :src="item.imgUrl" alt="" />
          </div>
          <div class="text">{{ item.name }}</div>
        </div>
      </div>
      <div class="right">
        <div class="table">
          <p class="text">空间要素检验</p>
          <tableOne
            :tableData="tableData"
            :tableConfig="tableConfig"
          ></tableOne>
        </div>
      </div>
    </div>
    <!-- 详情 -->
    <detail-com
      v-if="detailShow"
      :centerDialogVisible="detailShow"
      :detailInfor="detailInfor"
      @onBeforeClose="onBeforeClose"
    ></detail-com>
  </div>
</template>
  
  <script>
import tableOne from "@/components/Table/table.vue";
import DetailCom from "./detailCom.vue";
import { SqliteCom } from "@/js/sqlite/index.js";
export default {
  name: "dataInspection",
  components: {
    tableOne,
    DetailCom,
  },
  data() {
    return {
      rightList: [
        {
          name: "检验项配置",
          imgUrl: require("@/assets/images/menu/jianchaxiangpeizhi.png"),
        },
      ],
      activeName: "检验项配置",
      detailShow: false,
      showType: null,
      tableData: [],
      tableConfig: [
        {
          type: "text",
          label: "检验项",
          prop: "NAME",
          minWidth: "150px",
          align: "center",
        },
        {
          type: "text",
          label: "检验项说明",
          prop: "REMARK",
          minWidth: "150px",
          align: "center",
        },
        {
          type: "text",
          label: "配置参数",
          prop: "configParam",
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
              name: "详情",
              type: "pre",
              cb: this.onDetail,
            },
          ],
        },
      ],
      startTestComShow: false,
      detailInfor: null,
      sqliteCom: null,
    };
  },
  created() {
    this.sqliteCom = new SqliteCom(window.dbPath);
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    // 获取表格数据
    async getDataList() {
      let res = await this.sqliteCom.getQueryData("tb_parameter");
      this.tableData = res;
    },
    onStartTest(text) {
      this.activeName = text;
    },
    onBeforeClose(type) {
      if (type == "sub") {
        this.getDataList();
      }
      this.detailShow = false;
    },
    // 详情事件
    onDetail(row) {
      this.detailInfor = row;
      this.detailShow = true;
    },
  },
};
</script>
  
  <style lang="scss" scoped>
h2 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}
.text {
  margin-bottom: 10px;
}
.dataInspection {
  height: 100%;
  width: 100%;
  font-size: 14px;
  .content {
    display: flex;
    height: 100%;
    .right {
      flex: 1;
      overflow: auto;
      background-color: #fff;
      padding: 20px;
      margin: 20px;
      .table {
        .text {
          margin-bottom: 10px;
          color: $color_theme;
        }
      }
    }
  }
}
</style>