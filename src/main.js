import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import ElementUI from "element-ui"
import zhCn from 'element-ui/lib/locale/lang/zh-CN'
import "./assets/iconfont/iconfont.css";
// 导入封装得svg 组件
import SvgIcon from '@/components/SvgIcon'
// 引入地图的样式
import 'maptalks/dist/maptalks.css';
import './assets/css/reset.css'
import './assets/css/index.scss'
// 导入所有svg文件
const req = require.context('./icons/svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

Vue.use(ElementUI, { size: 'small', zIndex: 3000, locale: zhCn })
Vue.config.productionTip = false
Vue.component('SvgIcon', SvgIcon)
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
