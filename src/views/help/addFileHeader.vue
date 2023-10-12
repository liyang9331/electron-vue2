<template>
  <div class="addDataDic">
    <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="70%" :close-on-click-modal="false"
      :before-close="close">
      <div class="content">
        <el-upload class="upload-demo" :http-request="handleUploadForm" action="" :show-file-list="false">
          <img style="width: 85px; height: 80px; margin-bottom: 40px" src="@/assets/images/shanchuan.png" alt="" />
          <span class="upload_text" @click="onUpload">点击上传</span>
        </el-upload>
        <el-form ref="ruleFormRef" :model="ruleForm" label-position="top" class="demo-ruleForm">
          <el-form-item v-for="item in list" :label="item.key" :prop="item.key" :key="item.key">
            <el-input v-model="ruleForm[item.key]" :placeholder="item.key" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="close">取消</el-button>
          <el-button size="small" type="primary" @click="onSubmit">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
  
<script>
import { guid } from "@/utils/index";
import { ElMessage } from "element-ui";
import { SqliteCom } from "@/js/sqlite/index.js";
import { DataInspection } from "@/js/dataInspection/dataInspection.js";
import pinyin from "js-pinyin";
export default {
  name: "addDataDic",
  components: {},
  props: {
    centerDialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      ruleForm: {},
      dialogTitle: "",
      surfaceName: "tb_dict",
      initValue: "",
      initHtml: "",
      sqliteCom: null,
      dataInspection: null,
      list: [],
    };
  },
  created () {
    this.sqliteCom = new SqliteCom(window.dbPath);
  },
  mounted () {
    pinyin.setOptions({ checkPolyphone: false, charCase: 0 });
    this.dataInspection = new DataInspection();
  },
  methods: {
    handleUploadForm (data) {
      this.ruleForm = {};
      ElMessage.success("文件导入成功");
      let list = this.dataInspection.getFileData(data.file.path, 1, 2).header;
      list.splice(
        list.findIndex((item) => item.toLocaleUpperCase() == "ID"),
        1
      );
      list.forEach((item) => {
        this.list.push({
          key: item,
          value: pinyin.getCamelChars(item),
        });
        this.ruleForm[item] = item;
      });
    },
    // 提交数据
    onSubmit () {
      let arr = [];
      for (let item in this.ruleForm) {
        arr.push({
          name: item,
          key: this.ruleForm[item],
          required: true,
        });
      }
    },
    // 重置参数
    close () {
      this.$emit("close", "res");
    },
  },
};
</script>
  
<style lang="scss" scoped>
::v-deep {
  .el-dialog {
    margin-top: 8%;
  }

  .el-dialog__body {
    max-height: 500px;
    overflow: auto;
  }
}

.content {
  padding: 0 40px;
}
</style>