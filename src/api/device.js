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
//设备导出
export function getMqExport(query) {
    console.log(query)
    return request({
        url: '/b/mqUser/export', 
        method: 'get',
        params:query
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
//批量指定版本
export function postVersion(data) {
    return request({
        url: '/b/mqUser/specify/version_batch', 
        method: 'post',
        data
    })
} 
//单个指定版本
export function postSingleVersion(data) {
    return request({
        url: '/b/mqUser/specify/version', 
        method: 'post',
        data
    })
} 
//查询版本
export function getVersionView(query) {
    return request({
        url: '/b/version/view', 
        method: 'get',
        params:query
    })
} 

//添加版本
export function postVersionAdd(data) {
    return request({
        url: '/b/version/add', 
        method: 'post',
        data
    })
} 
//修改版本
export function postVersionUp(data) {
    return request({
        url: '/b/version/update', 
        method: 'post',
        data
    })
} 
//上传文件
export function postUpFile(data) {
    return request({
        url: '/b/upload/up_file', 
        method: 'post',
        data,
        headers:{
            "Content-Type": "multipart/form-data"
        }
    })
} 
//设备批量导入
export function postMqImport(data) {
    return request({
        url: '/b/mqUser/to_lead', 
        method: 'post',
        data
    })
} 
//批量注册记录
export function getRhView(query) {
    return request({
        url: '/b/rh/view', 
        method: 'get',
        params:query
    })
} 
