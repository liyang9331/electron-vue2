<template>
  <div class="mapShowCom">
    <map-com class="mapBox"></map-com>
    <div class="btns">
      <el-button size="small" @click="preStep">上一步</el-button>
      <el-button size="small" type="primary" @click="nextStep"
        >下一步</el-button
      >
    </div>
  </div>
</template>

<script>
import MapCom from "../map.vue";
export default {
  name: "mapShowCom",
  components: {
    MapCom,
  },
  methods: {
    // 上一步事件
    preStep() {
      this.$emit("nextStep", 2);
    },
    // 下一步事件
    nextStep() {
      this.$emit("nextStep", 4);
    },
  },
};
</script>

<style lang="scss" scoped>
.mapShowCom {
  height: calc(100% - 110px);
  .mapBox {
    height: 100%;
    overflow: auto;
  }
  .btns {
    margin-top: 20px;
    text-align: right;
  }
}
</style>