// const getDeviceStatus = function () {
//   return "getStatus";
// };
// const getCmdVer = function () {//发送获取版本协议
//   return [0x10, 0x00, 0x01, 0x00];
// };
import tools from './tools'

const getCmdStatus = function() { // 发送获取设备状态协议
  return [0x10, 0x00, 0x01, 0x00]
}
const getCmdTime = function() { // 获取定时时段协议
  return [0x10, 0x01, 0x01, 0x00]
}
const setFj = function(type) { // 设置分风速
  if (type === 0 || type === 1 || type === 2 || type === 3) {
    return [0x20, 0x00, 0x01, type]
  }
  return []
}
const setZq = function(type) { // 设置增强
  if (type === 0 || type === 1) {
    return [0x20, 0x01, 0x01, type]
  }
  return []
}
const setJh = function(val) { // 设置净化
  const hex = tools.lenFormat(val.toString(16), 6)
  return [0x20, 0x02, 0x03, parseInt(hex.substring(0, 2), 16), parseInt(hex.substring(2, 4), 16), parseInt(hex.substring(4, 6), 16)]
}
const setXd = function(val) { // 设置消毒
  const hex = tools.lenFormat(val.toString(16), 6)
  return [0x20, 0x03, 0x03, parseInt(hex.substring(0, 2), 16), parseInt(hex.substring(2, 4), 16), parseInt(hex.substring(4, 6), 16)]
}
const enterAutoModel = function() { // 进入自动模式 即关闭净化或消毒
  return [0x20, 0x04, 0x01, 0x00]
}
// const setJhTime = function (data) {
//   let cmd = [0x20, 0x05, 0x0c];
//   for (let i = 0; i < data.length; i++) {
//     cmd.push(data[i]);
//   }
//   return cmd;
// };
const setXdTime = function(data) { // 设置消毒时间段  六个时间段
  const cmd = [0x20, 0x05, 0x18]
  for (let i = 0; i < data.length; i++) {
    cmd.push(data[i])
  }
  return cmd
}
const setTime = function() { // 同步时间
  const date = new Date()
  const year = date.getFullYear() - 2000
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const week = date.getDay()
  return [0x20, 0x06, 0x07, year, month, day, hours, minutes, seconds, week]
}
const setLwsm = function(val) { // 设置滤网寿命
  const hex = tools.lenFormat(val.toString(16), 8)
  return [0x20, 0x07, 0x04, parseInt(hex.substring(0, 2), 16), parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16), parseInt(hex.substring(6, 8), 16)]
}
const setGzsc = function(val) { // 设置滤网寿命
  const hex = tools.lenFormat(val.toString(16), 8)
  return [0x20, 0x08, 0x04, parseInt(hex.substring(0, 2), 16), parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16), parseInt(hex.substring(6, 8), 16)]
}

export default {
  // getDeviceStatus,
  // getCmdVer,
  getCmdStatus,
  getCmdTime,
  setFj,
  setZq,
  setJh,
  setXd,
  enterAutoModel,
  // setJhTime,
  setXdTime,
  setTime,
  setLwsm,
  setGzsc
}
