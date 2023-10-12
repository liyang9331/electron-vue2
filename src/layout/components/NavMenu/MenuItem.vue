<template>
  <div v-if="item && !item.hidden" class="menuitem_box">
    <template v-if="item.url && isExternal(item.url)">
      <a :href="resolvePath(item.path)" target="_blank" rel="noopener">
        <el-menu-item :index="resolvePath(item.path)">
          <i class="el-icon-menu" />
          <template #title>{{ item.meta.title }}</template>
        </el-menu-item>
      </a>
    </template>
    <template v-else>
      <router-link
        style="
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 20px 0 0 0;
        "
        :to="resolvePath(item.path)"
      >
        <el-menu-item :index="resolvePath(item.path)">
          <div class="img_box">
            <img style="width: 38px; height: 38px" :src="item.imgUrl" />
          </div>
          <div class="text">
            {{ item.meta.title }}
          </div>
        </el-menu-item>
      </router-link>
    </template>
  </div>
</template>

<script>
export default {
  name: "MenuItem",
  props: {
    // route object
    item: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: "/",
    },
  },
  data() {
    this.onlyOneChild = null;
    return {};
  },
  mounted() {},
  methods: {
    isExternal(path) {
      return /^(https?:|mailto:|tel:)/.test(path);
    },
    resolvePath(routePath) {
      if (this.isExternal(routePath)) {
        console.log("routePath", routePath);
        return routePath;
      }
      if (this.isExternal(this.basePath)) {
        console.log("routePath", routePath);
        return this.basePath;
      }
      console.log("routePath", this.basePath + routePath);
      return this.basePath + routePath;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-menu-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  .is-active {
    .img_box {
      background: rgba(149, 224, 255, 0.1);
      border-radius: 40px;
    }
    .text {
      color: #0190E3;
    }
  }
  .el-menu-item:hover {
    background-color: transparent;
}
}
.img_box {
  width: 72px;
  height: 72px;
  text-align: center;
}
.text {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #000a12;
  line-height: 22px;
}
</style>
