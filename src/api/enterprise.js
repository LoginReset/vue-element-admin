import request from '@/utils/request'

/**
 * 查看企业信息
 * @returns {AxiosPromise}
 */
export function getEnterpriseView(query){
    return request({
      url:'/b/company/view',
      method: 'get',
      params:query
    })
  }
  /**
   * 修改
   * @param data
   * @returns {AxiosPromise}
   */
  export function postEnterpriseUp(data) {
    return request({
      url: '/b/company/admin/update',
      method: 'post',
      data
    })
  }
   /**
   * 修改
   * @param data
   * @returns {AxiosPromise}
   */
  export function postLogoUp(data) {
    console.log(data)
    return request({
      url: '/b/company/update',
      method: 'post',
      data
    })
  }
  
  /**
   * 添加企业
   * @param data
   * @returns {AxiosPromise}
   */
  export function postEnterpriseAdd(data) {
    console.log(data)
  
    return request({
      url: '/b/company/save',
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
      url: '/b/company/delete',
      method: 'post',
      data
    })
  }
    /**
   * 上传logo
   * @param data
   * @returns {AxiosPromise}
   */
  export function postImgUpload(data) {
    console.log(data)
    console.log(111)
  
    return request({
      url: '/b/upload/up_img',
      method: 'post',
      data,
      headers:{
        "Content-Type": "multipart/form-data"
      }
    })
  }
   /**
   * 添加广告
   * @param data
   * @returns {AxiosPromise}
   */
  export function postAdvertsAdd(data) {
    console.log(data)
    return request({
      url: '/b/adverts/save',
      method: 'post',
      data
    })
  }
   /**
   * 查询广告
   * @param data
   * @returns {AxiosPromise}
   */
  export function getAdvertsView(query) {
    return request({
      url: '/b/adverts/view',
      method: 'get',
      params:query
    })
  }
   /**
   * 删除广告
   * @param data
   * @returns {AxiosPromise}
   */
  export function getAdvertsDel(data) {
    return request({
      url: '/b/adverts/delete',
      method: 'post',
      data
    })
  }
    /**
   * 修改广告
   * @param data
   * @returns {AxiosPromise}
   */
  export function getAdvertsUp(data) {
    return request({
      url: '/b/adverts/update',
      method: 'post',
      data
    })
  }