import request from '@/utils/request'


/**
 * 获取管理员列表
 * @param query
 */
export function getUsers(query) {
  return request({
    url: '/b/su',
    method: 'get',
    params: query
  })
}

/**
 * 添加系统管理员
 * @param data
 */
export function postUserAdd(data) {
  return request({
    url: '/b/su',
    method: 'post',
    data
  })
}

/**
 * 更新系统管理员
 * @param data
 */
export function postUserUp(data) {
  return request({
    url: '/b/su/up',
    method: 'post',
    data
  })
}

/**
 * 修改管理员状态
 * @param data
 */
export function postUserStatus(data) {
  return request({
    url: '/b/su/status',
    method: 'post',
    data
  })
}



/**
 * 获取角色列表
 * @param query
 * @returns {AxiosPromise}
 */
export function getRoles(query) {
  return request({
    url: '/b/sr',
    method: 'get',
    params: query
  })
}

/**
 * 添加角色
 * @param data
 * @returns {AxiosPromise}
 */
export function postRoleAdd(data) {
  return request({
    url: '/b/sr',
    method: 'post',
    data
  })
}

/**
 * 修改角色
 * @param data
 * @returns {AxiosPromise}
 */
export function postRoleUp(data) {
  return request({
    url: '/b/sr/up',
    method: 'post',
    data
  })
}

/**
 * 删除角色
 * @param data
 * @returns {AxiosPromise}
 */
export function getRoleDel(data) {
  return request({
    url: '/b/sr/del',
    method: 'get',
    params: data
  })
}




/**
 * 获取权限列表
 * @param token
 */
export function getPermissions(query) {
  return request({
    url: '/b/sp',
    method: 'get',
    params: query
  })
}

/**
 * 获取全部系统权限
 * @returns {AxiosPromise}
 */
export function getPermissionAll() {
  return request({
    url: '/b/sp',
    method: 'get'
  })
}

/**
 * 添加系统权限
 * @param data
 * @returns {AxiosPromise}
 */
export function postPermissionAdd(data) {
  return request({
    url: '/b/sp',
    method: 'post',
    data
  })
}

/**
 * 更新系统权限
 * @param data
 * @returns {AxiosPromise}
 */
export function postPermissionUp(data) {
  return request({
    url: '/b/sp/up',
    method: 'post',
    data
  })
}


/**
 * 删除系统权限
 * @param data
 * @returns {AxiosPromise}
 */
export function getPermissionDel(data) {
  return request({
    url: '/b/sp/del',
    method: 'get',
    params: data
  })
}

