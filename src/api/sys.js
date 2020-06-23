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
  console.log(data)
  console.log('data')
  return request({
    url: '/b/sp/del',
    method: 'get',
    params: data
  })
}

/**
 * 获取秘钥列表
 * @param token
 */
export function getSecreteKey(query) {
  return request({
    url: '/b/secretKey/view',
    method: 'get',
    params: query
  })
}

/**
 * 获取全部秘钥权限
 * @returns {AxiosPromise}
 */
export function getSecreteKeyAll() {
  return request({
    url: '/b/secretKey/view',
    method: 'get'
  })
}

/**
 * 添加秘钥
 * @param data
 * @returns {AxiosPromise}
 */
export function postSecreteKeyAdd(data) {
  return request({
    url: '/b/secretKey/add',
    method: 'post',
    data
  })
}

/**
 * 修改
 * @param data
 * @returns {AxiosPromise}
 */
export function postSecreteKeyUp(data) {
  return request({
    url: '/b/secretKey/up',
    method: 'post',
    data
  })
}
/**
 * 更换秘钥
 * @param data
 * @returns {AxiosPromise}
 */
export function postSecreteKeyChange(data) {
  console.log(555555)
  console.log(data)
  return request({
    url: '/b/secretKey/chenge',
    method: 'post',
    data
  })
}

/**
 * 删除秘钥
 * @param data
 * @returns {AxiosPromise}
 */
export function getSecreteKeyDel(data) {
  return request({
    url: '/b/secretKey/del',
    method: 'post',
    data
  })
}
/**
 * 获取登录日志
 * @param query
 */
export function getLoginLog(query) {
  return request({
    url: '/b/sl',
    method: 'get',
    params: query
  })
}

/**
 * 获取全局字段变量列表
 * @param
 */
// export function getPermissions(query) {
//   return request({
//     url: '/sys/fieldKey/view',
//     method: 'get',
//     params: query
//   })
// }

/**
 * 获取全部全局字段变量
 * @returns {AxiosPromise}
 */
export function getFieldKeyAll() {
  return request({
    url: '/sys/fieldKey/view',
    method: 'get'
  })
}

/**
 * 添加全局字段变量
 * @param data
 * @returns {AxiosPromise}
 */
export function postFieldKeyAdd(data) {
  return request({
    url: '/sys/fieldKey/add',
    method: 'post',
    data
  })
}

/**
 * 更新全局字段变量
 * @param data
 * @returns {AxiosPromise}
 */
export function postFieldKeyUp(data) {
  console.log(data)
  return request({
    url: '/sys/fieldKey/up',
    method: 'post',
    data
  })
}

/**
 * 删除全局字段变量
 * @param data
 * @returns {AxiosPromise}
 */
export function getFieldKeyDel(data) {
  return request({
    url: 'sys/fieldKey/del',
    method: 'post',
    data
  })
}
