import Vue from 'vue'
import Vuex from 'vuex'
import { getUser, setUser, removeUser } from '@/utils/auth'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: getUser(),
    targets: '/'
  },
  mutations: {
    setUsers (state, data) {
      state.user = data
      setUser(state.user)
    },
    removeUser () {
      removeUser()
    },
    setTarget (state, data) {
      state.targets = data
    }
  },
  actions: {

  }
})
export default store
