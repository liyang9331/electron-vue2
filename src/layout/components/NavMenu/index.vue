<template>
  <div class="NavMenus menu-box">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :unique-opened="true"
        :default-active="activeMenu"
        background-color="#fff"
        text-color="#000A12"
        active-text-color="#0190E3"
        @open="handleOpen"
        @close="handleClose"
      >
        <menu-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          base-path="/"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script>
import MenuItem from "./MenuItem.vue";
export default {
  name: "NavMenu",
  props: {
    constantRoutes: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    MenuItem,
  },
  data() {
    return {
      permission_routes: [],
      isCollapse: true,
    };
  },
  watch: {
    constantRoutes() {
      this.permission_routes = this.constantRoutes;
    },
  },
  computed: {
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
  },
  created() {
    this.permission_routes = this.constantRoutes;
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep a {
  text-decoration: none;
  cursor: none;
  color: unset;
  display: flex;
  align-items: center;
  overflow: hidden;
  height: 36px;
  border-radius: 18px;
}
.menuitem_box {
  display: flex;
  justify-content: center;
}
.scrollbar-wrapper {
  overflow-x: hidden !important;
}
.el-menu {
  border: none;
}

.menu-box {
  height: 100vh;
  overflow-y: auto;
}
/* 滚动条样式 */
.menu-box::-webkit-scrollbar {
  // 隐藏滚动条
  display: none;
  /*滚动条整体样式*/
  // width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
  // height: 10px;
}
// ::-webkit-scrollbar-thumb {
// /*滚动条里面小方块*/
// border-radius: 10px;
// box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
// background   : #e1e1e1;
// }
// ::-webkit-scrollbar-track {
// /*滚动条里面轨道*/
// box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0);
// border-radius: 10px;
// background   : rgba(0, 0, 0, 0);
// }
</style>
