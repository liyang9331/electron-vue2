<template>
  <div class="statisticalResults">
    <div class="container">
      <div class="left">
        <div class="title">统计结果（所有管线）</div>
        <div class="echartsBox" id="echartsBox"></div>
      </div>
      <div class="right">
        <div class="top">
          <!-- 分页 -->
          <el-pagination
            small
            layout="total,prev, pager, next"
            :total="tableDataList.length"
            v-model:currentPage="currentPage"
            v-model:page-size="pageSize"
            :pager-count="4"
            @current-change="handleCurrentChange"
          />
          <el-button type="primary" size="small">分布</el-button>
          <el-button type="primary" size="small">导出</el-button>
          <i style="margin: 0 10px 0 10px" class="iconfont icon-henggang"></i>
          <i class="iconfont icon-guanbi" @click="onStatisticalResults"></i>
        </div>
        <div class="table">
          <el-table
            :data="tableData"
            height="160px"
            style="width: 100%"
            @row-click="rowClick"
          >
            <el-table-column
              v-for="item in tableConfig"
              :type="item.type"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
              :min-width="item.width"
              :fixed="item.fixed"
            />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
    
    <script>
export default {
  name: "statisticalResults",
  props: {
    tableDataList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    tableDataList() {
      this.tableData = [...this.handTableData()];
      this.handEchartsData();
      this.clear()
    },
    currentPage() {
      this.tableData = [...this.handTableData()];
    },
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      tableConfig: [
        {
          label: "起始节点标识码",
          prop: "起始节点标识码",
          width: 100,
        },
        {
          label: "终止节点标识码",
          prop: "终止节点标识码",
          width: 100,
        },
        {
          label: "管渠长度 （m）",
          prop: "管渠长度 （m）",
          width: 140,
        },
        {
          label: "管渠起点埋深（m）",
          prop: "管渠起点埋深（m）",
          width: 140,
        },
        {
          label: "管底起点标高 （m）",
          prop: "管底起点标高 （m）",
          width: 140,
        },
        {
          label: "管渠终点埋深（m）",
          prop: "管渠终点埋深（m）",
          width: 140,
        },
        {
          label: "管底终点标高 （m）",
          prop: "管底终点标高 （m）",
          width: 140,
        },
        {
          label: "管径（mm）",
          prop: "管径（mm）",
          width: 100,
        },
        {
          label: "所处位置",
          prop: "所处位置",
          width: 100,
        },
      ],
      tableData: [],
      xAxisData: [], // legend的值
      seriesData1: [],
      seriesData2: [],
    };
  },
  mounted() {
    this.handEchartsData();
  },
  methods: {
    clear () {
      this.xAxisData = []
      this.seriesData1 = []
      this.seriesData2 = []
    },
    // 处理表格数据
    handTableData() {
      let arr = [];
      if (this.tableDataList.length == 0) return [];
      arr = [...this.tableDataList.map((item) => item.markerData)].slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
      return arr;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    // 点击表格的某一行事件
    rowClick(row) {
      this.$emit("showSelectLine", row);
    },
    // 处理图表数据
    handEchartsData() {
      if (this.tableData.length == 0) return;
      this.tableData.forEach((item) => {
        this.xAxisData.push(item["起始节点标识码"]);
        this.xAxisData.push(item["终止节点标识码"]);
        this.seriesData1.push(item["管渠起点埋深（m）"]);
        this.seriesData1.push(item["管底起点标高 （m）"]);
        this.seriesData2.push(item["管渠终点埋深（m）"]);
        this.seriesData2.push(item["管底终点标高 （m）"]);
      });
      this.initEcharts();
    },
    // 构建图表
    initEcharts() {
      var chartDom = document.getElementById("echartsBox");
      this.$echarts.init(chartDom).dispose(); // 销毁实例
      var myChart = this.$echarts.init(chartDom);
      let option = {
        title: {
          text: "统计专题图-所有管线",
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xAxisData,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "Email",
            type: "line",
            data: this.seriesData1,
          },
          {
            name: "Union Ads",
            type: "line",
            data: this.seriesData2,
          },
        ],
      };

      option && myChart.setOption(option);
    },
    // 关闭弹框
    onStatisticalResults() {
      this.$parent.onStatisticalResults();
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep {
  .el-table {
    th {
      .cell {
        white-space: nowrap !important;
        text-overflow: ellipsis;
        word-break: break-all;
      }
    }
  }
}
.statisticalResults {
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: #fff;
  height: 200px;
  width: 100%;
  z-index: 11;
  font-size: 14px;
  overflow: hidden;
  .container {
    display: flex;
    width: 100%;
    overflow: hidden;
    .left {
      width: 300px;
      .title {
        padding-left: 10px;
        padding-top: 6px;
      }
      .echartsBox {
        width: 100%;
        height: 165px;
      }
    }
    .right {
      flex: 1;
      padding-right: 10px;
      overflow: auto;
      .top {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
      .table {
        width: 100%;
      }
    }
  }
}
</style>