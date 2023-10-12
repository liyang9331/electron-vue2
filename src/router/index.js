import Vue from 'vue';
import VueRouter from 'vue-router';
/* Layout */
import Layout from "@/layout";
Vue.use(VueRouter);
export const constantRoutes = [
  {
    path: "dataInspection",
    name: "数据检验",
    meta: { title: "数据检验", affix: true },
    component: () => import("@/views/dataInspection/dataInspection.vue"),
    imgUrl: require("../assets/images/menu/shujujiaoyan.png"),
  },
  {
    path: "configure",
    component: () => import("@/views/testConfig/testConfigCom.vue"),
    name: "检查项配置",
    imgUrl: require("../assets/images/menu/jianyanxiangpeizhi.png"),
    meta: { title: "检查项配置", icon: "icon-shujuxiaoyan", affix: true },
    children: [],
  },
  {
    path: "help",
    component: () => import("@/views/help/helpCom.vue"),
    name: "帮助",
    imgUrl: require("../assets/images/menu/bangzhu.png"),
    meta: { title: "帮助", icon: "icon-shujuxiaoyan", affix: true },
    children: [],
  },
];

export const routes = [
  {
    path: "/",
    name: "Home",
    component: Layout,
    redirect: "/dataInspection",
    children: constantRoutes,
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true,
  },
];

const router = new VueRouter({
  mode: 'history', // 使用 HTML5 history 模式，也可以使用 'hash' 模式
  routes,
});

export default router;
