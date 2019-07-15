import axios from 'axios'
import store from '@/store/index.js'
import JSONbig from 'json-bigint'
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
  // baseURL: `http://toutiao.course.itcast.cn`

})
request.defaults.transformResponse = [function (data) {
  // return JSONbig.parse(data)
  try {
    // data 数据可能不是标准的 JSON 格式字符串，否则会导致 JSONbig.parse(data) 转换失败报错
    return JSONbig.parse(data)
  } catch (err) {
    // 无法转换的数据直接原样返回
    return data
  }
}]
request.interceptors.request.use(config => {
  // 添加头部
  if (store.state.user) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  // console.log(config)
  return config
}, error => {
  return Promise.reject(error)
})

request.interceptors.response.use(response => {
  // console.log(response)
  return response.data.data || response.data.data
}, error => {
  return Promise.reject(error)
})

export default request
