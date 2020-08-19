import { login, logout, getInfo } from '@/api/user'
import { getPermissionAll } from '@/api/sys'
import { getToken, setToken, removeToken,getOS, setOS, removeOS } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import {getHome} from '@/api/ele'

const state = {
  token: getToken(),
  name: '', // 姓名
  avatar: '', // 头像
  introduction: '', // 简介
  roles: [], // 权限列表
  roleName: '',// 角色名
  osName:'',
  browserName:'',
  eleData:'',
  eleR:''
  // directFlag: false//页面跳转标志
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
  SET_ADMIN:(state, admin) => {
    state.admin = admin
  },
  SET_ELEDATA:(state, eleData)=>{
    state.eleData = eleData
  },
  SET_ELER:(state, eleR)=>{
    state.eleR = eleR
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
        console.log(response)
        const { respObj } = response
        console.log(respObj)
        if (!respObj) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction, roleName,admin } = respObj

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        // let directFlag = false
        
        commit('SET_ROLES', roles)// 权限列表
        commit('SET_NAME', name)// 姓名
        commit('SET_AVATAR', avatar)// 头像
        commit('SET_INTRODUCTION', introduction)// 简介
        commit('SET_ROLE_NAME', roleName)// 角色名
        commit('SET_ADMIN', admin)// 是否为超级管理员
        resolve(respObj)
      }).catch(error => {
        reject(error)
      })
    })
  },
  //获取首页element权限 没有则不显示
  getEleRole({commit,dispatch}){
    return new Promise((resolve, reject) => {
      let roles = ['element-manage','element-name','element-type','element-rank']
      let eleR = {
        roles:false,
        manage:false,
        name:false,
        rank:false,
        type:false,
      }
      getPermissionAll({permission:'element'}).then(response=>{
        let access = response.respObj.item
        if(access.length>0){
          // 判断元件管理权限是否存在
            eleR.roles = true
            let arr = access[0].children
            if(arr.length>0){
              //判断三级是否存在
              let eleRoles = []
              arr.forEach(item=>{
                eleRoles.push(item.permission)
              })
              roles = roles.slice(0,4)
              let intersection = roles.filter(v => eleRoles.includes(v)) 
              console.log(intersection)
              intersection.forEach(r=>{
                r === 'element-manage'?eleR.manage = true:''
                r === 'element-name'?eleR.name = true:''
                r === 'element-type'?eleR.type = true:''
                r === 'element-rank'?eleR.rank = true:''
              })
          }
          console.log(eleR)
          commit('SET_ELER',eleR)
        }
      })
      
      resolve()
    })
  },
  getElement({ commit }) {
    return new Promise((resolve, reject) => {
      // console.log('getElement',eleData)
      getHome().then(response=>{  
      const {respObj} = response
        commit('SET_ELEDATA', respObj)// 权限列表
      })
      resolve()
    })
  },

   // user logout
   logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      console.log(JSON.parse(getOS()))
      const data = new FormData()
      data.append('osName',JSON.parse(getOS()).OS)
      data.append('browserName',JSON.parse(getOS()).browser)
      console.log(data.get('osName'))
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
