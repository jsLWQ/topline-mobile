import Vue from 'vue'
import Vuex from 'vuex'
import { getUser, setUser } from '@/utils/auth'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: getUser()
  },
  mutations: {
    setUsers (state, data) {
      state.user = data
      setUser(state.user)
    }
  },
  actions: {

  }
})
export default store
