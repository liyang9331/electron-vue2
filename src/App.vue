<template>
  <router-view />
</template>
<script>
import { reactive, ref, getCurrentInstance } from "vue";
export default {
  name: "App",
  data () {
    return {
      activeDragData: null,
    };
  },
  setup () {
    const { ctx, proxy } = getCurrentInstance();
    console.log(proxy.$httpServerLocal);
  },
  mounted () {
    //初始化httpserver
  },
};
</script>
<style>
body {
  margin: 0;
  padding: 0;
  background: #fff;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>