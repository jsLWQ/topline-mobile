import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    },
    {
      // name: 'tabBar',
      path: '/',
      component: () => import('@/views/tabbar-layout'),
      children: [
        {
          name: 'home',
          path: '',
          component: () => import('@/views/home')
        }
      ]
    },
    {
      name: 'search',
      path: '/search',
      component: () => import('@/views/search')
    }
  ]
})
