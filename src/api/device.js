import request from '@/utils/request'

export function userInfo(query) {
  return request({
    // todo
    url: 'http://localhost:9527/mock/device/userInfo.json',
    method: 'get',
    params: query
  })
}

export function getList(query) {
  return request({
    url: '/b/device_info/view',
    method: 'get',
    params: query
  })
}
