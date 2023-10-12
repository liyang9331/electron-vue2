<template>
  <div class="header">
    <div class="content">
      <div class="logo">
        <!-- <img src="@/assets/images/index_logo.png" alt="" /> -->
      </div>
      <div
        :class="['header-item', activeNum == index ? 'active' : '']"
        v-for="(item, index) in permission_routes"
        :key="index"
        @click="onChange(item, index)"
      >
        <router-link :to="resolvePath(item.path)">
          <div class="img">
            <img :src="item.imgUrl" />
          </div>
          <div class="text">
            {{ item.name }}
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
  <script>
import { constantRoutes } from "@/router";
export default {
  name: "Header",
  data() {
    return {
      permission_routes: [],
      basePath: "/",
      secondaryMenu: [],
      activeNum: 0,
    };
  },
  computed: {},
  created() {
    this.permission_routes = constantRoutes.filter((item) => {
      if (!item.parent) {
        return item;
      }
    });
    this.secondaryMenu = constantRoutes.filter((item) => {
      if (item.parent == constantRoutes[0].name) {
        return item;
      }
    });
    this.$emit("secondMenu", this.secondaryMenu);
  },
  methods: {
    onChange(data, index) {
      this.activeNum = index;
      this.secondaryMenu = constantRoutes.filter((item) => {
        if (item.parent == data.name) {
          return item;
        }
      });

      this.$emit("secondMenu", this.secondaryMenu);
    },
    isExternal(path) {
      return /^(https?:|mailto:|tel:)/.test(path);
    },
    resolvePath(routePath) {
      console.log(routePath);
      if (this.isExternal(routePath)) {
        return routePath;
      }
      if (this.isExternal(this.basePath)) {
        return this.basePath;
      }
      console.log("routePath", this.basePath + routePath);
      return this.basePath + routePath;
    },
  },
};
</script>
  
<style lang="scss" scoped>
a {
  text-decoration: none;
  color: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0 26px;
}
.header {
  background: linear-gradient(90deg, #146dc1 0%, #13f5a9 100%);
  border-radius: 0px 0px 24px 24px;
  display: flex;
  align-items: center;
  .content {
    padding: 0 10px;
    display: flex;
    height: 100%;
    .logo {
      padding-left: 10px;
      width: 224px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 30px;
      img {
        width: 100%;
        height: 50%;
      }
    }
    .active {
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.1) 100%
      );
      border: 1px solid;
      border-image: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.2)
        )
        1 1;
    }
    .header-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-right: 20px;
      border: 1px solid transparent;
      .img {
        width: 56px;
        height: 56px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .text {
        text-align: center;
        font-weight: 500;
        color: #ffffff;
        line-height: 22px;
        font-size: 16px;
      }
    }
  }
}
</style>
  