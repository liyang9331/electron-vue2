<template>
  <div class="setDetail">
    <el-dialog v-model="centerDialogVisible" :title="dialogTitle" width="60%" :close-on-click-modal="false"
      :before-close="close">
      <div class="content" v-show="clickType == 'look'">
        <div class="info">
          <div>文件类型：{{ inforData.fileType }}</div>
          <div>文件名称：{{ inforData.fileName }}</div>
          <div>资产类型：{{ inforData.assetsType }}</div>
        </div>
        <div class="structure">
          <div class="structure-itme">
            <span>文件结构：</span>
            <el-button v-if="isUpdate" @click="onUpdate">修改</el-button>
          </div>
          <ul>
            <li v-for="(item, index) in fileStructure" :key="index">
              <div class="left">{{ item.key }}</div>
              <div class="right">{{ item.value }}</div>
            </li>
          </ul>
          <p>对应字段：</p>
          <ul>
            <li v-for="(item, index) in fieldList" :key="index">
              <div class="left">{{ item.name }}</div>
              <div class="right">
                {{ inforData.fieldDescription[item.key] }}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="content" v-show="clickType == 'edit'">
        <div class="inputBox">
          <span class="label">表头所在行</span>
          <el-input style="width: 70%" v-model="dataSetObj.headerRowNum" />
        </div>
        <div class="inputBox">
          <span class="label">数据所在行</span>
          <el-input style="width: 70%; margin-right: 10px" v-model="dataSetObj.dataRowNum" />
          <el-button type="primary" @click="onSearchFile">查询</el-button>
        </div>
        <ul class="config">
          <li class="first">
            <div class="li-left bg">字段描述</div>
            <div class="li-right bg">对应字段</div>
          </li>
          <li v-for="item in fieldList" :key="item.name">
            <div class="li-left">{{ item.name }}</div>
            <div class="li-right">
              <el-select v-model="from[item.key]" class="m-2" placeholder="请选择">
                <el-option v-for="item in options" :key="item" :label="item" :value="item" />
              </el-select>
            </div>
          </li>
        </ul>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button v-show="clickType == 'look'" type="primary" @click="close">关闭</el-button>
          <el-button v-show="clickType == 'edit'" @click="onReset">取消</el-button>
          <el-button v-show="clickType == 'edit'" type="primary" @click="onSave">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import TableOne from "@/components/Table/table.vue";
import { ElMessage } from "element-ui";
import { DataInspection } from "@/js/dataInspection/dataInspection.js";
import { mapState } from "vuex";
import { fieldLineList, fieldPointList } from "@/utils/data.js";
export default {
  name: "setDetail",
  components: { TableOne },
  props: {
    centerDialogVisible: {
      type: Boolean,
      required: true,
    },
    isUpdate: {
      type: Boolean,
      default: false,
    },
    inforData: {
      type: Object,
      // required: true
    },
  },
  computed: {
    ...mapState("fileUpload", ["uploadedFilesList"]),
  },
  created () {
    this.fieldList =
      this.inforData.dataType == "point" ? [...fieldPointList] : [...fieldLineList];
  },
  data () {
    return {
      dataInspection: null,
      dialogTitle: "文件设置",
      fileStructure: [
        {
          key: "表头所在行",
          value: 1,
        },
        {
          key: "数据所在行",
          value: 2,
        },
      ],
      clickType: "look",
      dataText: "",
      headerText: "",
      fieldList: [],
      from: {
        xzb: "",
        yzb: "",
        zzxzb: "",
        zzyzb: "",
        gc: "",
        zdmj: "",
        cd: "",
        xh: "",
        zcid: "",
      },
      options: [],
      dataSetObj: {
        headerRowNum: 1,
        dataRowNum: 2,
      },
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      this.options = [...this.inforData.fileHeaderList];
      this.dataInspection = new DataInspection();
    },
    // 查询文件的表头和表数据
    onSearchFile () {
      // this.options = this.dataInspection.getFileData(
      //   this.inforData.fileName
      // ).header;
      // this.setDefault(this.options);
    },
    // 给下拉框设置默认值
    setDefault (arr) {
      arr.forEach((item) => {
        let str = item.toUpperCase();
        if (str.includes("X")) {
          this.from.xzb = item;
        } else if (str.includes("Y")) {
          this.from.yzb = item;
        } else if (str.includes("标识码")) {
          this.from.zcid = item;
        }
      });
    },
    // 判断必填项是否有值
    judgeRequired () {
      let arr = [];
      arr = this.fieldList.filter((item) => {
        return item.required;
      });
      return arr.every((item) => {
        return this.from[item.key];
      });
    },
    //关闭弹窗
    close () {
      this.$emit("closeSetDetail");
    },
    // 修改方法
    onUpdate () {
      this.from = { ...this.inforData.fieldDescription };
      this.clickType = "edit";
      this.dialogTitle = "修改";
    },
    resetInit () {
      this.clickType = "look";
      this.dialogTitle = "文件设置";
    },
    // 取消按钮
    onReset () {
      this.resetInit();
    },
    // 保存事件
    onSave () {
      if (this.judgeRequired()) {
        this.inforData.fieldDescription = this.from;
        this.resetInit();
      } else {
        ElMessage.error("信息缺失");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog__footer {
    text-align: center;
  }
}

.setDetail {
  .content {
    width: 70%;
    margin: 0 auto;

    .info {
      margin-bottom: 30px;

      div {
        margin-bottom: 10px;
      }
    }

    .structure {
      .structure-itme {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
      }

      ul {
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-bottom: none;

        li {
          display: flex;
          text-align: center;
          border: 1px solid #ccc;
          border-bottom: 1px solid #ccc;

          .left {
            flex: 2;
            background: #f1f1f1;
            padding: 10px 20px;
          }

          .right {
            flex: 4;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }

    .inputBox {
      display: flex;
      white-space: nowrap;
      align-items: center;
      margin-bottom: 10px;

      .label {
        padding-right: 10px;
      }
    }

    .config {
      border: 1px solid #eee;

      li {
        display: flex;
        line-height: 40px;
        border-bottom: 1px solid #eee;

        .li-left {
          flex: 2;
          overflow: auto;
          padding-left: 10px;
          border-right: 1px solid #eee;
        }

        .li-right {
          flex: 3;
          overflow: auto;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .first {
        div {
          text-align: center;
        }

        .bg {
          background: #f1f1f1;
        }
      }
    }
  }
}
</style>