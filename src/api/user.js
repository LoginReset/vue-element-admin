import request from '@/utils/request'

/**
 * 登录
 * @param data
 */
export function login(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url: '/b/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/b/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/b/logout',
    method: 'post'
  })
}

export function getWechatUser(query){
   return request({
     url:'/wechat/user/view',
     method: 'get',
     params:query
   })
}
export function postWechatUserUp(data){
  return request({
    url:'/wechat/user/update',
    method: 'post',
    data
  })
}
export function getProvinceView(){
  return request({
    url:'/province/view',
    method: 'get'
  })
}