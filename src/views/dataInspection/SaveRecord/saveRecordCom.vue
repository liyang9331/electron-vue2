<template>
  <div class="saveRecordCom">
    <div class="content">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" label-position="top">
        <el-form-item label="是否保存操作记录：" prop="isSave">
          <el-radio-group v-model="ruleForm.isSave" class="ml-4">
            <el-radio :label="1" size="large">保存</el-radio>
            <el-radio :label="2" size="large">不保存</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="ruleForm.isSave == 1" label="操作记录名称：" prop="record_name">
          <el-input v-model="ruleForm.record_name" />
        </el-form-item>
        <el-form-item v-if="ruleForm.isSave == 1" label="备注：" prop="remark">
          <el-input type="textarea" resize="none" v-model="ruleForm.remark" />
        </el-form-item>
      </el-form>
    </div>
    <div class="btns">
      <el-button size="small" @click="preStep">上一步</el-button>
      <el-button size="small" type="primary" @click="onSuccess">完成</el-button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { SqliteCom } from "@/js/sqlite/index.js";
import { ElMessage } from "element-ui";
import { guid, getCurrentTime } from "@/utils/index";
import { startLoading, endLoading } from "@/utils/loading";
import saveRecordWorker from "@/js/check/worker/saveRecord.worker";
export default {
  name: "saveRecordCom",
  components: {
  },
  computed: {
    ...mapState("fileUpload", [
      "uploadedFilesList",
      "checkItemData",
      "configAccident",
      "pipeLineData",
      "pipePointData",
      "testResultInfor",
    ]),
    ...mapState("dataInspection", ["inspectionRecordList"]),
  },
  created () {
    this.sqliteCom = new SqliteCom(window.dbPath);
  },
  data () {
    return {
      ruleForm: {
        isSave: 1,
        record_name: "",
        remark: "",
      },
      rules: {
        record_name: [
          {
            required: true,
            message: "请输入操作记录名称",
            trigger: "blur",
          },
        ],
      },
      surfaceName: "tb_history",
      surfaceNameFile: "tb_file",
      surfaceNameMath: "tb_math",
      surfaceNameResult: "tb_result",
      surfaceNameRawData: "tb_raw_data",
      sqliteCom: null,
      loading: false,
    };
  },
  methods: {
    ...mapMutations("fileUpload", ["resetState"]),
    ...mapMutations("dataInspection", ["setStateItem"]),
    // 上一步事件
    preStep () {
      this.$emit("nextStep", 3);
    },
    // 获取最新的一条数据
    getNewData () {
      return new Promise((resolve, reject) => {
        this.sqliteCom.getQueryData(this.surfaceName, {}, "new").then((res) => {
          if (res.length != 0) {
            let code =
              res[0].CODE.substring(res[0].CODE.length - 3) - 0 + 1 + "";
            while (code.length < 3) {
              //当字符串长度小于设定长度时，在前面加0
              code = "0" + code;
            }
            resolve(code);
          } else {
            resolve("001");
          }
        });
      });
    },
    // 存文件
    getSaveFile (history_id) {
      let arr = this.uploadedFilesList.map((item) => {
        return {
          ID: guid(),
          history_id: history_id,
          file_name: item.file_name,
          file_type: item.file_type,
          file_path: item.file_path,
          data_type: item.data_type,
          assets_type: item.assets_type,
          title_index: item.title_index,
          data_index: item.data_index,
          field_match: JSON.stringify(item.fieldDescription),
        };
      });
      return this.sqliteCom.getInsertDatas(this.surfaceNameFile, arr);
    },
    // 存计算公式
    getSaveMath (history_id) {
      let arr = this.checkItemData.map((item) => {
        return {
          ...item,
          config_value: this.configAccident[item.computationalFunction],
        };
      });
      let params = {
        ID: guid(),
        history_id: history_id,
        con_fig: JSON.stringify(arr),
      };
      return this.sqliteCom.getInsertData(this.surfaceNameMath, params);
    },
    // 存储计算结果
    getSaveResult (history_id) {
      let arr = [];
      for (let key in this.testResultInfor) {
        let obj = {
          ID: guid(),
          history_id: history_id,
          code: key,
          result: JSON.stringify(this.testResultInfor[key]),
        };
        console.log(JSON.stringify(this.testResultInfor[key]),)

        arr.push(obj);
      }
      return this.sqliteCom.getInsertDatas(this.surfaceNameResult, arr);
    },
    // 存储地图上的数据
    getMapData (history_id) {
      debugger
      let arr = [...this.pipeLineData, ...this.pipePointData];
      let list = arr.map((item) => {
        console.log(JSON.stringify(item))
        return {
          ID: guid(),
          history_id: history_id,
          code:
            item.data_type == "point"
              ? item.assetsId
              : item.assetsId + "-" + item.assetsId2,
          data_json: JSON.stringify(item),
          data_type: item.data_type,
        };
      });
      return this.sqliteCom.getInsertDatas(this.surfaceNameRawData, list);
    },
    // 存入历史表
    async getSaveHistory () {
      // loading 开始
      startLoading("body", "数据存储中，请稍后...");
      // let workers = new saveRecordWorker();
      // workers.postMessage({
      //   key: "tempMinValueX",
      //   ruleForm: JSON.stringify(this.ruleForm),
      //   uploadedFilesList: JSON.stringify(this.uploadedFilesList),
      //   checkItemData: JSON.stringify(this.checkItemData),
      //   testResultInfor: JSON.stringify(this.testResultInfor),
      //   pipeLineData: JSON.stringify(this.pipeLineData),
      //   pipePointData: JSON.stringify(this.pipePointData),
      //   dbPath: window.dbPath,
      // }); // 2 给works发送参数
      // workers.onmessage = (event) => {
      //   console.log(event.data);
      //   this.close();
      //   workers.terminate(); // 7 关闭works主线程
      // };
      let res = await this.sqliteCom.getQueryData(this.surfaceName, {
        record_name: this.ruleForm.record_name,
      });
      if (res.length == 0) {
        // 获取最新的一条数据
        let code = await this.getNewData();
        let params = {
          record_name: this.ruleForm.record_name,
          remark: this.ruleForm.remark,
          ID: guid(),
          CODE: `GW${getCurrentTime()}${code}`,
        };
        let res2 = this.sqliteCom.getInsertData(this.surfaceName, params);
        if (res2) {
          Promise.all([
            this.getSaveFile(params.ID),
            this.getSaveMath(params.ID),
            this.getSaveResult(params.ID),
            this.getMapData(params.ID),
          ]).then((res) => {
            if (res.every((item) => item)) {
              this.resetState();
              ElMessage.success("添加成功");
              endLoading();
              this.$emit("close");
            } else {
              ElMessage.error("添加失败");
            }
          });
        }
      } else {
        endLoading();
        ElMessage.error("操作记录名称重复");
      }
    },
    // 完成事件
    onSuccess () {
      if (this.ruleForm.isSave == 1) {
        this.$refs["ruleFormRef"].validate((valid) => {
          if (valid) {
            // 存数据库
            this.getSaveHistory();
          }
        });
      } else {
        this.resetState(); // 清除所有vuex保存的数据
        this.$emit("close");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-textarea__inner {
    min-height: 120px !important;
  }

  .el-form-item__label {
    font-size: 16px;
  }

  .el-form-item__label {
    font-size: $font14;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
  }

  .el-radio__input.is-checked .el-radio__inner {
    border-color: $color_theme;
    background: $color_theme;
  }
}

.saveRecordCom {
  height: calc(100% - 110px);

  .btns {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }

  .content {
    width: 40%;
    height: 100%;
    overflow: auto;
    margin: 0 auto;

    .radio {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .active {
        border: 1px solid #4493e4 !important;
        background-color: #eaeefa !important;
      }

      .myBtn {
        flex: 1;
        line-height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f2f3f2;
        border: 1px solid #f2f3f2;
        margin-right: 20px;
        border-radius: 20px;

        .el-icon {
          margin-right: 6px;
        }

        &:last-child {
          margin-right: 0px;
        }
      }
    }
  }
}
</style>
