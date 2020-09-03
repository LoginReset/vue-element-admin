import { login, logout, getInfo } from '@/api/user'
import { getSynthesize } from '@/api/product'
// import { getToken, setToken, removeToken } from '@/utils/auth'
import { getToken, setToken, removeToken,getOS, setOS, removeOS } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '', // 姓名
  avatar: '', // 头像
  introduction: '', // 简介
  roles: [], // 权限列表
  roleName: '',// 角色名
  mq:'',//
  mqR:{}//mq权限
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROLE_NAME: (state, roleName) => {
    state.roleName = roleName
  },
  SET_OSNAME: (state, osName) => {
    state.osName = osName
  },
  SET_BROWSERNAME: (state, browserName) => {
    state.browserName = browserName
  },
  SET_MQ: (state, mq) => {
    state.mq = mq
  },
  SET_MQR: (state, mqR) => {
    state.mqR = mqR
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    console.log(userInfo)
    const { username, password, browser, OS } = userInfo
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('account', username.trim())
      formData.append('pwd', password)
      formData.append('isRemember', true)
      formData.append('browserName', browser)
      formData.append('osName', OS)
      login(formData).then(response => {
        // const { data } = response
        const data = {
          browser,
          OS,
          username
        }
        setOS(data)
        // commit('SET_TOKEN', "LOGIN_SUCCESS")
        setToken('LOGIN_SUCCESS')// 本项目中没有实际意义，只是一个标志位表示登录成功了，也可以用作token值
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { respObj } = response
        if (!respObj) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction, roleName } = respObj

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
         let mqR = {
          roles:false,
          product:false,
          device:false,
          history:false,
          version:false,
          versionBatch:false,
        }
        if(roles.includes('product')&&roles.includes('device')&&roles.includes('version')){
          mqR.roles = true
          roles.includes('product-manage')?mqR.product = true:''
          roles.includes('version-manage')?mqR.version = true:''
          roles.includes('version-batch')?mqR.versionBatch = true:''
          roles.includes('device-manage')?mqR.device = true:''
          roles.includes('device-history')?mqR.history = true:''
        }
        commit('SET_MQR', mqR)// 权限列表
        commit('SET_ROLES', roles)// 权限列表
        commit('SET_NAME', name)// 姓名
        commit('SET_AVATAR', avatar)// 头像
        commit('SET_INTRODUCTION', introduction)// 简介
        commit('SET_ROLE_NAME', roleName)// 角色名
        resolve(respObj)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getMq({commit, state}){
    return new Promise((resolve,reject)=>{
      getSynthesize().then(response=>{
        commit('SET_MQ',response.respObj)
        
        resolve()
      })
    })
  },
   // user logout
   logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      const data = new FormData()
      data.append('osName',JSON.parse(getOS()).OS)
      data.append('browserName',JSON.parse(getOS()).browser)
      console.log('logout')
      logout(data).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

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
