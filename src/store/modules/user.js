import { login, getList } from '@/api/user'
import { getTreeArr } from '@/utils/common'
import { getSession, setSession, removeSession } from '@/utils/auth'
import { resetRouter, constantRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getSession('token'),
    routes: constantRoutes,
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  },
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ 'userName': username.trim(), 'passWd': password }).then(response => {
        const data = response.data
        console.log('登录的数据data', data)
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', data.userInfo.userName)
        commit('SET_AVATAR', data.userInfo.avatar)
        setSession('token', data.token)
        setSession('info', JSON.stringify(data.userInfo))
      }).then(() => {
        getList().then(list => {
          const routeArr = getTreeArr(list.data)
          console.log('列表数据', routeArr)
          resetRouter()
          router.addRoutes(routeArr)
          router.options.routes = constantRoutes.concat(routeArr)
          console.log('路由', this.$router, router)
          commit('SET_ROUTES', router.options.routes)
          setSession('routes', JSON.stringify(list.data))
        })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      //   removeSession()
      //   resetRouter()
      //   commit('RESET_STATE')
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
      dispatch('resetSession').then(() => {
        resolve()
      })
    })
  },

  initSession({ commit }) {
    // F5刷新页面后，重置下vuex状态
    console.log('刷新时候初始化')
    if (getSession('token') && getSession('routes')) {
      console.log('刷新时候初始化', '设置状态')
      const arrAdd = JSON.parse(getSession('routes'))
      const routeArr = getTreeArr(arrAdd)
      commit('SET_TOKEN', getSession('token'))
      commit('SET_NAME', JSON.parse(getSession('info'))['userName'])
      commit('SET_AVATAR', JSON.parse(getSession('info'))['avatar'])
      router.addRoutes(routeArr)
      router.options.routes = constantRoutes.concat(routeArr)
      commit('SET_ROUTES', router.options.routes)
    }
  },
  // remove token
  resetSession({ commit }) {
    return new Promise(resolve => {
      removeSession('token')
      removeSession('info')
      removeSession('routes')
      commit('RESET_STATE')
      resetRouter()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

