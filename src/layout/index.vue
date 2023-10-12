<template>
  <div class="app-wrapper">
    <Header class="header" @secondMenu="secondMenu"></Header>
    <div class="content">
      <el-main style="position: relative; display: flex">
        <section style="width: 100%;" class="app-main">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </section>
      </el-main>
    </div>

    <Footer></Footer>
  </div>
</template>
<script>
import { NavMenu } from "./components";
import Header from "./components/Header/index.vue";
import Footer from "../views/footer/Footer.vue";
export default {
  name: "Layout",
  components: {
    NavMenu,
    Header,
    Footer,
  },
  computed: {},
  data () {
    return {
      constantRoutes: [],
    };
  },
  methods: {
    secondMenu (data) {
      this.constantRoutes = data;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-main {
    height: 100%;
    overflow: auto;
    background-color: #F3F6FE;
    padding: 0;
  }
}

.app-wrapper {
  height: 100vh;

  .content {
    display: flex;
    height: calc(100vh - 100px);

    .menu {
      width: 150px;
      height: calc(100vh - 100px);
      background: #ffffff;
      box-shadow: 0px 8px 28px 0px rgba(72, 89, 102, 0.1);
      height: 100%;
    }
  }
}

.header {
  width: 100%;
  height: 100px
}</style>
