import request from '@/utils/request'


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
/**
   * 微信模板消息添加
   * @param data
   * @returns {AxiosPromise}
   */
  export function postMsgTempSave(data) {
    return request({
      url: '/wechat/msg_temp/save',
      method: 'post',
      data
    })
  }
  /**
   * 微信模板消息修改
   * @param data
   * @returns {AxiosPromise}
   */
  export function postMsgTempUpdate(data) {
    return request({
      url: '/wechat/msg_temp/update',
      method: 'post',
      data
    })
  }
  /**
   * 微信模板消息删除
   * @param data
   * @returns {AxiosPromise}
   */
  export function postMsgTempDel(data) {
    return request({
      url: '/wechat/msg_temp/delete',
      method: 'post',
      data
    })
  }
  /**
     * 获取微信模板
     * @returns {AxiosPromise}
     */
  export function getMsgTemp(query) {
    return request({
      url: '/wechat/msg_temp/view',
      method: 'get',
      params:query
    })
  }
  