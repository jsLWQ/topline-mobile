import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from '@/store'
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible' // 适配rem
import './styles/index.less' // 自己的样式文件
import zhCN from 'vee-validate/dist/locale/zh_CN' // 加载语言包
import VeeValidate, { Validator } from 'vee-validate' // 表单验证
// import { Lazyload } from 'vant' // 用来设置图片的懒加载功能
import dayjs from 'dayjs' // 格式化时间
import relativeTime from 'dayjs/plugin/relativeTime' // 格式化时间
import 'dayjs/locale/zh-cn' // 按需加载，设置格式化时间的语言包

Vue.use(VeeValidate, {
  events: ''
})
Validator.localize('zh_CN', zhCN) // 设置表单验证的语言
Vue.use(Vant)

// options 为可选参数，无则不传（图片懒加载的配置）
Vue.use(Lazyload)

dayjs.locale('zh-cn') // 全局使用中文
dayjs.extend(relativeTime)
Vue.filter('formattingTime', value => {
  // console.log(dayjs().from(dayjs(value)))
  return dayjs().from(dayjs(value))
})

Vue.config.productionTip = false
Vue.prototype.$ss = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
