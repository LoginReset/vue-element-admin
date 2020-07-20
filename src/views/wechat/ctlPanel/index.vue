<template>
  <div class="content">
    <div id="appWindow" class="app-window">
      <div class="devStatus">{{ statusTextC }}</div>
      <div class="company">
        <!--时钟-->
        <div class="clock">
          <div>
            <span>
              <i id="clock">{{ showTime }}</i>
              <br>
              <b id="date">{{ showDate }}</b>
            </span>
          </div>
        </div>
        <!--公司名 LOGO-->
        <div class="title">{{ index.title }}
          <div class="version">{{ version }}</div>
        </div>
      </div>
      <div class="logo-div" @click="device.jhdjs=10;"><img class="logo-img" :src="index.logo" alt=""></div>

      <div class="body">
        <div class="advertisement">
          <van-swipe class="advertisement-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item v-for="(image, index) in images" :key="index">
              <img v-lazy="image">
            </van-swipe-item>
          </van-swipe>
        </div>

        <div class="displayArea">
          <transition-group class="animateBody" name="display-bar-list" tag="div">
            <div :key="1" :style="{backgroundColor:lwxsBg,color:lwxsColor}" class="dItem ghlw">更换滤网倒计时<span>{{ device.ghlw }}</span>小时
            </div>
            <div :key="2" class="dItem gzsc">设备累计工作时长<span>{{ device.gzsc }}</span>小时</div>
            <div v-if="showJhCountDown" :key="3" class="dItem djs">净化倒计时<span>{{ jhCountDown }}</span></div>
            <div v-if="showXdCountDown" :key="4" class="dItem djs">消毒倒计时<span>{{ xdCountDown }}</span></div>
            <div v-if="showAutoModel" :key="5" class="dItem djs">自动模式</div>
          </transition-group>
        </div>
        <div class="btnArea">
          <div class="btnBox">
            <div class="btnBar btnBar1">
              <div class="btnItem" @click="btnClick(0)">
                <img :src="fjIcon">
                <div>{{ fjText }}</div>
              </div>
              <div class="btnItem" @click="btnClick(1)">
                <img :src="zqIcon">
                <div>增强</div>
              </div>
              <div class="btnItem" @click="btnClick(2)">
                <img :src="jhIcon">
                <div>净化</div>
              </div>
              <div class="btnItem" @click="btnClick(3)">
                <img :src="xdIcon">
                <div>消毒</div>
              </div>
            </div>
            <div class="placeholderDiv"/>
            <div class="indicatePoint">
              <div class="p1 pSelect"/>
            </div>
          </div>
        </div>
        <div class="functionArea">
          <div class="fbody">
            <div class="title">功能设置</div>
            <div class="setBar">
              <div class="setItem" @click="setClick(0)">
                <img src="./img/index/index-ms.png">
                <div>高级设置</div>
              </div>
              <div class="setItem" @click="setClick(1)">
                <img src="./img/index/index-ys.png">
                <div>定时预设</div>
              </div>
              <div class="setItem" @click="setClick(2)">
                <img :src="changeDeviceIcon">
                <div>{{ index.currentName }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <van-popup v-model="showPicker" position="bottom">
        <van-datetime-picker
          v-model="pickerTime"
          type="time"
          @confirm="pickerConfirm"
          @cancel="showPicker = false"
        />
      </van-popup>
      <van-dialog
        v-model="editDialogShow"
        get-container=".app-window"
        title="请输入设备名"
        :before-close="editBeforeClose"
        show-cancel-button
      >
        <van-field v-model="editValue" input-align="center" type="text" :placeholder="placeholder"/>
      </van-dialog>

    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Popup, Dialog, Toast, DatetimePicker, Field, Swipe, SwipeItem, Lazyload} from 'vant'
  import {mapState, mapMutations, mapActions} from 'vuex'
  import tools from './js/tools'
  import mqttCmd from './js/mqttCmd'

  Vue.use(Popup).use(Dialog).use(Toast).use(DatetimePicker).use(Field).use(Swipe).use(SwipeItem).use(Lazyload)
  export default {
    name: 'Index',
    data() {
      return {
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
        companyLogo: require('./img/index/2.0/logo/jwk-logo.png'),
        //  修改设备名
        editDialogShow: false,
        editValue: '',
        placeholder: '',
        editDeviceName: '',
        //  广告图片
        images: [
          require('./img/index/gg/a.png'),
          require('./img/index/gg/b.png')
        ]
      }
    }, mounted() {
      this.showDateM()
      setTimeout(() => {
        if (!this.index.currentDevice) {
          Dialog({message: '请先选择设备！', getContainer: '#appWindow'})
        }
      }, 500)
    },
    methods: {
      ...mapMutations({dStatus: 'device/dStatus'}),
      ...mapActions({modifyTitle: 'device/modifyTitle'}),
      getContainer() {
        return document.querySelector('.app-window')
      },
      showDateM: function () {
        // 创建一个时间日期对象
        const date = new Date();
        const year = date.getFullYear();
        const month = tools.lenFormat(date.getMonth() + 1 + '', 2);
        const day = tools.lenFormat(date.getDate() + '', 2);
        const hours = tools.lenFormat(date.getHours() + '', 2);
        const minutes = tools.lenFormat(date.getMinutes() + '', 2);
        const weekArray = ['日', '一', '二', '三', '四', '五', '六'];
        const week = weekArray[date.getDay()];
        this.showDate = '北京时间' + year + '.' + month + '.' + day;
        this.showTime = hours + ' : ' + minutes;
        setTimeout(() => {
          this.showDateM()
        }, 1000)
      },
      btnClick(type) { // 按钮点击事件
        if (this.clickIsEnabled() !== 1) { // 离线
          return
        }
        switch (type) {
          case 0:// 风机
            if (this.device.jhStatus === 0 && this.device.xdStatus === 0) {
              Toast.fail('请先开启净化或消毒');
              return;
            }
            if (this.device.fjStatus === 1) {
              this.$emit('sendMsg', mqttCmd.setFj(2));
            } else if (this.device.fjStatus === 2) {
              this.$emit('sendMsg', mqttCmd.setFj(3));
            } else if (this.device.fjStatus === 3) {
              this.$emit('sendMsg', mqttCmd.setFj(1));
            } else {
              this.$emit('sendMsg', mqttCmd.setFj(1));
            }
            break;
          case 1:// 增强
            if (this.device.xdStatus === 0) {
              Toast.fail('请先开启消毒');
              return;
            }
            if (this.device.zqStatus === 1) { // 当前为开
              this.$emit('sendMsg', mqttCmd.setZq(0));
            } else {
              this.$emit('sendMsg', mqttCmd.setZq(1));
            }
            break;
          case 2:// 净化
            if (this.device.jhdjs <= 0) {
              this.pickerTimeType = 0;
              const xdgJhdjs = window.localStorage.getItem('xdg-jhdjs');
              if (xdgJhdjs) {
                this.pickerTime = xdgJhdjs;
              } else {
                this.pickerTime = '00:30';
              }
              this.showPicker = true;
            } else {
              this.$emit('sendMsg', mqttCmd.enterAutoModel());
            }
            break;
          case 3:
            if (this.device.xdStatus !== 1 || this.device.xddjs <= 0) { // 关或自动模式的开
              this.pickerTimeType = 1;
              const xdgXddjs = window.localStorage.getItem('xdg-xddjs');
              if (xdgXddjs) {
                this.pickerTime = xdgXddjs;
              } else {
                this.pickerTime = '00:30';
              }
              this.showPicker = true;
            } else { // 手动模式的开
              this.$emit('sendMsg', mqttCmd.enterAutoModel());
            }
            break
        }
      },
      setClick(type) { // 功能设置点击事件
        if ((type === 0 || type === 1) && this.clickIsEnabled() !== 1) {
          return
        }
        switch (type) {
          case 0:
            this.$emit('changeView', 1);
            break;
          case 1:
            this.$emit('changeView', 2);
            break;
          case 2:
            if (!this.index.currentDevice) {
              Toast.fail("请先选择设备！");
              return;
            }
            this.editValue = this.index.currentDevice
            this.placeholder = '请输入设备名';
            this.editDialogShow = true;
            break;
        }
      },
      clickIsEnabled() { // return 0=no 1=ok
        if (this.device.status === 1) { // 设备在线
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
      pickerConfirm(time) {
        console.log(time)
        if (time === '00:00') {
          Toast.fail('无效的' + (this.pickerTimeType === 0 ? '净化' : '消毒') + '时间！')
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
        this.showPicker = false
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
      editDialogConfirm() { // 提交修改设备名
        this.modifyTitle({
          deviceName: this.editDeviceName,
          deviceLocaton: this.editValue,
          userOpen: this.index.openId
        }).then(response => {
          Toast.success('修改设备名成功！')
        }).catch(error => {
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
      fjIcon() {
        if (this.device.fjStatus === 1) {
          return require('./img/index/2.0/index-fj-1.png')
        } else if (this.device.fjStatus === 2) {
          return require('./img/index/2.0/index-fj-2.png')
        } else if (this.device.fjStatus === 3) {
          return require('./img/index/2.0/index-fj-3.png')
        }
        return require('./img/index/2.0/index-fj.png')
      },
      zqIcon() {
        if (this.device.zqStatus === 1) {
          return require('./img/index/2.0/index-zq-on.png')
        }
        return require('./img/index/2.0/index-zq.png')
      },
      jhIcon() {
        if (this.device.jhStatus !== 0) {
          return require('./img/index/index-jh-on.png')
        }
        return require('./img/index/index-jh.png')
      },
      xdIcon() {
        if (this.device.xdStatus !== 0) {
          return require('./img/index/index-xd-on.png')
        }
        return require('./img/index/index-xd.png')
      },
      changeDeviceIcon() { // 返回设备切换图标
        return require('./img/device.png')
      },
      statusTextC() {
        if (this.device.status === -1 || this.device.status === 0) { // 登录中
          setTimeout(() => {
            if (this.device.status === -1 || this.device.status === 0) {
              this.dStatus(this.device.status === -1 ? 0 : -1)
            }
          }, 800)
          if (this.statusText.indexOf('登录中') !== -1) {
            this.statusText = this.statusText.length < 6 ? this.statusText + '.' : '登录中'
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
      jhCountDown() { // 净化倒计时
        if (this.device.jhdjs !== 0) {
          if (this.jhCountDownTimer != null) {
            clearTimeout(this.jhCountDownTimer)
          }
          this.jhCountDownTimer = setTimeout(() => {
            this.device.jhdjs--
          }, 1000)
          const hour = parseInt(this.device.jhdjs / (60 * 60) % 60)
          const minute = parseInt(this.device.jhdjs / 60 % 60)
          const second = this.device.jhdjs % 60
          return tools.lenFormat(hour + '', 2) + ':' + tools.lenFormat(minute + '', 2) + ':' + tools.lenFormat(second + '', 2)
        }
      },
      xdCountDown() { // 消毒倒计时
        if (this.device.xddjs !== 0) {
          if (this.xdCountDownTimer != null) {
            clearTimeout(this.xdCountDownTimer)
          }
          this.xdCountDownTimer = setTimeout(() => {
            this.device.xddjs--
          }, 1000)
          const hour = parseInt(this.device.xddjs / (60 * 60) % 60)
          const minute = parseInt(this.device.xddjs / 60 % 60)
          const second = this.device.xddjs % 60
          return tools.lenFormat(hour + '', 2) + ':' + tools.lenFormat(minute + '', 2) + ':' + tools.lenFormat(second + '', 2)
        }
      },
      jhCountDownListen() {
        return this.device.jhdjs
      }, xdCountDownListen() {
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
      }, xdCountDownListen(newVal) {
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

  ::v-deep .van-popup {
    position: absolute;
  }

  .content {
    user-select: none;
    display: flex;
    justify-content: center;
    font-size: 16px;
    background-color: #d1d1d1;
  }

  .app-window {
    width: 80%;
    max-width: 420px;
    background-color: white;
    background-image: url("./img/index/index-bg-2.png");
    background-repeat: no-repeat;
    background-size: 100% auto;
  }

  .company {
    display: flex;
    justify-content: space-between;
  }

  /*设备状态*/
  .devStatus {
    font-size: 14px;
    background-color: #505050;
    color: white;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /*公司*/
  .title {
    margin: 10px 20px 0 0;
    color: #4d585e;
    font-size: 18px
  }

  .version {
    margin-top: 8px;
    font-size: 12px;
    text-align: center;
  }

  .clock {
    margin: 10px 0 0 30px;
    color: #4d585e
  }

  .clock i {
    font-size: 30px;
    line-height: 30px;
    font-weight: bold
  }

  .clock b {
    font-size: 16px;
    font-weight: normal;
  }

  /*logo图片*/
  .logo-div {
    display: flex;
    justify-content: flex-end;
  }

  .logo-div img {
    height: 75px;
    margin-right: 20px;
    margin-top: 10px;
  }

  /*广告*/
  .advertisement {
    width: 100%;
  }

  .advertisement-swipe {
    height: 100%;
    background-color: white;
  }

  .advertisement-swipe .van-swipe-item {
    /*height: 100%;*/
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .advertisement-swipe .van-swipe-item img {
    height: 140px;
    /*vertical-align: middle;*/
  }

  /*显示区域*/
  .displayArea {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    height: 170px;
  }

  .displayArea .animateBody {
    display: flex;
    flex-flow: column nowrap;
    align-items: flex-start;
  }

  .displayArea .dItem {
    margin-left: 10px;
    margin-top: 10px;
    padding: 10px;
    border-radius: 10px;
    font-size: 16px;
    display: flex;
    align-items: center;
  }

  .displayArea .dItem span {
    font-size: 24px;
    margin: 0 8px 0 8px;
  }

  .displayArea .ghlw {

  }

  .displayArea .gzsc {
    background-color: #FDF6EC;
    color: #E6A23C;
  }

  .displayArea .djs {
    background-color: #EDF2FC;
    color: #909399;
  }

  /*按钮区域*/
  .btnArea {
    /*background-color: #50bc59;*/
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
  }

  /*功能区域*/
  .functionArea {
    flex: 1 0 auto;
    /*background-color: #3d99bc;*/
    display: flex;
  }

  .fbody {
    align-self: flex-end;
    color: #474646;
    width: 80%;
    margin: 0 10% 16px 10%;
  }

  .fbody .title {
    font-size: 32px;
    margin-bottom: 16px;
  }

  .fbody .setBar {
    width: 100%;
    font-size: 14px;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between
  }

  .fbody .setItem {
    display: inline-block;
    text-align: center;
  }

  .fbody .setItem div {
    text-align: center;
    margin-top: 14px
  }

  .fbody img {
    width: 45px
  }

  .displayArea .dItem {
    transition: all 1s;
  }

  .display-bar-list-enter-active {
    transition: all 1s ease;
  }

  .display-bar-list-leave-active {
    transition: all 1s ease;
  }

  .display-bar-list-enter, .display-bar-list-leave-to
    /* .display-bar-list-leave-active for below version 2.1.8 */
  {
    opacity: 0;
    transform: translateY(2rem);
  }

  .display-bar-list-leave-active {
    position: absolute;
  }

  .btnBox {
    color: #4d585e;
    margin-top: 30px;
  }

  .btnBox .btnBar {
    display: flex;
    justify-content: space-around;
  }

  .btnBox .btnItem {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    /*color:#fff;*/
  }

  .btnBox img {
    height: 70px
  }

  .btnBox .btnItem div {
    text-align: center;
    font-size: 14px
  }

  .btnBox .indicatePoint {
    margin: 6px auto 0 auto;
    display: table
  }

  .btnBox .indicatePoint .p1, .p2 {
    height: 10px;
    width: 10px;
    background-color: #e5e5e5;
    display: inline-block;
    padding: 6px;
    border-radius: 100%;
    background-clip: content-box;
  }

  .btnBox .pSelect {
    background-color: #58d4ed !important;
  }

</style>
