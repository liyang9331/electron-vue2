<template>
  <div class="setDetail">
    <el-dialog
      v-model="centerDialogVisible"
      :title="dialogTitle"
      width="60%"
      :close-on-click-modal="false"
      :before-close="close"
    >
      <div class="content">
        <div class="info">
          <div>文件类型：{{ inforData.file_type }}</div>
          <div>文件名称：{{ inforData.file_name }}</div>
          <div>资产类型：{{ inforData.assets_type }}</div>
        </div>
        <div class="structure">
          <ul>
            <li v-for="(item, index) in fileStructure" :key="index">
              <div class="left">{{ item.key }}</div>
              <div class="right">{{ inforData[item.value] }}</div>
            </li>
          </ul>
          <p>对应字段：</p>
          <ul>
            <li v-for="(item, index) in fieldList" :key="index">
              <div class="left">{{ item.name }}</div>
              <div class="right">
                {{ JSON.parse(inforData.field_match)[item.key] }}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="close">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import TableOne from "@/components/Table/table.vue";
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
    inforData: {
      type: Object,
      // required: true
    },
  },
  computed: {
    ...mapState("fileUpload", ["uploadedFilesList"]),
  },
  created() {
    this.fieldList =
      this.inforData.data_type == "point"
        ? [...fieldPointList]
        : [...fieldLineList];
  },
  data() {
    return {
      dialogTitle: "文件详情",
      fileStructure: [
        {
          key: "表头所在行",
          value: "title_index",
        },
        {
          key: "数据所在行",
          value: "data_index",
        },
      ],
      fieldList: [],
    };
  },
  mounted() {},
  methods: {
    //关闭弹窗
    close() {
      this.$emit("closeSetDetail");
    },
    resetInit() {},
    // 取消按钮
    onReset() {
      this.resetInit();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog__footer {
    text-align: center;
  }
  .el-dialog__body {
    max-height: calc(100vh - 280px);
    overflow: auto;
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
          border-bottom: 1px solid #ccc;
          .left {
            flex: 2;
            padding: 10px 20px;
            background: #f1f1f1;
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
  }
}
</style>