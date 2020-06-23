import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    // 判断是否到最后一层
    if (!route.children) {
      // 判断是否有按钮权限
      if (route.meta.buttons) {
        const menuRole = route.meta.roles[0]
        const btns = []
        roles.filter(role => {
          route.meta.buttons.filter(button => {
            const arrRole = role.split(':')
            if (arrRole[0] === menuRole && arrRole.length > 1) {
              const rolestr = arrRole[arrRole.length - 1]
              if (rolestr === button) {
                btns.push(rolestr)
              }
            }
          })
        })
        if (btns.length !== 0) {
          state.permission.push({
            roles: menuRole,
            btn: btns
          })
        }
      }
    }
    return true
    return roles.some(role => route.meta.roles.includes(role))
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
  permission: []// 按钮权限标识集合
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_PERMISSION(state, permission) { // permission 为传入的按钮权限标识集合
    // 传入的权限集合 赋值给状态中的 permission
    state.permission = permission
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
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
