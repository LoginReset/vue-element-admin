import request from '@/utils/request'

/**
 * 查看设备信息
 * @returns {AxiosPromise}
 */
export function getAdviceView(query){
    return request({
      url:'/b/device_info/view',
      method: 'get',
      params:query
    })
  }
  /**
   * 修改
   * @param data
   * @returns {AxiosPromise}
   */
  export function postDeviceUp(data) {
    return request({
      url: '/b/device_info/update',
      method: 'post',
      data
    })
  }
  
  /**
   * 添加设备
   * @param data
   * @returns {AxiosPromise}
   */
  export function postDeviceAdd(data) {
    console.log(data)
    return request({
      url: '/b/device_info/save',
      method: 'post',
      data
    })
  }
    /**
   * 上传文件
   * @param data
   * @returns {AxiosPromise}
   */
  export function postExcelUp(data) {
    console.log(data)
    return request({
      url: '/b/save/excel',
      method: 'post',
      data
    })
  }
  /**
   * 指派设备
   * @param data
   * @returns {AxiosPromise}
   */
  export function postAssignDevice(data) {
    console.log(data)
    return request({
      url: '/b/device_info/assign',
      method: 'post',
      data
    })
  }
  /**
   * 删除企业
   * @param data
   * @returns {AxiosPromise}
   */
  export function postEnterpriseDel(data) {
    console.log(data)
    return request({
      url: '/company/delete',
      method: 'post',
      data
    })
  }
  /**
   * 用户设备查询
   * @param data
   * @returns {AxiosPromise}
   */
  export function getUserDevice(query) {
    return request({
      url: '/b/su/device',
      method: 'get',
      params:query
    })
  }
    /**
   * 具体设备查询
   * @param data
   * @returns {AxiosPromise}
   */
  export function getSelectDevice(query) {
    return request({
      url: '/b/su/select',
      method: 'get',
      params:query
    })
  }
  /**
   * 用户设备解绑
   * @param data
   * @returns {AxiosPromise}
   */
  export function getDeviceUnbind(data) {
    return request({
      url: '/b/su/unbind',
      method: 'post',
      data
    })
  }
export function userInfo(query) {
  return request({
    // todo
    url: '/b/el',
    // url: 'http://localhost:9527/mock/device/userInfo.json',
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
