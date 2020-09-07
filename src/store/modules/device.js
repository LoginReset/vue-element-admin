import {
  userInfo
} from '@/api/device'
/*
  目标设备状态初始化参照服务器，初始化完成参照实时数据
 */
const state = {
  index: { // 首页
    appKey: '176694',
    deviceName: null,
    deviceSecret: null,
    logo: '', // 公司logo
    title: '成都子程电子', // 公司名
    currentName: '请选择设备', // 当前设备即设备名
    currentDevice: null // 目标设备deviceName
  },
  device: {
    status: -1, // -1/0登录中 1在线 2离线 3请选择设备 4
    version: null,
    checkedStatus: 0, // 检查状态 非0则报警
    type: 0, // 公司产品类型 净为康 奥洁
    fjStatus: 0, // 风机开关 0关 1低 2中 3高
    zqStatus: 0, // 增强开关
    jhStatus: 0, // 净化开关
    xdStatus: 0, // 消毒开关
    // 新增
    smStatus: 0, // 水膜开关
    byStatus: 0, // 备用开关
    msStatus: 0, // 模式
    disinfect: 0, // 杀菌
    closeStatus: 0, // 关机模式
    close: 0,

    ghlw: 0, // 滤网倒计时
    gzsc: 0, // 工作总时长
    jhdjs: 0, // 净化倒计时
    xddjs: 0, // 消毒倒计时
    jhTime: null, // 净化时间段
    xdTime: ['00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00',
      '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00'
    ] // 消毒时间段 字符串数组 每个item内容长度为2
  }
}

const mutations = {
  dStatus(state, val) {
    state.device.status = val
  },
  fjStatus(state, val) {
    state.device.fjStatus = val
  },
  zqStatus(state, val) {
    state.device.zqStatus = val
  },
  smStatus(state, val) {
    state.device.smStatus = val
  },
  byStatus(state, val) {
    state.device.byStatus = val
  },
  msStatus(state, val) {
    state.device.msStatus = val
  },

  disinfect(state, val) {
    state.device.disinfect = val
  },
  closeStatus(state, val) {
    state.device.closeStatus = val
  },
  close(state, val) {
    state.device.close = val
  },
  jhdjs(state, val) {
    state.device.jhdjs = val
  },
  xddjs(state, val) {
    state.device.xddjs = val
  },
  ghlw(state, val) {
    state.device.ghlw = val
  },
  gzsc(state, val) {
    state.device.gzsc = val
  },
  // jhStatus(state, val) {
  //   state.device.jhStatus = val
  // },
  // xdStatus(state, val) {
  //   state.device.xdStatus = val
  // },,
  jhTime(state, obj) { // index,val
    if (!state.device.jhTime) {
      state.device.jhTime = []
    }
    console.log(obj.val)
    const timeArray = obj.val.split(':')
    state.device.jhTime.splice(obj.index * 2, 1, timeArray[0])
    state.device.jhTime.splice(obj.index * 2 + 1, 1, timeArray[1])
  },
  jhTimeAll(state, val) {
    if (!state.device.jhTime) {
      state.device.jhTime = []
    }
    for (let i = 0; i < val.length; i++) {
      state.device.jhTime.splice(i, 1, val[i])
    }
  },
  xdTime(state, obj) { // index,val
    if (!state.device.xdTime) {
      state.device.xdTime = []
    }
    const timeArray = obj.val.split(':')
    state.device.xdTime.splice(obj.index * 2, 1, timeArray[0])
    state.device.xdTime.splice(obj.index * 2 + 1, 1, timeArray[1])
  },
  xdTimeAll(state, val) {
    if (!state.device.xdTime) {
      state.device.xdTime = []
    }
    for (let i = 0; i < val.length; i++) {
      state.device.xdTime.splice(i, 1, val[i])
    }
  },
  setBaseUser(state, obj) { //
    state.index.openId = obj.userOpen
    state.index.appKey = obj.appKey
    state.index.deviceName = obj.deviceName
    state.index.deviceSecret = obj.secretKey
    state.index.deviceList = obj.deviceList
    state.index.currentDevice = obj.currentDevice
    state.device.type = obj.bindType == null ? 0 : obj.bindType
    window.localStorage.setItem('xdg-userId', obj.userOpen)
    // state.index.appKey = "176691";
    // state.index.deviceName = "10000000";
    // state.index.deviceSecret = "MBy1D3tw8JpeCnDQ";
    // state.index.deviceList = ["10000001", "10000002", "10000003"];
    // state.index.currentDevice = "10000001";
  },
  changeDevice(state, val) {
    state.index.currentDevice = val
  },
  setDevice(state, obj) {
    state.device.version = obj.version
    state.device.checkedStatus = obj.checkedStatus
    state.device.fjStatus = obj.fjStatus
    state.device.zqStatus = obj.zqStatus
    state.device.jhStatus = obj.jhStatus
    state.device.xdStatus = obj.xdStatus
    state.device.jhdjs = obj.jhdjs
    state.device.xddjs = obj.xddjs
    state.device.gzsc = obj.gzsc
    state.device.ghlw = obj.ghlw
  },
  modifyTitle(state, data) {
    for (let i = 0; i < state.index.deviceList.length; i++) {
      if (state.index.deviceList[i].deviceName == data.deviceName) {
        state.index.deviceList[i].deviceLocaton = data.deviceLocaton
        return
      }
    }
  }

}

const actions = {
  userInfo({
    commit,
    state
  }, data) {
    return new Promise((resolve, reject) => {
      userInfo({}).then(response => {
        state.index.appKey = response.respObj.appKey
        state.index.deviceName = response.respObj.deviceName
        state.index.deviceSecret = response.respObj.deviceSecret
        state.index.logo = response.respObj.logo
        state.index.title = response.respObj.title
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  modifyTitle({
    commit,
    state
  }, data) { // private String deviceName;private String deviceLocaton;private String userOpen;
    return new Promise((resolve, reject) => {
      // modifyDeviceTitle(data).then(response => {
      //   commit('modifyTitle', data);
      //   resolve(response.respObj);
      // }).catch(error => {
      //   reject(error);
      // })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
