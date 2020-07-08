<template>
  <div class="content" style="background-color: #3a835d;display: flex;align-items: center;justify-content: center;">

    <div class="app-window">
      <div class="devStatus">{{statusTextC}}</div>
      <div class="company">
        <!--时钟-->
        <div class="clock">
          <div>
                <span>
                    <i id="clock">{{showTime}}</i>
                  <br>
                  <b id="date">{{showDate}}</b>
                </span>
          </div>
        </div>
        <!--公司名 LOGO-->
        <div class="title">{{title}}
          <div class="version">{{version}}</div>
        </div>
      </div>
      <div class="logo-div"><img class="logo-img" :src="companyLogo" alt=""></div>

      <div class="body">
        <div class="advertisement">
          <van-swipe class="advertisement-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item v-for="(image, index) in images" :key="index">
              <img v-lazy="image"/>
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
    </div>




    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="body">&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="advertisement">&ndash;&gt;-->
    <!--&lt;!&ndash;<van-swipe class="advertisement-swipe" :autoplay="3000" indicator-color="white">&ndash;&gt;-->
    <!--&lt;!&ndash;<van-swipe-item v-for="(image, index) in images" :key="index">&ndash;&gt;-->
    <!--&lt;!&ndash;<img v-lazy="image"/>&ndash;&gt;-->
    <!--&lt;!&ndash;</van-swipe-item>&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;<van-swipe-item><img v-lazy="../assets/img/index/gg/a.jpg" src="../assets/img/index/gg/a.jpg" alt=""></van-swipe-item>&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;<van-swipe-item><img v-lazy="image" src="../assets/img/index/gg/b.jpg" alt=""></van-swipe-item>&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;<van-swipe-item><img v-lazy="image" src="../assets/img/index/gg/c.jpg" alt=""></van-swipe-item>&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;<van-swipe-item><img v-lazy="image" src="../assets/img/index/gg/d.jpg" alt=""></van-swipe-item>&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;</van-swipe>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="displayArea">&ndash;&gt;-->
    <!--&lt;!&ndash;<transition-group class="animateBody" name="display-bar-list" tag="div">&ndash;&gt;-->
    <!--&lt;!&ndash;<div :key="1" :style="{backgroundColor:lwxsBg,color:lwxsColor}" class="dItem ghlw">更换滤网倒计时<span>{{device.ghlw}}</span>小时&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;<div :key="2" class="dItem gzsc">设备累计工作时长<span>{{device.gzsc}}</span>小时</div>&ndash;&gt;-->
    <!--&lt;!&ndash;<div :key="3" v-if="showJhCountDown" class="dItem djs">净化倒计时<span>{{jhCountDown}}</span></div>&ndash;&gt;-->
    <!--&lt;!&ndash;<div :key="4" v-if="showXdCountDown" class="dItem djs">消毒倒计时<span>{{xdCountDown}}</span></div>&ndash;&gt;-->
    <!--&lt;!&ndash;<div :key="5" v-if="showAutoModel" class="dItem djs">自动模式</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</transition-group>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="btnArea">&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="btnBox">&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="btnBar btnBar1">&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="btnItem" @click="btnClick(0)">&ndash;&gt;-->
    <!--&lt;!&ndash;<img :src="fjIcon">&ndash;&gt;-->
    <!--&lt;!&ndash;<div>{{fjText}}</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="btnItem" @click="btnClick(1)">&ndash;&gt;-->
    <!--&lt;!&ndash;<img :src="zqIcon">&ndash;&gt;-->
    <!--&lt;!&ndash;<div>增强</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="btnItem" @click="btnClick(2)">&ndash;&gt;-->
    <!--&lt;!&ndash;<img :src="jhIcon">&ndash;&gt;-->
    <!--&lt;!&ndash;<div>净化</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="btnItem" @click="btnClick(3)">&ndash;&gt;-->
    <!--&lt;!&ndash;<img :src="xdIcon">&ndash;&gt;-->
    <!--&lt;!&ndash;<div>消毒</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="placeholderDiv"></div>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="indicatePoint">&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="p1 pSelect"></div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="functionArea">&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="fbody">&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="title">功能设置</div>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="setBar">&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="setItem" @click="setClick(0)">&ndash;&gt;-->
    <!--&lt;!&ndash;<img src="../assets/img/index/index-ms.png"/>&ndash;&gt;-->
    <!--&lt;!&ndash;<div>高级设置</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="setItem" @click="setClick(1)">&ndash;&gt;-->
    <!--&lt;!&ndash;<img src="../assets/img/index/index-ys.png"/>&ndash;&gt;-->
    <!--&lt;!&ndash;<div>定时预设</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="setItem" @click="setClick(2)">&ndash;&gt;-->
    <!--&lt;!&ndash;<img :src="changeDeviceIcon"/>&ndash;&gt;-->
    <!--&lt;!&ndash;<div>{{changeDeviceText}}</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--&lt;!&ndash;&lt;!&ndash;<div class="bottom3Row">&ndash;&gt;&ndash;&gt;-->
    <!--&lt;!&ndash;<van-popup style="border-radius: 10px" :style="{width:popupContentWidth}" v-model="showDeviceList">&ndash;&gt;-->
    <!--&lt;!&ndash;<DeviceList @editTitle="editTitle" @cancelPopup="showDeviceList=!showDeviceList"></DeviceList>&ndash;&gt;-->
    <!--&lt;!&ndash;</van-popup>&ndash;&gt;-->
    <!--&lt;!&ndash;<van-popup v-model="showPicker" position="bottom">&ndash;&gt;-->
    <!--&lt;!&ndash;<van-datetime-picker&ndash;&gt;-->
    <!--&lt;!&ndash;v-model="pickerTime"&ndash;&gt;-->
    <!--&lt;!&ndash;type="time"&ndash;&gt;-->
    <!--&lt;!&ndash;@confirm="pickerConfirm"&ndash;&gt;-->
    <!--&lt;!&ndash;@cancel="showPicker = false"&ndash;&gt;-->
    <!--&lt;!&ndash;/>&ndash;&gt;-->
    <!--&lt;!&ndash;</van-popup>&ndash;&gt;-->
    <!--&lt;!&ndash;<van-dialog v-model="editDialogShow" title="请输入设备名" :before-close="editBeforeClose"&ndash;&gt;-->
    <!--&lt;!&ndash;show-cancel-button>&ndash;&gt;-->
    <!--&lt;!&ndash;<van-field input-align="center" type="text" v-model="editValue" :placeholder="placeholder"/>&ndash;&gt;-->
    <!--&lt;!&ndash;</van-dialog>&ndash;&gt;-->
    <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
  import Vue from 'vue';
  import {Popup, Dialog, Toast, DatetimePicker, Field, Swipe, SwipeItem, Lazyload} from 'vant';
  import {mapState, mapMutations, mapActions} from 'vuex'
  import tools from './js/tools'
  // import DeviceList from '../components/DeviceList'
  // import mqttCmd from '../mqttCmd'
  // import wx from 'weixin-jsapi'
  // import companyConfig from '../CompanyConfig'

  Vue.use(Popup).use(Dialog).use(Toast).use(DatetimePicker).use(Field).use(Swipe).use(SwipeItem).use(Lazyload);
  export default {
    name: "index",
    // components: {DeviceList},
    data() {
      return {
        showPicker: false,
        pickerTime: null,//时间
        pickerTimeType: 0,//0净化倒计时，1消毒倒计时
        showJhCountDown: false,
        showXdCountDown: false,
        jhCountDownTimer: null,
        xdCountDownTimer: null,
        showTime: "10:00",
        showDate: "北京时间2019.10.01",
        // clickEnable: false,//除了设备切换按钮以外所有的设备是否可用点击
        showDeviceList: false,//显示设备列表
        statusText: "登录中",
        version: '版本号V-1.0.0',
        title: '成都子程电子',
        companyLogo:require('./img/index/2.0/logo/jwk-logo.png'),
        //  修改设备名
        editDialogShow: false,
        editValue: '',
        placeholder: '',
        editDeviceName: '',
        //  广告图片
        images: [
          require('./img/index/gg/a.png'),
          require('./img/index/gg/b.png'),
        ]
      }
    }, mounted() {
      this.showDateM();
    },
    methods: {
      ...mapMutations(['dStatus']),
      ...mapActions(['modifyTitle']),
      showDateM: function () {
        //创建一个时间日期对象
        let date = new Date();
        let year = date.getFullYear();
        let month = tools.lenFormat(date.getMonth() + 1 + "", 2);
        let day = tools.lenFormat(date.getDate() + "", 2);
        let hours = tools.lenFormat(date.getHours() + "", 2);
        let minutes = tools.lenFormat(date.getMinutes() + "", 2);
        // let seconds =  this.$tools.lenFormat(date.getSeconds()+"",2);
        let weekArray = ["日", "一", "二", "三", "四", "五", "六"];
        let week = weekArray[date.getDay()];
        this.showDate = "北京时间" + year + "." + month + "." + day;
        this.showTime = hours + " : " + minutes;
        setTimeout(() => {
          this.showDateM();
        }, 1000)
      },
      btnClick(type) {//按钮点击事件
        if (1 !== this.clickIsEnabled()) {//离线
          return;
        }
        switch (type) {
          case 0://风机
            if (0 === this.device.jhStatus && 0 === this.device.xdStatus) {
              Toast.fail("请先开启净化或消毒");
              return;
            }
            if (1 === this.device.fjStatus) {
              // this.$root.sendMSG(this.$root.topic, mqttCmd.setFj(2));
            } else if (2 === this.device.fjStatus) {
              // this.$root.sendMSG(this.$root.topic, mqttCmd.setFj(3));
            } else if (3 === this.device.fjStatus) {
              // this.$root.sendMSG(this.$root.topic, mqttCmd.setFj(1));
            }
            // else {
            //   this.$root.sendMSG(this.$root.topic, mqttCmd.setFj(1));
            // }
            break;
          case 1://增强
            if (0 === this.device.xdStatus) {
              Toast.fail("请先开启消毒");
              return;
            }
            if (1 === this.device.zqStatus) {//当前为开
              // this.$root.sendMSG(this.$root.topic, mqttCmd.setZq(0));
            } else {
              // this.$root.sendMSG(this.$root.topic, mqttCmd.setZq(1));
            }
            break;
          case 2://净化
            if (0 >= this.device.jhdjs) {
              this.pickerTimeType = 0;
              let xdgJhdjs = window.localStorage.getItem("xdg-jhdjs");
              if (xdgJhdjs) {
                this.pickerTime = xdgJhdjs;
              } else {
                this.pickerTime = "00:30";
              }
              this.showPicker = true;
            } else {
              this.$root.sendMSG(this.$root.topic, mqttCmd.enterAutoModel());
            }
            break;
          case 3:
            if (1 !== this.device.xdStatus || this.device.xddjs <= 0) {//关或自动模式的开
              this.pickerTimeType = 1;
              let xdgXddjs = window.localStorage.getItem("xdg-xddjs");
              if (xdgXddjs) {
                this.pickerTime = xdgXddjs;
              } else {
                this.pickerTime = "00:30";
              }
              this.showPicker = true;
            } else {//手动模式的开
              this.$root.sendMSG(this.$root.topic, mqttCmd.enterAutoModel());
            }
            break;
        }
      },
      setClick(type) {//功能设置点击事件
        if ((0 === type || 1 === type) && 1 !== this.clickIsEnabled()) {
          return;
        }
        switch (type) {
          case 0:
            this.$router.push("/superSet");
            break;
          case 1:
            this.$router.push("/sysSet");
            break;
          case 2:
            this.showDeviceList = true;
            break;
        }
      },
      clickIsEnabled() {//return 0离线 1在线手动
        //FIXME
        if (1 === this.device.status) {//设备在线
          return 1;
        } else {
          Toast.fail('设备离线');
          return 0;
        }
        return 1;
      },
      pickerConfirm(time) {
        console.log(time)
        if ("00:00" === time) {
          Toast.fail("无效的" + (0 === this.pickerTimeType ? '净化' : '消毒') + "时间！");
          return;
        }
        let times = time.split(":");
        let minute = parseInt(times[0]) * 60 * 60 + parseInt(times[1]) * 60;
        if (0 === this.pickerTimeType) {
          window.localStorage.setItem("xdg-jhdjs", time);
          this.$root.sendMSG(this.$root.topic, mqttCmd.setJh(minute));
        } else if (1 === this.pickerTimeType) {
          window.localStorage.setItem("xdg-xddjs", time);
          this.$root.sendMSG(this.$root.topic, mqttCmd.setXd(minute));
        }
        this.showPicker = false;
      },
      editTitle(item) {
        this.showDeviceList = false;
        this.editDeviceName = item.deviceName;
        this.editValue = item.deviceLocaton;
        this.editDialogShow = true;

      },
      editBeforeClose(action, done) {
        console.log(action)
        // if(action=='')
        if (action === 'cancel') {
          done();
          return;
        }
        if (this.editValue.length > 10) {
          Toast.fail("请输入小于十个字符的命名")
          done(false);
          return;
        }
        this.editDialogConfirm();
        done();
      },
      editDialogConfirm() {//提交修改设备名
        this.modifyTitle({
          deviceName: this.editDeviceName,
          deviceLocaton: this.editValue,
          userOpen: this.index.openId
        }).then(response => {
          Toast.success("修改设备名成功！");
        }).catch(error => {
          Toast.fail(error);
        });
      }
    },
    computed: {
      // ...mapState(['index', 'device']),
      popupContentWidth: function () {
        // let windowWidth = this.$tools.getWindowWidth();
        return (windowWidth > 400 ? 400 * .7 : windowWidth * .7) + 'px';
      },
      fjText() {
        // if (1 === this.device.fjStatus) {
        //   return "风机-低";
        // } else if (2 === this.device.fjStatus) {
        //   return "风机-中";
        // } else if (3 === this.device.fjStatus) {
        //   return "风机-高";
        // }
        return "风机";
      },
      fjIcon() {
        // if (1 === this.device.fjStatus) {
        //   return require('./img/index/2.0/index-fj-1.png');
        // } else if (2 === this.device.fjStatus) {
        //   return require('./img/index/2.0/index-fj-2.png');
        // } else if (3 === this.device.fjStatus) {
        //   return require('./img/index/2.0/index-fj-3.png');
        // }
        return require('./img/index/2.0/index-fj.png');
      },
      zqIcon() {
        // if (1 === this.device.zqStatus) {
        //   return require('./img/index/2.0/index-zq-on.png');
        // }
        return require('./img/index/2.0/index-zq.png');
      },
      jhIcon() {
        // if (0 !== this.device.jhStatus) {
        //   return require('./img/index/index-jh-on.png');
        // }
        return require('./img/index/index-jh.png');
      },
      xdIcon() {
        // if (0 !== this.device.xdStatus) {
        //   return require('./img/index/index-xd-on.png');
        // }
        return require('./img/index/index-xd.png');
      },
      changeDeviceIcon() {//返回设备切换图标
        // if (this.index.deviceList && this.index.currentDevice) {
        //   for (let i = 0; i < this.index.deviceList.length; i++) {
        //     let item = this.index.deviceList[i];
        //     if (item === this.index.currentDevice) {
        //       //  图标只支持最多三个设备
        //       return require('../assets/img/index/index-sb-qh-' + ((i + 1) % 4) + '.png');
        //     }
        //   }
        // } else {
        return require('./img/index/index-sb-qh.png');
        // }
      },
      changeDeviceText() {
        // if (this.index.deviceList && this.index.currentDevice) {
        //   for (let i = 0; i < this.index.deviceList.length; i++) {
        //     let item = this.index.deviceList[i];
        //
        //     if (item.deviceName === this.index.currentDevice) {
        //       //  图标只支持最多三个设备
        //       if (null == item.deviceLocaton) {
        //         return "未命名";
        //       }
        //       if (item.deviceLocaton.length > 4) {
        //         return item.deviceLocaton.substring(0, 4) + "..";
        //       }
        //       return item.deviceLocaton;
        //     }
        //   }
        // } else {
        //   return "设备切换";
        // }
      },
      statusTextC() {
        // if (-1 === this.device.status || 0 === this.device.status) {//登录中
        //   setTimeout(() => {
        //     if (-1 === this.device.status || 0 === this.device.status) {
        //       this.dStatus(this.device.status === -1 ? 0 : -1);
        //     }
        //   }, 800);
        //   if (this.statusText.indexOf('登录中') !== -1) {
        //     this.statusText = this.statusText.length < 6 ? this.statusText + "." : "登录中";
        //     return this.statusText;
        //   } else {
        //     return "登录中";
        //   }
        // } else if (1 === this.device.status) {
        //   return "设备在线";
        // } else if (2 === this.device.status) {
        return "设备离线";
        // }
      },
      jhCountDown() {//净化倒计时
        // if (this.device.jhdjs !== 0) {
        //   if (null != this.jhCountDownTimer) {
        //     clearTimeout(this.jhCountDownTimer);
        //   }
        //   this.jhCountDownTimer = setTimeout(() => {
        //     this.device.jhdjs--
        //   }, 1000);
        //   let hour = parseInt(this.device.jhdjs / (60 * 60) % 60);
        //   let minute = parseInt(this.device.jhdjs / 60 % 60);
        //   let second = this.device.jhdjs % 60;
        //   return this.$tools.lenFormat(hour + "", 2) + ":" + this.$tools.lenFormat(minute + "", 2) + ":" + this.$tools.lenFormat(second + "", 2)
        // }
      },
      xdCountDown() {//消毒倒计时
        // if (this.device.xddjs !== 0) {
        //   if (null != this.xdCountDownTimer) {
        //     clearTimeout(this.xdCountDownTimer);
        //   }
        //   this.xdCountDownTimer = setTimeout(() => {
        //     this.device.xddjs--
        //   }, 1000);
        //   let hour = parseInt(this.device.xddjs / (60 * 60) % 60);
        //   let minute = parseInt(this.device.xddjs / 60 % 60);
        //   let second = this.device.xddjs % 60;
        //   return this.$tools.lenFormat(hour + "", 2) + ":" + this.$tools.lenFormat(minute + "", 2) + ":" + this.$tools.lenFormat(second + "", 2)
        // }
      },
      jhCountDownListen() {
        return this.device.jhdjs;
      }, xdCountDownListen() {
        return this.device.xddjs;
      },
      lwxsBg() {
        // if (this.device.ghlw > 50) {
        //   return "#F0F9EB";
        // }
        return "#FEF0F0";
      },
      lwxsColor() {
        // if (this.device.ghlw > 50) {
        //   return "#67C23A";
        // }
        return "#F56C6C";
      },
      showAutoModel() {
        // if (this.device.jhdjs > 0 || this.device.xddjs > 0) {
        //   return false;
        // }
        return true;
      }
    },
    watch: {
      jhCountDownListen(newVal) {
        if (newVal <= 0) {
          this.showJhCountDown = false;
        } else {
          this.showJhCountDown = true;
        }
      }, xdCountDownListen(newVal) {
        if (newVal <= 0) {
          this.showXdCountDown = false;
        } else {
          this.showXdCountDown = true;
        }
      }
    }
  }
</script>

<style scoped>

  .content {
    display: flex;
    justify-content: center;
    font-size: 16px;
  }

  .app-window {
    width: 80%;
    background-color: white;
  }
  .company{
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

  .version{
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






  /*!*index*!*/
  /*.index {*/
  /*width: 100%;*/
  /*color: #34495e;*/
  /*display: flex;*/
  /*flex-direction: column;*/
  /*justify-content: space-between;*/
  /*font-size: .32rem;*/
  /*height: 100%;*/
  /*}*/

  /*!*tools*!*/
  /** {*/
  /*-webkit-touch-callout: none;*/
  /*-webkit-user-select: none;*/
  /*-khtml-user-select: none;*/
  /*-moz-user-select: none;*/
  /*-ms-user-select: none;*/
  /*user-select: none;*/
  /*}*/

  /*img {*/
  /*pointer-events: none;*/
  /*}*/

  /*!*取消ios点击阴影*!*/
  /** {*/
  /*-webkit-tap-highlight-color: transparent;*/
  /*}*/

  /*!*禁止div被点击*!*/
  /*.disable {*/
  /*pointer-events: none;*/
  /*}*/

  /*html, body {*/
  /*background: #fff;*/
  /*height: 100%;*/
  /*max-height: 900px;*/
  /*min-height: calc(2 * 100vw - 30px);*/
  /*!*position: relative*!*/
  /*}*/

  /*.dn {*/
  /*display: none !important;*/
  /*}*/

  /*.ui-loader {*/
  /*display: none !important;*/
  /*}*/

  /*.box {*/
  /*height: 100%*/
  /*}*/

  /*!*龙鱼阁和爱客水族的背景图片不一样*!*/
  /*!*爱客水族*!*/
  /*!*.wap_phone{width:100%; display:table; min-height:100px;background-image: url("../img/bg_top.png");*!*/
  /*!*background-repeat: no-repeat;background-size: 100% auto;-moz-background-size:100% auto;height: 100%!important;*!*/
  /*!*position: relative;font-family: '思源黑体R';}*!*/
  /*!*龙鱼阁*!*/
  /*.wap_phone {*/
  /*width: 100%;*/
  /*height: 100%;*/
  /*display: flex;*/
  /*flex-flow: column nowrap;*/
  /*!*display: table;*!*/
  /*!*min-height: 100px;*!*/
  /*!*!*background-image: url("../assets/img/index/bg-top.png");*!*!*/
  /*background-image: url("./img/index/index-bg-2.png");*/
  /*background-repeat: no-repeat;*/
  /*background-size: 100% auto;*/
  /*!*-moz-background-size: 100% auto;*!*/
  /*!*height: 100% !important;*!*/
  /*!*!*position: relative;*!*!*/
  /*!*font-family: '思源黑体R';*!*/
  /*}*/

  /*.center {*/
  /*width: 100%;*/
  /*display: table;*/
  /*position: relative;*/
  /*}*/

  /*.center .top {*/
  /*width: 100%;*/
  /*height: .6rem;*/
  /*}*/

  /*.center .top p {*/
  /*width: 100%;*/
  /*height: .6rem;*/
  /*text-align: center;*/
  /*line-height: .6rem;*/
  /*color: #fff;*/
  /*font-size: .24rem;*/
  /*background: #505050;*/
  /*}*/

  /*.center .title {*/
  /*position: absolute;*/
  /*right: 0;*/
  /*margin: 10px 20px 0 0;*/
  /*color: #4d585e;*/
  /*font-size: 0.3rem*/
  /*}*/

  /*.center .clock {*/
  /*margin: 10px 0 0 30px;*/
  /*color: #4d585e*/
  /*}*/

  /*.center .clock i {*/
  /*font-size: 0.7rem;*/
  /*line-height: 0.7rem;*/
  /*font-weight: bold*/
  /*}*/

  /*.center .clock b {*/
  /*font-size: 0.3rem*/
  /*}*/

  /*.currentTempBox {*/
  /*margin: 0 auto 0 auto;*/
  /*color: #474646;*/
  /*display: table;*/
  /*}*/

  /*.currentTempBox .circle {*/
  /*background-color: #58d4ed;*/
  /*border-radius: 100%;*/
  /*width: 2rem;*/
  /*height: 2rem;*/
  /*box-shadow: 0 0 0.7rem #58d4ed;*/
  /*display: inline-block;*/
  /*position: relative;*/
  /*text-align: center;*/
  /*}*/

  /*.currentTempBox .circle span {*/
  /*font-size: 1.1rem;*/
  /*line-height: 2rem;*/
  /*font-weight: bold*/
  /*}*/

  /*.currentTempBox .tempUnit {*/
  /*display: inline-block;*/
  /*position: absolute;*/
  /*margin: 0 0 -0.25rem -0.25rem;*/
  /*font-size: 0.33rem*/
  /*}*/

  /*.currentTempBox .text {*/
  /*padding-left: 0.7rem;*/
  /*font-size: 0.25rem;*/
  /*display: table-cell;*/
  /*vertical-align: middle*/
  /*}*/

  /*.btnBox {*/
  /*color: #4d585e;*/
  /*!*width: 80%;*!*/
  /*!*margin-left: 10%;*!*/
  /*position: relative*/
  /*}*/

  /*.btnBox .btnBar {*/
  /*display: flex;*/
  /*display: -webkit-flex;*/
  /*justify-content: space-around;*/
  /*}*/

  /*.btnBox .btnItem {*/
  /*display: flex;*/
  /*flex-flow: column nowrap;*/
  /*justify-content: center;*/
  /*align-items: center;*/
  /*!*color:#fff;*!*/
  /*}*/

  /*.btnBox img {*/
  /*height: 1.35rem*/
  /*}*/

  /*.btnBox .btnItem div {*/
  /*text-align: center;*/
  /*font-size: 0.3rem*/
  /*}*/

  /*.btnBox .indicatePoint {*/
  /*margin: 0.1rem auto 0 auto;*/
  /*display: table*/
  /*}*/

  /*.btnBox .indicatePoint .p1, .p2 {*/
  /*height: 0.2rem;*/
  /*width: 0.2rem;*/
  /*background-color: #e5e5e5;*/
  /*display: inline-block;*/
  /*padding: .1rem;*/
  /*border-radius: 100%;*/
  /*background-clip: content-box;*/
  /*}*/

  /*.btnBox .pSelect {*/
  /*background-color: #58d4ed !important;*/
  /*}*/

  /*.setBox {*/
  /*color: #474646;*/
  /*width: 80%;*/
  /*display: table;*/
  /*margin: 0 10% 0.3rem 10%;*/
  /*}*/

  /*.setBox .title {*/
  /*font-size: .45rem;*/
  /*margin-bottom: 0.32rem*/
  /*}*/

  /*.setBox .setBar {*/
  /*font-size: .28rem;*/
  /*display: flex;*/
  /*display: -webkit-flex;*/
  /*justify-content: space-between*/
  /*}*/

  /*.setBox .setItem {*/
  /*display: inline-block;*/
  /*text-align: center;*/
  /*}*/

  /*.setBox .setItem div {*/
  /*text-align: center;*/
  /*margin-top: 0.22rem*/
  /*}*/

  /*.setBox img {*/
  /*width: .9rem*/
  /*}*/

  /*.bottom3Row {*/
  /*height: 45%;*/
  /*width: 100%;*/
  /*display: flex;*/
  /*display: -webkit-flex;*/
  /*flex-flow: column nowrap;*/
  /*justify-content: space-between;*/
  /*position: absolute;*/
  /*bottom: 0*/
  /*}*/

  /*!*logo图片*!*/
  /*.logo-div {*/
  /*display: flex;*/
  /*justify-content: flex-end;*/
  /*}*/

  /*.logo-div img {*/
  /*height: 1.5rem;*/
  /*margin-right: 20px;*/
  /*}*/

  /*!**!*/
  /*.body {*/
  /*display: flex;*/
  /*flex-flow: column nowrap;*/
  /*flex: 1 0 0*/
  /*}*/

  /*!*广告*!*/
  /*.advertisement {*/
  /*flex: 1 0 0;*/
  /*}*/

  /*.advertisement-swipe {*/
  /*height: 100%;*/
  /*background-color: white;*/
  /*}*/

  /*.advertisement-swipe .van-swipe-item {*/
  /*height: 100%;*/
  /*display: flex;*/
  /*justify-content: center;*/
  /*align-items: center;*/
  /*!*overflow: hidden;*!*/
  /*}*/

  /*.advertisement-swipe .van-swipe-item img {*/
  /*height: 2rem;*/
  /*!*vertical-align: middle;*!*/
  /*}*/

  /*!*显示区域*!*/
  /*.displayArea {*/
  /*flex: 2 0 auto;*/
  /*display: flex;*/
  /*flex-flow: column nowrap;*/
  /*justify-content: center;*/
  /*}*/

  /*.displayArea .animateBody {*/
  /*display: flex;*/
  /*flex-flow: column nowrap;*/
  /*align-items: flex-start;*/
  /*}*/

  /*.displayArea .dItem {*/
  /*margin-left: 0.2rem;*/
  /*margin-top: .2rem;*/
  /*padding: 0.14rem .4rem .14rem .2rem;*/
  /*border-radius: .1rem;*/
  /*font-size: .3rem;*/
  /*display: flex;*/
  /*align-items: center;*/
  /*}*/

  /*.displayArea .dItem span {*/
  /*font-size: .5rem;*/
  /*margin: 0 .1rem;*/
  /*}*/

  /*.displayArea .ghlw {*/

  /*}*/

  /*.displayArea .gzsc {*/
  /*background-color: #FDF6EC;*/
  /*color: #E6A23C;*/
  /*}*/

  /*.displayArea .djs {*/
  /*background-color: #EDF2FC;*/
  /*color: #909399;*/
  /*}*/

  /*!*按钮区域*!*/
  /*.btnArea {*/
  /*flex: 2 0 auto;*/
  /*!*background-color: #50bc59;*!*/
  /*display: flex;*/
  /*flex-flow: column nowrap;*/
  /*justify-content: center;*/
  /*}*/

  /*!*功能区域*!*/
  /*.functionArea {*/
  /*flex: 1 0 auto;*/
  /*!*background-color: #3d99bc;*!*/
  /*display: flex;*/
  /*}*/

  /*.fbody {*/
  /*align-self: flex-end;*/
  /*color: #474646;*/
  /*width: 80%;*/
  /*margin: 0 10% 0.3rem 10%;*/
  /*}*/

  /*.fbody .title {*/
  /*font-size: .45rem;*/
  /*margin-bottom: 0.32rem*/
  /*}*/

  /*.fbody .setBar {*/
  /*width: 100%;*/
  /*font-size: .28rem;*/
  /*display: flex;*/
  /*display: -webkit-flex;*/
  /*justify-content: space-between*/
  /*}*/

  /*.fbody .setItem {*/
  /*display: inline-block;*/
  /*text-align: center;*/
  /*}*/

  /*.fbody .setItem div {*/
  /*text-align: center;*/
  /*margin-top: 0.22rem*/
  /*}*/

  /*.fbody img {*/
  /*width: .9rem*/
  /*}*/

  /*.displayArea .dItem {*/
  /*transition: all 1s;*/
  /*}*/

  /*.display-bar-list-enter-active {*/
  /*transition: all 1s ease;*/
  /*}*/

  /*.display-bar-list-leave-active {*/
  /*transition: all 1s ease;*/
  /*}*/

  /*.display-bar-list-enter, .display-bar-list-leave-to*/
  /*!* .display-bar-list-leave-active for below version 2.1.8 *!*/
  /*{*/
  /*opacity: 0;*/
  /*transform: translateY(2rem);*/
  /*}*/

  /*.display-bar-list-leave-active {*/
  /*position: absolute;*/
  /*}*/


</style>
