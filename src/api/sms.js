import request from '@/utils/request'
/**
 * 获取全部短信模板
 * @returns {AxiosPromise}
 */
export function getTemplateAll() {
  return request({
    url: '/sms/template/all',
    method: 'get'
  })
}
/**
 * 获取短信模板
 * @returns {AxiosPromise}
 */
export function getTemplates(query) {
  console.log(query)
  return request({
    url: '/sms/template/view',
    method: 'get',
    params: query
  })
}
/**
   * 添加短信模板
   * @param data
   * @returns {AxiosPromise}
   */
export function postTemplateAdd(data) {
  return request({
    url: '/sms/template/add',
    method: 'post',
    data
  })
}

/**
   * 更新短信模板
   * @param data
   * @returns {AxiosPromise}
   */
export function postTemplateUp(data) {
  console.log(data)
  return request({
    url: '/sms/template/up',
    method: 'post',
    data
  })
}

/**
   * 删除全局字段变量
   * @param data
   * @returns {AxiosPromise}
   */
export function getTemplateDel(data) {
  console.log(data)
  return request({
    url: '/sms/template/del',
    method: 'post',
    data
  })
}

/**
   * 保存短信平台账号
   * @param data
   * @returns {AxiosPromise}
   */
export function postAccountSave(data) {
  return request({
    url: '/sms/account/save',
    method: 'post',
    data
  })
}
/**
   * 保存短信平台账号
   * @param data
   * @returns {AxiosPromise}
   */
export function getAccount() {
  return request({
    url: '/sms/account/view',
    method: 'get'
  })
}
