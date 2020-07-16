import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {

    // var a = roles.some(role => {
    //   if(route.meta.roles.includes(role)){
    //   console.log(role)

    //   }
    //   return route.meta.roles.includes(role)
    // })
    // console.log('-----------')
    // console.log(a)
    return roles.some(role => route.meta.roles.includes(role))
    // return true
  } else {
    return false
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */

export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      // console.log(tmp)
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  // permission: []// 按钮权限标识集合
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  // SET_PERMISSION(state, permission) { // permission 为传入的按钮权限标识集合
  //   // 传入的权限集合 赋值给状态中的 permission
  //   state.permission = permission
  // }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      console.log(accessedRoutes)
      // }
      if (typeof roles[0] === 'string') {
        commit('SET_ROUTES', accessedRoutes)
      }
      resolve(accessedRoutes)
    })
  },
  addPermission({ commit }, permission) {
    commit('SET_PERMISSION', permission)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
