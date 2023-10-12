<template>
  <div class="fileUploadBox">
    <div class="fileUpload">
      <div class="left">
        <h2 style="margin-bottom: 10px" class="theme_text">选择资产类型</h2>
        <div class="projection">
          <div>投影坐标：</div>
          <el-select v-model="projectionValue" class="m-2" placeholder="Select">
            <el-option v-for="item in projectionList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <div>x偏移：</div>
          <el-input style="width: 50px" v-model="distX"></el-input>
          <div>Y偏移：</div>
          <el-input style="width: 50px" v-model="distY"></el-input>
        </div>
        <div style="
            height: calc(100% - 60px);
            width: 100%;
            overflow: auto;
            padding-right: 8px;
            padding-bottom: 10px;
          ">
          <el-table :data="tableData" height="100%" row-key="id" border
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" default-expand-all>
            <el-table-column header-align="center" prop="assetsName" label="资产类型" />
            <el-table-column align="center" prop="" label="操作">
              <template #default="scope">
                <span class="btnStyle" @click.prevent="onFileUpload(scope.row)">
                  添加
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="right">
        <h2 style="margin-bottom: 10px" class="theme_text">已上传的文件</h2>
        <table-one :tableData="uploadedFilesList" :tableConfig="uploadedConfig" :xuHaoShow="true"></table-one>
      </div>
    </div>
    <div class="btn">
      <el-button size="small" @click="nextStep" type="primary">下一步</el-button>
    </div>
    <!-- 详情页面 -->
    <set-detail v-if="setDetailShow" :isUpdate="true" :centerDialogVisible="setDetailShow" :inforData="inforData"
      @closeSetDetail="closeSetDetail"></set-detail>
    <!-- 上传文件弹窗 -->
    <file-upload-dialog v-if="fileUploadDialogShow" :centerDialogVisible="fileUploadDialogShow" :dialogInfor="dialogInfor"
      :title="dialogTitle" :projectionValue="projectionValue" :distX="distX" :distY="distY"
      @fileUploadDialogClose="fileUploadDialogClose"></file-upload-dialog>
  </div>
</template>

<script>
import TableOne from "@/components/Table/table.vue";
import SetDetail from "../setDetail.vue";
import FileUploadDialog from "./fileUploadDialog.vue";
import { mapMutations, mapState } from "vuex";
import { ElMessage } from "element-ui";
import { SqliteCom } from "@/js/sqlite/index.js";

export default {
  name: "fileUpload",
  components: {
    TableOne,
    SetDetail,
    FileUploadDialog,
  },
  computed: {
    ...mapState("fileUpload", ["uploadedFilesList"]),
  },
  watch: {
    uploadedFilesList () {
      this.getPointLineData();
    },
  },
  created () { },
  data () {
    return {
      dialogTitle: "",
      distX: 0,
      distY: 0,
      tableData: [
        {
          id: 2,
          assetsName: "排水管网及附属设施",
          type: "line",
          lineColor: "#ee00ff",
          children: [
            {
              id: 18,
              assetsName: "合流管",
              type: "line",
              lineColor: "#6814fa",
            },
            {
              id: 19,
              assetsName: "检查井",
              type: "point",
              iconText: "H_PG_05",
            },
            {
              id: 20,
              assetsName: "截流井",
              type: "point",
              iconText: "H_PG_06",
            },
            {
              id: 21,
              assetsName: "截污管",
              type: "line",
              lineColor: "#ee00ff",
            },
            {
              id: 22,
              assetsName: "排水口",
              type: "point",
              iconText: "H_PG_08",
            },
            {
              id: 23,
              assetsName: "其他建（构）筑物",
              type: "point",
              iconText: "H_PG_98",
            },
            {
              id: 24,
              assetsName: "污水管",
              type: "line",
              lineColor: "#ff4d4f",
            },
            {
              id: 25,
              assetsName: "雨水管",
              type: "line",
              lineColor: "#3cb700",
            },
            {
              id: 26,
              assetsName: "雨水口",
              type: "point",
              iconText: "H_PG_07",
            },
          ],
        },
        {
          id: 1,
          assetsName: "给水管网及附属设施",
          type: "line",
          lineColor: "#c04ad6",
          children: [
            {
              id: 27,
              assetsName: "阀门井",
              type: "point",
              iconText: "H_GG_11",
            },
            {
              id: 3,
              assetsName: "检修井",
              type: "point",
              iconText: "H_GG_10",
            },
            {
              id: 4,
              assetsName: "绿化水管",
              type: "line",
              lineColor: "#3cb700",
            },
            {
              id: 5,
              assetsName: "排泥湿井",
              type: "point",
              iconText: "H_GG_15",
            },
            {
              id: 6,
              assetsName: "配水管",
              type: "line",
              lineColor: "#a53eff",
            },
            {
              id: 7,
              assetsName: "其他建（构）筑物",
              type: "point",
              iconText: "H_GG_98",
            },
            {
              id: 8,
              assetsName: "生态补水管",
              type: "line",
              lineColor: "#ff8800",
            },
            {
              id: 9,
              assetsName: "输水管",
              type: "line",
              lineColor: "#6814fa",
            },
            {
              id: 10,
              assetsName: "水表井",
              type: "point",
              iconText: "H_GG_13",
            },
            {
              id: 11,
              assetsName: "水源井",
              type: "point",
              iconText: "H_GG_14",
            },
            {
              id: 12,
              assetsName: "消防井",
              type: "point",
              iconText: "H_GG_12",
            },
            {
              id: 13,
              assetsName: "消防水管",
              type: "line",
              lineColor: "#c40000",
            },
            {
              id: 14,
              assetsName: "循环水管",
              type: "line",
              lineColor: "#ee00ff",
            },
            {
              id: 15,
              assetsName: "原水管",
              type: "line",
              lineColor: "#00b9bf",
            },
            {
              id: 16,
              assetsName: "直饮水管",
              type: "line",
              lineColor: "#066fff",
            },
            {
              id: 17,
              assetsName: "中水管",
              type: "line",
              lineColor: "#ff4d4f",
            },
          ],
        },

        {
          id: 28,
          assetsName: "数据关联配置",
          type: "line",
          lineColor: "#ee00ff",
          children: [
            {
              id: 29,
              assetsName: "初始管段",
              type: "line",
              lineColor: "#ff4d4f",
            },
            {
              id: 30,
              assetsName: "初始管点",
              type: "point",
              iconText: "H_PG_07",
            },
          ],
        },
      ],
      uploadedData: [
        {
          id: 1,
        },
      ], // 已上传的数据
      uploadedConfig: [
        {
          type: "text",
          label: "文件",
          prop: "file_name",
          minWidth: "150px",
          align: "center",
        },
        {
          type: "text",
          label: "资产类型",
          prop: "assets_type",
          minWidth: "80px",
          align: "center",
        },
        {
          type: "text",
          label: "文件类型",
          prop: "file_type",
          minWidth: "60px",
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
              name: "详情",
              type: "pre",
              cb: this.onDetail,
            },
            {
              name: "删除",
              type: "error",
              cb: this.onDelete,
            },
          ],
        },
      ],
      setDetailShow: false,
      fileUploadDialogShow: false,
      pointList: [],
      lineList: [],
      dialogInfor: {},
      sqliteCom: null,
      projectionList: [
        {
          label: "4549",
          value: 4549,
        },
        {
          label: "4326",
          value: 4326,
        },
        {
          label: "4490",
          value: 4490,
        },
      ], // 投影坐标列表
      projectionValue: 4490,
    };
  },
  mounted () {
    this.getPointLineData();
    this.getProj();
  },
  methods: {
    ...mapMutations("fileUpload", ["setStateItem"]),
    // 获取管线和管点数据
    getPointLineData () {
      this.pointList = [];
      this.lineList = [];
      this.uploadedFilesList.map((item) => {
        if (item.dataType == "point") {
          this.pointList = [...this.pointList, ...item.fileDataList];
        } else if (item.dataType == "line") {
          this.lineList = [...this.lineList, ...item.fileDataList];
        }
      });
    },
    async getProj () {
      if (!this.sqliteCom) {
        this.sqliteCom = new SqliteCom(window.dbPath);
      }
      //查询配置的投影坐标
      let params = {
        CODE: "投影坐标",
      };
      let res = await this.sqliteCom.getQueryData("tb_dict", params);
      console.log(res);
      if (res && res.length > 0) {
        let projValue = res[0].HTMLVALUE ? res[0].HTMLVALUE : res[0].VALUE;
        if (projValue && projValue.length > 0) {
          let projArr = projValue.split(",");
          this.projectionList = [];
          // [
          //   {
          //     label: "4549",
          //     value: 4549,
          //   },
          //   {
          //     label: "4326",
          //     value: 4326,
          //   },
          //   {
          //     label: "4490",
          //     value: 4490,
          //   },
          // ], // 投影坐标列表

          if (projArr.length > 0) {
            for (let item of projArr) {
              let obj = {};
              obj.label = item;
              obj.value = item;
              this.projectionList.push(obj);
            }
            this.projectionValue = projArr[0];
          }
        }
      }
    },
    // 下一步事件
    nextStep () {
      if (this.uploadedFilesList.length == 0) {
        ElMessage.error("请先上传文件");
        return;
      }
      // 保存管线或管点数据
      this.setStateItem({
        key: "pipePointData",
        value: [
          ...this.pointList.map((item) => {
            return {
              ...item,
              data_type: "point",
            };
          }),
        ],
      });
      this.setStateItem({
        key: "pipeLineData",
        value: [
          ...this.lineList.map((item) => {
            return {
              ...item,
              data_type: "line",
            };
          }),
        ],
      });

      this.$emit("nextStep", 1);
    },
    // 打开上传文件弹窗
    onFileUpload (row) {
      this.dialogTitle = row.assetsName;
      this.dialogInfor = row;
      this.fileUploadDialogShow = true;
    },
    fileUploadDialogClose () {
      this.fileUploadDialogShow = false;
    },
    // 详情页面
    onDetail (row) {
      this.inforData = row;
      this.setDetailShow = true;
    },
    closeSetDetail () {
      this.setDetailShow = false;
    },
    // 删除事件
    onDelete (row, index) {
      let arr = [...this.uploadedFilesList];
      arr.splice(index, 1);
      this.setStateItem({
        key: "uploadedFilesList",
        value: arr,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
h2 {
  margin: 0;
  padding: 0;
  border: 0;
  vertical-align: baseline;
  font-size: 16px;
}

.fileUploadBox {
  height: calc(100% - 110px);

  .btn {
    padding-right: 20px;
    text-align: right;
    margin-top: 20px;
  }
}

.fileUpload {
  display: flex;
  width: 100%;
  height: 100%;

  .left {
    flex: 2;
    overflow: hidden;
    padding-right: 10px;
  }

  .right {
    flex: 4;
    overflow: auto;
    margin-left: 20px;
  }
}

.btnStyle {
  font-size: 12px;
  color: $color_theme;
  line-height: 20px;
  border: 1px solid rgba(1, 144, 227, 0.5);
  padding: 1px 4px;
  border-radius: 2px;
  cursor: pointer;
}

.projection {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  div {
    padding-right: 6px;
    font-weight: bold;
  }
}
</style>
