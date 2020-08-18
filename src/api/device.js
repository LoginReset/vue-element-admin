import request from '@/utils/request'
//设备查询
export function getMqView(query) {
    return request({
      url: '/b/mqUser/view', 
      method: 'get',
      params:query
    })
  }
//单个注册
export function postMqAdd(data) {
      return request({
        url: '/public/mqUser/register', 
        method: 'post',
        data
      })
} 
//批量注册
export function postMqBatch(data) {
    return request({
        url: '/b/mqUser/register/batch', 
        method: 'post',
        data
    })
} 
//设置是否成为超级用户
export function postMqSp(data) {
    return request({
        url: '/b/mqUser/superuser', 
        method: 'post',
        data
    })
} 
//启用和禁用
export function postMqEnable(data) {
    return request({
        url: '/b/mqUser/enable', 
        method: 'post',
        data
    })
} 


