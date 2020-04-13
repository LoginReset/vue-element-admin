import request from '@/utils/request'










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

export function getPermissionAll() {
  return request({
    url: '/b/sp',
    method: 'get'
  })
}

export function postPermissionAdd(data) {
  return request({
    url: '/b/sp',
    method: 'post',
    data
  })
}
