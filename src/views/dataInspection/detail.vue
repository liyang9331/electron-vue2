<template>
  <div class="detail">
    <div class="content">
      <div class="breadcrumb">
        <!-- <el-breadcrumb separator="/">
          <el-breadcrumb-item>数据校验</el-breadcrumb-item>
          <el-breadcrumb-item style="color: rgba(0,0,0,0.65);">校验详情</el-breadcrumb-item>
        </el-breadcrumb> -->
        <span
          style="color: rgba(0, 0, 0, 0.45); cursor: pointer"
          @click="onGoBack"
          >数据校验</span
        >
        <span style="padding: 0 6px">/</span>
        <span style="color: rgba(0, 0, 0, 0.65)">校验详情</span>
      </div>
      <div class="first">
        <div>操作记录编号：<span>{{detailInfor.CODE}}</span></div>
        <div>
          操作记录名称：<span>{{ detailInfor.record_name }}</span>
        </div>
        <div>操作时间：<span>{{detailInfor.CREATE_TIME}}</span></div>
      </div>
      <div class="second">
        备注：<span>{{ detailInfor.remark }}</span>
      </div>
    </div>
    <div class="menu">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="检测信息" name="first">
          <check-information v-if="activeName == 'first'" :checkInfor="detailInfor"></check-information>
        </el-tab-pane>
        <el-tab-pane label="地图展示" name="second">
          <my-map
            v-if="activeName == 'second'"
            source="history"
            :mapData="detailInfor"
          ></my-map>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import checkInformation from "./checkInformation.vue";
import MyMap from "./map.vue";
export default {
  components: { checkInformation, MyMap },
  name: "detail",
  props: {
    detailInfor: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      activeName: "first",
    };
  },
  created() {},
  methods: {
    // 返回
    onGoBack() {
      this.$emit("onBeforeClose");
    },
    // tab切换事件
    handleClick(name) {
      this.activeName = name.props.name;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-tabs__nav-wrap::after {
    display: none;
  }
}
.content {
  .breadcrumb {
    margin-bottom: 20px;
    span {
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
    }
  }
  .first {
    display: flex;
    div {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
      margin-right: 40px;
      &:first-child {
        span {
          color: $color_theme;
        }
      }
      span {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
      }
    }
  }
  div {
    margin-bottom: 10px;
  }
}
</style>