import CrcTool from './crcTool'
// 判断是否是安卓还是ios
const isAndroid = function() {
  const u = navigator.userAgent
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // android终端或者uc浏览器
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
  return isAndroid === true
}

const iosInputRecover = function() {
  // 解决ios下input输入后留下空白的问题 使用前需要判断是否是ios
  if (!isAndroid()) {
    const inputDoms = document.getElementsByTagName('input')
    for (let i = 0; i < inputDoms.length; i++) {
      inputDoms[i].addEventListener('blur', function(e) {
        // $("html,body").animate({scrollTop:$(document).scrollTop()});
        document.documentElement.scrollTop = window.scrollY
      })
    }
    const textareaDoms = document.getElementsByTagName('textarea')
    for (let i = 0; i < textareaDoms.length; i++) {
      textareaDoms[i].addEventListener('blur', function(e) {
        // $("html,body").animate({scrollTop:$(document).scrollTop()});
        document.documentElement.scrollTop = window.scrollY
      })
    }
  }
}
// 获取屏幕宽度
const getWindowWidth = function() {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
}
// 获取屏幕高度
const getWindowHeight = function() {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
}
// 阿拉伯数字转中文数字
const num2chinese = function(num) {
  if (!/^\d*(\.\d*)?$/.test(num)) {
    alert('Number is wrong!')
    return 'Number is wrong!'
  }
  const AA = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九')
  const BB = new Array('', '十', '百', '千', '万', '亿', '点', '')
  const a = ('' + num).replace(/(^0*)/g, '').split('.')
  let k = 0
  let re = ''
  for (let i = a[0].length - 1; i >= 0; i--) {
    switch (k) {
      case 0:
        re = BB[7] + re
        break
      case 4:
        if (!new RegExp('0{4}\\d{' + (a[0].length - i - 1) + '}$').test(a[0])) { re = BB[4] + re }
        break
      case 8:
        re = BB[5] + re
        BB[7] = BB[5]
        k = 0
        break
    }
    if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re
    if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re
    k++
  }
  if (a.length > 1) // 加上小数部分(如果有小数部分)
  {
    re += BB[6]
    for (let i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)]
  }
  return re
}

const lenFormat = function(str, toLength) {
  const diffLength = toLength - str.length
  for (let i = 0; i < diffLength; i++) {
    str = '0' + str
  }
  return str
}

// 添加crc协议
const addCRC = function(bytes) {
  const crcStr = CrcTool.CRC.ToCRC16(bytes, true)
  bytes.push(parseInt(crcStr.substring(0, 2), 16))
  bytes.push(parseInt(crcStr.substring(2, 4), 16))
  return bytes
}

const bytesToArrayBuffer = function(bytes) {
  return new Uint8Array(bytes)
  // return  new Int8Array(bytes).buffer;
  // let bytesSize = bytes.length;
  // let arrayBuffer = new ArrayBuffer(bytesSize);
  // let array = new Int8Array(arrayBuffer);
  // for (let i = 0; i < bytesSize; i++) {
  //   array[i] = bytes[i];
  // }
  // return array;
}

const formatLengthTox = function(value, length) {
  const vLength = value.length
  for (let i = 0; i < length - vLength; i++) {
    value = '0' + value
  }
  return value
}

export default {
  isAndroid,
  iosInputRecover,
  getWindowWidth,
  getWindowHeight,
  num2chinese,
  lenFormat,
  addCRC,
  bytesToArrayBuffer,
  formatLengthTox
}
