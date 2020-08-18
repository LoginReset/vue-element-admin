import request from '@/utils/request'
/**
 * 获取元件名称
 * @returns {AxiosPromise}
 */
export function getElView(query) {
  return request({
    url: '/b/el/view',
    method: 'get',
    params:query
  })
}
/**
   * 添加元件名称
   * @param data
   * @returns {AxiosPromise}
   */
export function postElAdd(data) {
  return request({
    url: '/b/el/add',
    method: 'post',
    data
  })
}

/**
   * 更新元件名称
   * @param data
   * @returns {AxiosPromise}
   */
export function postElUp(data) {
  return request({
    url: '/b/el/update',
    method: 'post',
    data
  })
}

/**
   * 删除元件名称
   * @param data
   * @returns {AxiosPromise}
   */
export function getElDel(data) {
  return request({
    url: '/b/el/delete',
    method: 'post',
    data
  })
}

/**
 * 获取元件名称
 * @returns {AxiosPromise}
 */
export function getRankView(query) {
    return request({
      url: '/b/rank/view',
      method: 'get',
      params:query
    })
  }
  /**
     * 添加元件名称
     * @param data
     * @returns {AxiosPromise}
     */
  export function postRankAdd(data) {
    return request({
      url: '/b/rank/add',
      method: 'post',
      data
    })
  }
  
  /**
     * 更新元件名称
     * @param data
     * @returns {AxiosPromise}
     */
  export function postRankUp(data) {
    return request({
      url: '/b/rank/update',
      method: 'post',
      data
    })
  }
  
  /**
     * 删除元件名称
     * @param data
     * @returns {AxiosPromise}
     */
  export function getRankDel(data) {
    return request({
      url: '/b/rank/delete',
      method: 'post',
      data
    })
  }

  /**
 * 获取元件类型
 * @returns {AxiosPromise}
 */
export function getTypeView(query) {
    return request({
      url: '/b/type/view',
      method: 'get',
      params:query
    })
  }
  /**
     * 添加元件类型
     * @param data
     * @returns {AxiosPromise}
     */
  export function postTypeAdd(data) {
    return request({
      url: '/b/type/add',
      method: 'post',
      data
    })
  }
  
  /**
     * 更新元件类型
     * @param data
     * @returns {AxiosPromise}
     */
  export function postTypeUp(data) {
    return request({
      url: '/b/type/update',
      method: 'post',
      data
    })
  }
  
  /**
     * 删除元件类型
     * @param data
     * @returns {AxiosPromise}
     */
  export function getTypeDel(data) {
    return request({
      url: '/b/type/delete',
      method: 'post',
      data
    })
  }

/**
 * 获取元件参数
 * @returns {AxiosPromise}
 */
export function getComView(query) {
    return request({
      url: '/b/com/view',
      method: 'get',
      params:query
    })
  }
  /**
     * 添加元件类型
     * @param data
     * @returns {AxiosPromise}
     */
  export function postComAdd(data) {
    return request({
      url: '/b/com/add',
      method: 'post',
      data
    })
  }
  
  /**
     * 更新元件类型
     * @param data
     * @returns {AxiosPromise}
     */
  export function postComeUp(data) {
    return request({
      url: '/b/com/update',
      method: 'post',
      data
    })
  }
  
  /**
     * 删除元件类型
     * @param data
     * @returns {AxiosPromise}
     */
  export function getComDel(data) {
    return request({
      url: '/b/com/delete',
      method: 'post',
      data
    })
  }
/**
* 更新元件库存
* @param data
* @returns {AxiosPromise}
 */
export function getComUpStock(data) {
    return request({
        url: '/b/com/update_stock',
        method: 'post',
        data
    })
}
/**
* 组合参数返回
* @param data
* @returns {AxiosPromise}
 */
export function postParameter() {
  return request({
      url: '/b/com/parameter',
      method: 'post'
  })
}
/**
* 上传bom清单
* @param data
* @returns {AxiosPromise}
 */
export function postUpBom(data) {
  return request({
      url: '/b/upload/up_bom',
      method: 'post',
      data,
      headers:{
        "Content-Type": "multipart/form-data"
      }
  })
}
/**
* 首页参数返回
* @param data
* @returns {AxiosPromise}
 */
export function getHome() {
  return request({
      url: '/b/com/home',
      method: 'get'
  })
}    
/**
* 修改价格
* @param data
* @returns {AxiosPromise}
 */
export function postPriceUp(data) {
  return request({
      url: '/b/com/update_price',
      method: 'post',
      data
  })
} 