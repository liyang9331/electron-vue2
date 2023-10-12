<template>
  <div class="detailCom">
    <el-dialog v-model="centerDialogVisible" title="检验项详情" width="50%" :close-on-click-modal="false"
      :before-close="close">
      <div class="content">
        <div class="infor-item">
          <div class="label">检验项类别：</div>
          <div class="text">{{ testTypeObj[detailInfor.TYPE] }}</div>
        </div>
        <div class="infor-item">
          <div class="label">检验项名称：</div>
          <div class="text">{{ detailInfor.NAME }}</div>
        </div>
        <div class="infor-item">
          <div class="label">检验项说明：</div>
          <div class="text">
            {{ detailInfor.REMARK }}
          </div>
        </div>
        <div class="infor-item">
          <div class="label">检验项参数：</div>
          <div class="text">
            <template v-for="item in JSON.parse(detailInfor.configParamsInfor)">
              <div class="textColor" style="margin-top: 26px">
                {{ item.key }}
              </div>
              <el-input style="width: 100%" v-model="formData[item.value]" placeholder="请输入（修改状态）" />
            </template>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="close">取消</el-button>
          <el-button size="small" type="primary" @click="onSubmit">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
  
<script>
import { SqliteCom } from "@/js/sqlite/index.js";
import { ElMessage } from "element-ui";
import { testTypeObj } from "@/utils/data";
export default {
  components: {},
  name: "detailCom",
  props: {
    centerDialogVisible: {
      type: Boolean,
      default: false,
    },
    detailInfor: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      testTypeObj,
      formData: {
        maxNum: "",
        minNum: "",
      },
      sqliteCom: null,
    };
  },
  created () {
    this.sqliteCom = new SqliteCom(window.dbPath);
    this.init();
  },
  methods: {
    // 初始化参数
    init () {
      this.formData = JSON.parse(this.detailInfor.CONTENT);
    },
    // 修改数据
    async getUpdateData () {
      let str = JSON.stringify(this.formData);
      let res = await this.sqliteCom.getUpdateData(
        "tb_parameter",
        { CONTENT: str },
        { ID: this.detailInfor.ID }
      );
      if (res) {
        ElMessage.success("修改成功");
        this.$emit("onBeforeClose", "sub");
      } else {
        ElMessage.error("修改失败");
      }
    },
    // 提交
    onSubmit () {
      this.getUpdateData();
    },
    // 关闭抽屉
    close () {
      this.$emit("onBeforeClose", "res");
    },
  },
};
</script>
  
<style lang="scss" scoped>
::v-deep {
  .el-dialog {
    margin-top: 20%;
  }
}

.content {
  padding: 0 20px;
}

.infor-item {
  display: flex;
  color: #000;
  margin-bottom: 10px;
  line-height: 1.5;

  .label {
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    white-space: nowrap;
  }

  .text {
    flex: 1;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
  }
}

.textColor {
  font-weight: 400;
  color: $color_theme;
  line-height: 22px;
  margin-bottom: 6px;
}
</style>