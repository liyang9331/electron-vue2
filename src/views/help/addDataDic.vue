<template>
  <div class="addDataDic">
    <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="70%" :close-on-click-modal="false"
      :before-close="close">
      <div class="content">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-position="top" class="demo-ruleForm">
          <el-form-item label="编码" prop="CODE">
            <el-input v-model="ruleForm.CODE" placeholder="请输入编码" />
          </el-form-item>
          <el-form-item label="内容类型" prop="TYPE">
            <el-select style="width: 100%" v-model="ruleForm.TYPE" placeholder="请选择内容类型">
              <el-option label="纯文本" :value="1" />
              <el-option label="富文本" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="ruleForm.TYPE == 1" label="内容" prop="VALUE">
            <el-input v-model="ruleForm.VALUE" type="textarea" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item v-if="ruleForm.TYPE == 2" label="内容" prop="HTMLVALUE">
            <rich-text style="width: 100%" :initHtml="initHtml" placeholder="请输入" @change="editorChange"></rich-text>
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
import db from "@/utils/db";
import { guid } from "@/utils/index";
import { ElMessage } from "element-ui";
import { SqliteCom } from "@/js/sqlite/index.js";
import RichText from "@/components/RichText/index.vue";
export default {
  name: "addDataDic",
  components: {
    RichText,
  },
  props: {
    centerDialogVisible: {
      type: Boolean,
      default: false,
    },
    clickType: {
      type: String,
      default: "add",
    },
    editObj: {
      type: Object,
      default: {},
    },
  },
  data () {
    return {
      ruleForm: {
        CODE: "",
        TYPE: 1,
        VALUE: "",
        HTMLVALUE: "",
      },
      rules: {
        CODE: [
          {
            required: true,
            message: "请输入编码",
            trigger: "blur",
          },
        ],
        TYPE: [
          {
            required: true,
            message: "请选择内容类型",
            trigger: "change",
          },
        ],
        VALUE: [
          {
            required: true,
            message: "请输入内容",
            trigger: "blur",
          },
        ],
        HTMLVALUE: [
          {
            required: true,
            message: "请输入内容",
            trigger: "blur",
          },
        ],
      },
      dialogTitle: "",
      surfaceName: "tb_dict",
      initValue: "",
      initHtml: "",
      sqliteCom: null,
    };
  },
  created () {
    this.sqliteCom = new SqliteCom(window.dbPath);
    this.init();
  },
  mounted () { },
  methods: {
    // 富文本
    editorChange (value) {
      this.ruleForm.HTMLVALUE = value;
    },
    init () {
      if (this.clickType == "add") {
        this.dialogTitle = "添加字典";
      } else {
        this.dialogTitle = "修改字典";
        this.ruleForm = this.editObj;
        this.initHtml = this.editObj.HTMLVALUE;
        this.ruleForm.TYPE = Number(this.ruleForm.TYPE);
      }
    },
    // 新增数据
    async getAddData () {
      let params1 = {
        CODE: this.ruleForm.CODE,
      };
      let res = await this.sqliteCom.getQueryData(this.surfaceName, params1);
      if (res.length == 0) {
        let params2 = { ...this.ruleForm, ID: guid() };
        let res1 = await this.sqliteCom.getInsertData(
          this.surfaceName,
          params2
        );
        if (res1) {
          this.$emit("close", "sub");
          ElMessage.success("添加成功");
        } else {
          ElMessage.error("添加失败");
        }
      } else {
        ElMessage.error("字典编码重复");
      }
    },
    // 编辑数据
    async getEditData () {
      let params = {
        CODE: this.ruleForm.CODE,
        VALUE: this.ruleForm.VALUE,
        HTMLVALUE: this.ruleForm.HTMLVALUE,
        TYPE: this.ruleForm.TYPE,
      };
      let res = await this.sqliteCom.getUpdateData(this.surfaceName, params, {
        ID: this.editObj.ID,
      });
      if (res) {
        ElMessage.success("修改成功");
        this.$emit("close", "sub");
      } else {
        ElMessage.error("修改失败");
      }
    },
    // 提交数据
    onSubmit () {
      this.$refs["ruleFormRef"].validate((valid) => {
        if (valid) {
          if (this.ruleForm.TYPE == 1) {
            this.ruleForm.HTMLVALUE = "";
          } else {
            this.ruleForm.VALUE = "";
          }
          if (this.clickType == "add") {
            this.getAddData();
          } else {
            this.getEditData();
          }
        }
      });
    },
    reset () {
      this.ruleForm = {
        CODE: "",
        TYPE: 1,
        VALUE: "",
        HTMLVALUE: "",
      };
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
