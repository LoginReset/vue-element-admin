import request from '@/utils/request'

export function getAccessToken(token) {
  return request({
    url: '/b/wechat/at',
    method: 'get',
    params: token
  })
}
export function getMenu() {
  return request({
    url: '/b/wechat/menu',
    method: 'get'
  })
}

export function postMenu(data) {
  return request({
    url: '/b/wechat/menu',
    method: 'post',
    data
  })
}
// 同步菜单
export function postSynchMenu(data) {
  return request({
    url: '/b/wechat/synchMenu',
    method: 'post',
    data
  })
}
