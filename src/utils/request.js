import axios from 'axios'
import store from '@/store/index.js'
import JSONbig from 'json-bigint'
import router from '@/router'

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
}, async error => {
  // console.dir(error)
  const { user } = store.state
  // console.log(user)
  if (error.response.status === 401) {
    console.log(router.currentRoute)
    store.commit('setTarget', router.currentRoute.path)
    if (!user || !user.refresh_token) {
      router.push({
        name: 'login'
      })
      return
    }
    // console.log(user.refresh_token)
    try {
      const { data } = await axios({
        method: 'PUT',
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        // url: 'http://toutiao.course.itcast.cn/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      store.commit('setUsers', {
        token: data.data.token,
        refresh_token: user.refresh_token
      })
      return request(error.config)
    } catch (error) {
      console.dir(error)
      window.localStorage.removeItem('user')
      router.push({
        name: 'login'
      })
    }
  }
  return Promise.reject(error)
})

export default request
