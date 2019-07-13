import axios from 'axios'
import store from '@/store/index.js'
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
  // baseURL: `http://toutiao.course.itcast.cn`

})

request.interceptors.request.use(config => {
  // 添加头部
  if (store.state.user) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

request.interceptors.response.use(response => {
  return response.data.data || response.data.data
}, error => {
  return Promise.reject(error)
})

export default request
