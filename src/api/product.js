import request from '@/utils/request'
//产品查询
export function getProView(query) {
    return request({
      url: '/b/product/view', 
      method: 'get',
      params:query
    })
  }
//产品添加
export function postProAdd(data) {
    return request({
      url: '/b/product/add', 
      method: 'post',
      data
    })
} 
//产品修改
export function postProUp(data) {
    return request({
      url: '/b/product/update', 
      method: 'post',
      data
    })
} 
//重置registerKey
export function postProKey(data) {
    return request({
      url: '/b/product/update/rk', 
      method: 'post',
      data
    })
} 
//配置查询
export function getConfigView(query) {
  return request({
    url: '/b/baseConfig/view', 
    method: 'get',
    params:query
  })
}
//配置修改
export function postConfigUp(data) {
  return request({
    url: '/b/baseConfig/update', 
    method: 'post',
    data
  })
} 