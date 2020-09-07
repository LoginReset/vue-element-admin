<template>
  <div class="content">
    <div id="appWindow" class="app-window" />

    <div>
      <div class="item">
        风机强度：
        <el-button :type="device.fjStatus===1?'primary':''" @click="btnClick(0,1)">低</el-button>
        <el-button :type="device.fjStatus===2?'primary':''" @click="btnClick(0,2)">中</el-button>
        <el-button :type="device.fjStatus===3?'primary':''" @click="btnClick(0,3)">高</el-button>
      </div>
      <div class="item">
        增强：
        <el-button :type="device.zqStatus===1?'primary':''" @click="btnClick(1,1)">开</el-button>
        <el-button :type="device.zqStatus===2?'primary':''" @click="btnClick(1,2)">关</el-button>
      </div>
      <div class="item">
        强度：
        <el-button>增强</el-button>
        <el-button>减弱</el-button>
      </div>
      <template>
        <div class="item">
          杀菌方式：
          <el-button>紫外线</el-button>
          <el-button>等离子</el-button>
          <el-button>臭氧</el-button>
        </div>
      </template>
      <template>
        <div class="item">
          水膜：
          <el-button>开</el-button>
          <el-button>关</el-button>
        </div>
        <div class="item">
          杀毒：
          <el-button>开</el-button>
          <el-button>关</el-button>
        </div>
        <div class="item">
          备用：
          <el-button>开</el-button>
          <el-button>关</el-button>
        </div>
        <div class="item">
          模式：
          <el-button>手动模式</el-button>
          <el-button>自动模式</el-button>
        </div>
      </template>

      <div class="item">
        净化倒计时：
        <el-time-picker
          v-model="jhTime"
          :clearable="false"
          format="HH:mm"
          value-format="HH:mm"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:00'
          }"
          placeholder="任意时间点"
          @change="pickerConfirm(jhTime,0)"
        />
      </div>
      <div class="item">
        消毒倒计时：
        <el-time-picker
          v-model="xdTime"
          :clearable="false"
          format="HH:mm"
          value-format="HH:mm"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:00'
          }"
          placeholder="任意时间点"
          @change="pickerConfirm(xdTime,1)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {
  Popup,
  Dialog,
  Toast,
  DatetimePicker,
  Field,
  Swipe,
  SwipeItem,
  Lazyload
} from 'vant'
import { mapState, mapMutations, mapActions } from 'vuex'
import tools from '../js/tools'
import mqttCmd from '../js/mqttCmd'

Vue.use(Popup)
  .use(Dialog)
  .use(Toast)
  .use(DatetimePicker)
  .use(Field)
  .use(Swipe)
  .use(SwipeItem)
  .use(Lazyload)
export default {
  name: 'CtlPanel',
  data() {
    return {
      currentDate: new Date(2020, 9, 4, 0, 0),
      activeName: 'first',
      // xdTime: new Date(2020, 9, 4, 0, 30), //消毒柜倒计时
      xdTime: '00:30', // 消毒柜倒计时
      jhTime: new Date(2020, 9, 4, 0, 30), // 净化倒计时

      showPicker: false,
      pickerTime: null, // 时间
      pickerTimeType: 0, // 0净化倒计时，1消毒倒计时
      showJhCountDown: false,
      showXdCountDown: false,
      jhCountDownTimer: null,
      xdCountDownTimer: null,
      showTime: '10:00',
      showDate: '北京时间2019.10.01',
      // clickEnable: false,//除了设备切换按钮以外所有的设备是否可用点击
      showDeviceList: false, // 显示设备列表
      statusText: '登录中',
      version: '版本号V-1.0.0',
      // companyLogo: require("./img/index/2.0/logo/jwk-logo.png"),
      //  修改设备名
      editDialogShow: false,
      editValue: '',
      placeholder: '',
      editDeviceName: ''
      //  广告图片
      // images: [
      //   require("./img/index/gg/a.png"),
      //   require("./img/index/gg/b.png"),
      // ],
    }
  },
  mounted() {
    this.showDateM()
    setTimeout(() => {
      if (!this.index.currentDevice) {
        Dialog({ message: '请先选择设备！', getContainer: '#appWindow' })
      }
    }, 500)
  },
  methods: {
    show() {
      this.showPicker = true
    },
    onInput(event) {
      this.setData({
        currentDate: event.detail
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },

    ...mapMutations({ dStatus: 'device/dStatus' }),
    ...mapActions({ modifyTitle: 'device/modifyTitle' }),
    getContainer() {
      return document.querySelector('.app-window')
    },
    showDateM: function() {
      // 创建一个时间日期对象
      const date = new Date()
      const year = date.getFullYear()
      const month = tools.lenFormat(date.getMonth() + 1 + '', 2)
      const day = tools.lenFormat(date.getDate() + '', 2)
      const hours = tools.lenFormat(date.getHours() + '', 2)
      const minutes = tools.lenFormat(date.getMinutes() + '', 2)
      const weekArray = ['日', '一', '二', '三', '四', '五', '六']
      const week = weekArray[date.getDay()]
      this.showDate = '北京时间' + year + '.' + month + '.' + day
      this.showTime = hours + ' : ' + minutes
      setTimeout(() => {
        this.showDateM()
      }, 1000)
    },
    btnClick(type, choose) {
      // 按钮点击事件
      // if (this.clickIsEnabled() !== 1) {
      //   console.log(this.index, "this.index");
      //   // 离线
      //   return;
      // }
      switch (type) {
        case 0: // 风机
          // if (this.device.jhStatus === 0 && this.device.xdStatus === 0) {
          //   Toast.fail("请先开启净化或消毒");
          //   return;
          // }
          this.device.fjStatus = choose
          if (choose === 1) {
            console.log(this.device.fjStatus)
            this.$emit('sendMsg', mqttCmd.setFj(2))
          } else if (choose === 2) {
            this.$emit('sendMsg', mqttCmd.setFj(3))
          } else if (choose === 3) {
            this.$emit('sendMsg', mqttCmd.setFj(1))
          }
          // else {
          //   this.$emit("sendMsg", mqttCmd.setFj(1));
          // }
          break
        case 1: // 增强
          // if (this.device.xdStatus === 0) {
          //   Toast.fail("请先开启消毒");
          //   return;
          // }
          this.device.zqStatus = choose
          console.log(this.device)
          if (this.device.zqStatus === 1) {
            // 当前为开
            this.$emit('sendMsg', mqttCmd.setZq(0))
          } else {
            this.$emit('sendMsg', mqttCmd.setZq(1))
          }
          break
        case 2: // 净化
          if (this.device.jhdjs <= 0) {
            this.pickerTimeType = 0
            const xdgJhdjs = window.localStorage.getItem('xdg-jhdjs')
            if (xdgJhdjs) {
              this.pickerTime = xdgJhdjs
            } else {
              this.pickerTime = '00:30'
            }
            this.showPicker = true
          } else {
            this.$emit('sendMsg', mqttCmd.enterAutoModel())
          }
          break
        case 3:
          if (this.device.xdStatus !== 1 || this.device.xddjs <= 0) {
            // 关或自动模式的开
            this.pickerTimeType = 1
            const xdgXddjs = window.localStorage.getItem('xdg-xddjs')
            if (xdgXddjs) {
              this.pickerTime = xdgXddjs
            } else {
              this.pickerTime = '00:30'
            }
            this.showPicker = true
          } else {
            // 手动模式的开
            this.$emit('sendMsg', mqttCmd.enterAutoModel())
          }
          break
      }
    },
    setClick(type) {
      // 功能设置点击事件
      if ((type === 0 || type === 1) && this.clickIsEnabled() !== 1) {
        return
      }
      switch (type) {
        case 0:
          this.$emit('changeView', 1)
          break
        case 1:
          this.$emit('changeView', 2)
          break
        case 2:
          if (!this.index.currentDevice) {
            Toast.fail('请先选择设备！')
            return
          }
          this.editValue = this.index.currentName
          this.placeholder = '请输入设备名'
          this.editDialogShow = true
          break
      }
    },
    clickIsEnabled() {
      // return 0=no 1=ok
      if (this.device.status === 1) {
        // 设备在线
        return 1
      } else {
        if (this.device.status === 2) {
          Toast.fail('设备离线')
        } else if (this.device.status === 3) {
          Toast.fail('请先选择设备')
        } else if (this.device.status === 4) {
          Toast.fail('连接设备中')
        }
        return 0
      }
      return 1
    },
    pickerConfirm(time, type) {
      console.log(time)
      this.pickerTimeType = type
      if (time === '00:00') {
        Toast.fail(
          '无效的' + (this.pickerTimeType === 0 ? '净化' : '消毒') + '时间！'
        )
        this.pickerTimeType === 0
          ? (this.jhTime = '00:30')
          : (this.xdTime = '00:30')
        return
      }
      const times = time.split(':')
      const minute = parseInt(times[0]) * 60 * 60 + parseInt(times[1]) * 60
      if (this.pickerTimeType === 0) {
        window.localStorage.setItem('xdg-jhdjs', time)
        this.$emit('sendMsg', mqttCmd.setJh(minute))
      } else if (this.pickerTimeType === 1) {
        window.localStorage.setItem('xdg-xddjs', time)
        this.$emit('sendMsg', mqttCmd.setXd(minute))
      }
      // this.showPicker = false;
    },

    editTitle(item) {
      this.showDeviceList = false
      this.editDeviceName = item.deviceName
      this.editValue = item.deviceLocaton
      this.editDialogShow = true
    },
    editBeforeClose(action, done) {
      if (action === 'cancel') {
        done()
        return
      }
      if (this.editValue.length > 10) {
        Toast.fail('请输入小于十个字符的命名')
        done(false)
        return
      }
      this.editDialogConfirm()
      done()
    },
    editDialogConfirm() {
      // 提交修改设备名
      this.modifyTitle({
        deviceName: this.editDeviceName,
        deviceLocaton: this.editValue,
        userOpen: this.index.openId
      })
        .then((response) => {
          Toast.success('修改设备名成功！')
        })
        .catch((error) => {
          Toast.fail(error)
        })
    }
  },
  computed: {
    ...mapState('device', ['index', 'device']),
    fjText() {
      if (this.device.fjStatus === 1) {
        return '风机-低'
      } else if (this.device.fjStatus === 2) {
        return '风机-中'
      } else if (this.device.fjStatus === 3) {
        return '风机-高'
      }
      return '风机'
    },
    // fjIcon() {
    //   if (this.device.fjStatus === 1) {
    //     return require("./img/index/2.0/index-fj-1.png");
    //   } else if (this.device.fjStatus === 2) {
    //     return require("./img/index/2.0/index-fj-2.png");
    //   } else if (this.device.fjStatus === 3) {
    //     return require("./img/index/2.0/index-fj-3.png");
    //   }
    //   return require("./img/index/2.0/index-fj.png");
    // },
    // zqIcon() {
    //   if (this.device.zqStatus === 1) {
    //     return require("./img/index/2.0/index-zq-on.png");
    //   }
    //   return require("./img/index/2.0/index-zq.png");
    // },
    // jhIcon() {
    //   if (this.device.jhStatus !== 0) {
    //     return require("./img/index/index-jh-on.png");
    //   }
    //   return require("./img/index/index-jh.png");
    // },
    // xdIcon() {
    //   if (this.device.xdStatus !== 0) {
    //     return require("./img/index/index-xd-on.png");
    //   }
    //   return require("./img/index/index-xd.png");
    // },
    // changeDeviceIcon() {
    //   // 返回设备切换图标
    //   return require("./img/device.png");
    // },
    statusTextC() {
      if (this.device.status === -1 || this.device.status === 0) {
        // 登录中
        setTimeout(() => {
          if (this.device.status === -1 || this.device.status === 0) {
            this.dStatus(this.device.status === -1 ? 0 : -1)
          }
        }, 800)
        if (this.statusText.indexOf('登录中') !== -1) {
          this.statusText =
            this.statusText.length < 6 ? this.statusText + '.' : '登录中'
          return this.statusText
        } else {
          return '登录中'
        }
      } else if (this.device.status === 1) {
        return '设备在线'
      } else if (this.device.status === 2) {
        return '设备离线'
      } else if (this.device.status === 3) {
        return '请选择设备'
      } else {
        return '连接设备中...'
      }
    },
    jhCountDown() {
      // 净化倒计时
      if (this.device.jhdjs !== 0) {
        if (this.jhCountDownTimer != null) {
          clearTimeout(this.jhCountDownTimer)
        }
        this.jhCountDownTimer = setTimeout(() => {
          this.device.jhdjs--
        }, 1000)
        const hour = parseInt((this.device.jhdjs / (60 * 60)) % 60)
        const minute = parseInt((this.device.jhdjs / 60) % 60)
        const second = this.device.jhdjs % 60
        return (
          tools.lenFormat(hour + '', 2) +
          ':' +
          tools.lenFormat(minute + '', 2) +
          ':' +
          tools.lenFormat(second + '', 2)
        )
      }
    },
    xdCountDown() {
      // 消毒倒计时
      if (this.device.xddjs !== 0) {
        if (this.xdCountDownTimer != null) {
          clearTimeout(this.xdCountDownTimer)
        }
        this.xdCountDownTimer = setTimeout(() => {
          this.device.xddjs--
        }, 1000)
        const hour = parseInt((this.device.xddjs / (60 * 60)) % 60)
        const minute = parseInt((this.device.xddjs / 60) % 60)
        const second = this.device.xddjs % 60
        return (
          tools.lenFormat(hour + '', 2) +
          ':' +
          tools.lenFormat(minute + '', 2) +
          ':' +
          tools.lenFormat(second + '', 2)
        )
      }
    },
    jhCountDownListen() {
      return this.device.jhdjs
    },
    xdCountDownListen() {
      return this.device.xddjs
    },
    lwxsBg() {
      if (this.device.ghlw > 50) {
        return '#F0F9EB'
      }
      return '#FEF0F0'
    },
    lwxsColor() {
      if (this.device.ghlw > 50) {
        return '#67C23A'
      }
      return '#F56C6C'
    },
    showAutoModel() {
      if (this.device.jhdjs > 0 || this.device.xddjs > 0) {
        return false
      }
      return true
    }
  },
  watch: {
    jhCountDownListen(newVal) {
      if (newVal <= 0) {
        this.showJhCountDown = false
      } else {
        this.showJhCountDown = true
      }
    },
    xdCountDownListen(newVal) {
      if (newVal <= 0) {
        this.showXdCountDown = false
      } else {
        this.showXdCountDown = true
      }
    }
  }
}
</script>

<style scoped>
::v-deep .van-overlay {
  position: absolute;
}
.content {
  margin-top: 20px;
  margin-left: 20px;
  font-size: 16px;
  /* user-select: none;
  display: flex;
  justify-content: center;
  font-size: 16px;
  background-color: #fff; */
}
::v-deep .van-popup {
  position: absolute;
}
.item {
  margin-bottom: 20px;
}
.app-window {
  width: 100%;
  /* max-width: 420px; */
  background-color: white;
  background-repeat: no-repeat;
  background-size: 100% auto;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
