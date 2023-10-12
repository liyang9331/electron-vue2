<template>
  <div class="dataDictionary">
    <el-button style="margin-bottom: 10px" type="primary" @click="onAdd">添加编码</el-button>
    <!-- <el-button style="margin-bottom: 10px" type="primary" @click="onUploadFile"
      >上传文件表头</el-button
    > -->
    <tableOne :tableData="tableData" :tableConfig="tableConfig"></tableOne>
    <!-- 添加弹窗 -->
    <add-data-dic v-if="addDataDicShow" :centerDialogVisible="addDataDicShow" :clickType="clickType" :editObj="editObj"
      @close="addDataDicClose"></add-data-dic>
    <!-- 上传文件表头弹窗 -->
    <add-file-header :centerDialogVisible="addFileHeaderShow" @close="addFileHeaderClose"></add-file-header>
  </div>
</template>

<script>
import tableOne from "../../components/Table/table.vue";
import addDataDic from "./addDataDic.vue";
import { ElMessage, ElMessageBox } from "element-ui";
import { SqliteCom } from "@/js/sqlite/index.js";
import AddFileHeader from "./addFileHeader.vue";
export default {
  components: { addDataDic, tableOne, AddFileHeader },
  name: "dataDictionary",
  data () {
    return {
      tableData: [],
      tableConfig: [
        {
          type: "text",
          label: "编码",
          prop: "CODE",
          minWidth: "150px",
          align: "center",
        },
        {
          type: "text",
          label: "字典值",
          prop: "dicValue",
          minWidth: "150px",
          align: "center",
          tooltip: true,
        },
        {
          type: "text",
          label: "字典值类型",
          prop: "TYPE",
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
              name: "编辑",
              type: "pre",
              cb: this.onEdit,
            },
            {
              name: "删除",
              type: "error",
              cb: this.onDelete,
            },
          ],
        },
      ],
      addDataDicShow: false,
      clickType: "",
      editObj: {},
      sqliteCom: null,
      surfaceName: "tb_dict",
      addFileHeaderShow: false
    };
  },
  created () {
    // db.init(window.dbPath);
    this.sqliteCom = new SqliteCom(window.dbPath);
  },
  mounted () {
    this.getList();
  },
  methods: {
    // 获取数据
    async getList () {
      let res = await this.sqliteCom.getQueryData(this.surfaceName);
      this.tableData = res;
    },
    // 新增
    onAdd () {
      this.clickType = "add";
      this.addDataDicShow = true;
    },
    // 上传文件表头
    onUploadFile () {
      this.addFileHeaderShow = true
    },
    addFileHeaderClose (data) {
      this.addFileHeaderShow = false
    },
    // 编辑
    onEdit (row) {
      this.editObj = row;
      this.clickType = "edit";
      this.addDataDicShow = true;
    },
    addDataDicClose (type) {
      if (type == "sub") {
        this.getList();
      }
      this.addDataDicShow = false;
    },
    // 删除
    onDelete (row) {
      ElMessageBox.confirm("是否删除该条数据?", "Warning", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.sqliteCom.getDeleteData(this.surfaceName, {
            ID: row.ID,
          });
          if (res) {
            this.getList();
            ElMessage.success("删除成功");
          } else {
            ElMessage.success("删除失败");
          }
        })
        .catch(() => { });
    },
  },
};
</script>

<style lang="scss" scoped></style>