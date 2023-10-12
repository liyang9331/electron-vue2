<template>
  <div class="configParamsCom">
    <el-dialog v-model="centerDialogVisible" title="配置参数" width="50%" :close-on-click-modal="false" :before-close="close"
      center>
      <div class="content">
        <div class="infor-item">
          <div class="label">检验项类别：</div>
          <div class="text">{{ testTypeObj[configData.type] }}</div>
        </div>
        <div class="infor-item">
          <div class="label">检验项名称：</div>
          <div class="text">{{ configData.testName }}</div>
        </div>
        <div class="infor-item">
          <div class="label">检验项说明：</div>
          <div class="text">
            {{ configData.testExplain }}
          </div>
        </div>
        <div class="infor-item">
          <div class="label">检验项参数：</div>
          <div class="text">
            <template v-for="item in configData.configParamsInfor">
              <div class="textColor" style="margin-top: 26px">
                {{ item.key }}
              </div>
              <el-input style="width: 100%" v-model="objData[item.value]" placeholder="请输入（修改状态）" />
            </template>

            <!-- <div class="textColor" style="margin: 10px 0 6px 0">
              管线长度最小值（单位：米）
            </div>
            <el-input
              style="width: 100%"
              v-model="objData.minNum"
              placeholder="请输入（修改状态）"
            /> -->
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button v-if="clickType == 'history'" size="small" @click="close">关闭</el-button>
          <el-button v-if="clickType != 'history'" size="small" @click="close">取消</el-button>
          <el-button v-if="clickType != 'history'" size="small" type="primary" @click="onSave">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { testTypeObj } from "../../../utils/data";
export default {
  name: "configParamsCom",
  props: {
    centerDialogVisible: {
      type: Boolean,
      required: true,
    },
    configData: {
      type: Object,
      required: true,
    },
    clickType: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapState("fileUpload", ["configAccident"]),
  },
  created () {
    if (this.clickType == "history") {
      this.objData = this.configData.config_value;
    } else {
      console.log(this.configData.computationalFunction)
      console.log(JSON.stringify(this.configAccident))

      this.objData = this.configAccident[this.configData.computationalFunction];
    }
  },
  data () {
    return {
      testTypeObj,
      objData: {},
    };
  },
  methods: {
    ...mapMutations("fileUpload", ["setStateItem"]),

    // 保存事件
    onSave () {
      this.setStateItem({
        key: "configAccident",
        value: {
          ...this.configAccident,
          [this.configData.computationalFunction]: this.objData,
        },
      });
      this.close();
    },
    close () {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog {
    margin-top: 14% !important;
  }
}

.content {
  padding: 0 40px;

  .infor-item {
    display: flex;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
    margin-bottom: 10px;

    .label {
      color: rgba(0, 0, 0, 0.85);
      white-space: nowrap;
    }

    .text {
      flex: 1;
    }
  }
}
</style>
