<template>
  <div slot="content" class="content">
    <div>
      <div style="text-align:center;font-size:16px;font-weight:bold;">消毒时段</div>
      <div class="tab-content">
        <div class="tc-item">
          <div class="tci-title">第一组定时</div>
          <div class="tci-time">
            <div class="tcit-item">
              <div class="tciti-text">开始时间</div>
              <div class="tciti-time" @click="setTime(0,0)">{{ g0i0 }}</div>
            </div>
            <div class="tcit-item end-time">
              <div class="tciti-text">结束时间</div>
              <div class="tciti-time" @click="setTime(0,1)">{{ g0i1 }}</div>
            </div>
          </div>
        </div>
        <div class="tc-item">
          <div class="tci-title">第二组定时</div>
          <div class="tci-time">
            <div class="tcit-item">
              <div class="tciti-text">开始时间</div>
              <div class="tciti-time" @click="setTime(0,2)">{{ g0i2 }}</div>
            </div>
            <div class="tcit-item end-time">
              <div class="tciti-text">结束时间</div>
              <div class="tciti-time" @click="setTime(0,3)">{{ g0i3 }}</div>
            </div>
          </div>
        </div>
        <div class="tc-item">
          <div class="tci-title">第三组定时</div>
          <div class="tci-time">
            <div class="tcit-item">
              <div class="tciti-text">开始时间</div>
              <div class="tciti-time" @click="setTime(0,4)">{{ g0i4 }}</div>
            </div>
            <div class="tcit-item end-time">
              <div class="tciti-text">结束时间</div>
              <div class="tciti-time" @click="setTime(0,5)">{{ g0i5 }}</div>
            </div>
          </div>
        </div>
        <div class="tc-item">
          <div class="tci-title">第四组定时</div>
          <div class="tci-time">
            <div class="tcit-item">
              <div class="tciti-text">开始时间</div>
              <div class="tciti-time" @click="setTime(0,6)">{{ g0i6 }}</div>
            </div>
            <div class="tcit-item end-time">
              <div class="tciti-text">结束时间</div>
              <div class="tciti-time" @click="setTime(0,7)">{{ g0i7 }}</div>
            </div>
          </div>
        </div>
        <div class="tc-item">
          <div class="tci-title">第五组定时</div>
          <div class="tci-time">
            <div class="tcit-item">
              <div class="tciti-text">开始时间</div>
              <div class="tciti-time" @click="setTime(0,8)">{{ g0i8 }}</div>
            </div>
            <div class="tcit-item end-time">
              <div class="tciti-text">结束时间</div>
              <div class="tciti-time" @click="setTime(0,9)">{{ g0i9 }}</div>
            </div>
          </div>
        </div>
        <div class="tc-item">
          <div class="tci-title">第六组定时</div>
          <div class="tci-time">
            <div class="tcit-item">
              <div class="tciti-text">开始时间</div>
              <div class="tciti-time" @click="setTime(0,10)">{{ g0i10 }}</div>
            </div>
            <div class="tcit-item end-time">
              <div class="tciti-text">结束时间</div>
              <div class="tciti-time" @click="setTime(0,11)">{{ g0i11 }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btnBox">
      <van-button color="#1abc9c" type="primary" block @click="setDefTime">默认时段</van-button>
      <div class="empty-div" />
      <van-button color="#2980b9" type="primary" block @click="saveTime">保存时段</van-button>
    </div>

    <van-popup v-model="showPicker" position="bottom">
      <van-datetime-picker
        v-model="pickerTime"
        type="time"
        @confirm="pickerConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import Vue from 'vue'
import { Tab, Tabs, DatetimePicker, Field, Button, Toast } from 'vant'
import ViewBeginAndEnd from '../slot/ViewBeginAndEnd'
import { mapState, mapMutations } from 'vuex'
import mqttCmd from '../js/mqttCmd'

Vue.use(Tabs).use(Tab).use(DatetimePicker).use(Field).use(Button)
export default {
  name: 'SysSet',
  components: {
    ViewBeginAndEnd
  },
  data() {
    return {
      pickerTime: '12:00',
      showPicker: false,
      currentFieldIndex: null, // 当前选择时间的下标 [0/1,0-5]
      currentTabsIndex: 0, // tab的下标 0净化时段 1消毒时段
      // jhDef: ['08', '00', '09', '00', '12', '00', '13', '00', '20', '00', '21', '00'],//净化默认时段
      xdDef: [
        '08',
        '00',
        '08',
        '30',
        '10',
        '00',
        '10',
        '30',
        '13',
        '00',
        '13',
        '30',
        '17',
        '00',
        '17',
        '30',
        '19',
        '00',
        '19',
        '30',
        '22',
        '00',
        '22',
        '30'
      ] // 消毒默认时段
    }
  },
  mounted() {
    this.$emit('sendMsg', mqttCmd.getCmdTime())
  },
  methods: {
    ...mapMutations('device', ['jhTime', 'xdTime', 'jhTimeAll', 'xdTimeAll']),
    tabsClick(name, title) {
      // name即index
      // this.currentTabsIndex = name;
      // console.log(name)
      // if (0 === name) {
      //   this.$root.sendMSG(this.$root.topic, mqttCmd.getCmdTime(0));
      // } else if (1 === name) {
      //   this.$root.sendMSG(this.$root.topic, mqttCmd.getCmdTime(1));
      // }
    },
    checkedTime() {
      // 检查结束时间
      for (let i = 0; i < this.device.xdTime.length / 4; i++) {
        let begin1, begin2, end1, end2 // 开始时间时，开始时间分，结束时间时，结束时间分
        begin1 = this.device.xdTime[i * 4]
        begin2 = this.device.xdTime[i * 4 + 1]
        end1 = this.device.xdTime[i * 4 + 2]
        end2 = this.device.xdTime[i * 4 + 3]
        if (
          (end1 === '00' && end2 === '00') ||
          (begin1 === '00' && begin2 === '00')
        ) {
          continue
        }
        if (parseInt(end1) > parseInt(begin1)) {
          continue
        }
        if (parseInt(end1) === parseInt(begin1)) {
          if (parseInt(end2) > parseInt(begin2)) {
            continue
          }
        }
        return false
      }
      return true
      // let gIndex = this.currentFieldIndex[0];//0/1
      // let iIndex = this.currentFieldIndex[1];//0-5
      // let begin1, begin2, end1, end2;
      // let times = time.split(":");
      // if (iIndex % 2 === 1) {//结束时间段设置 ，需要检查
      //   end1 = times[0];
      //   end2 = times[1];
      //   // if (0 === gIndex) {//净化
      //   //   begin1 = this.device.jhTime[(iIndex - 1) * 2];
      //   //   begin2 = this.device.jhTime[(iIndex - 1) * 2 + 1];
      //   // } else if (1 === gIndex) {
      //     begin1 = this.device.xdTime[(iIndex - 1) * 2];
      //     begin2 = this.device.xdTime[(iIndex - 1) * 2 + 1];
      //   // }
      //   // if (parseInt(end1) > parseInt(begin1)) {
      //   //   return true;
      //   // }
      //   // if (parseInt(end1) === parseInt(begin1)) {
      //   //   if (parseInt(end2) > parseInt(begin2)) {
      //   //     return true;
      //   //   }
      //   // }
      //   // return false;
      // } else {
      //   begin1 = times[0];
      //   begin2 = times[1];
      //   // if (0 === gIndex) {//净化
      //   //   end1 = this.device.jhTime[(iIndex + 1) * 2];
      //   //   end2 = this.device.jhTime[(iIndex + 1) * 2 + 1];
      //   // } else if (1 === gIndex) {
      //     end1 = this.device.xdTime[(iIndex + 1) * 2];
      //     end2 = this.device.xdTime[(iIndex + 1) * 2 + 1];
      //   // }
      // }
      //
      // if ((end1 === "00" && "00" === end2) || (begin1 === "00" && "00" === begin2)) {
      //   return true;
      // }
      // if (parseInt(end1) > parseInt(begin1)) {
      //   return true;
      // }
      // if (parseInt(end1) === parseInt(begin1)) {
      //   if (parseInt(end2) > parseInt(begin2)) {
      //     return true;
      //   }
      // }
      // return false;
    },
    pickerConfirm(time) {
      // 时间选择器确认事件
      // if (0 === this.currentFieldIndex[0]) {
      //   this.jhTime({index: this.currentFieldIndex[1], val: time})
      // } else if (1 === this.currentFieldIndex[0]) {
      this.xdTime({ index: this.currentFieldIndex[1], val: time })
      // }
      this.showPicker = false
    },
    setTime(gIndex, iIndex) {
      // 设置时间
      // if (0 === gIndex) {//净化
      //   if (!this.device.jhTime) {
      //     this.jhTime({index: iIndex, val: "00:00"})
      //   }
      //   this.pickerTime = this.device.jhTime[iIndex * 2] + ":" + this.device.jhTime[iIndex * 2 + 1];
      // } else if (1 === gIndex) {//消毒
      if (!this.device.xdTime) {
        this.xdTime({ index: iIndex, val: '00:00' })
        this.pickerTime = ''
      }
      this.pickerTime =
        this.device.xdTime[iIndex * 2] +
        ':' +
        this.device.xdTime[iIndex * 2 + 1]
      // }
      this.currentFieldIndex = [gIndex, iIndex]
      this.showPicker = true
    },
    setDefTime() {
      // 设置默认时段
      this.xdTimeAll(this.xdDef)
    },
    saveTime() {
      // 保存时段
      if (!this.checkedTime()) {
        Toast.fail('结束时间应当大于开始时间')
        return
      }
      this.$emit('sendMsg', mqttCmd.setXdTime(this.device.xdTime))
    },
    changeView() {
      this.$emit('changeView', 0)
    }
  },
  computed: {
    ...mapState('device', ['device']),
    g0i0: function() {
      if (
        this.device.xdTime &&
        this.device.xdTime[0] &&
        this.device.xdTime[1]
      ) {
        return this.device.xdTime[0] + ':' + this.device.xdTime[1]
      }
      return '00:00'
    },
    g0i1: function() {
      if (
        this.device.xdTime &&
        this.device.xdTime[2] &&
        this.device.xdTime[3]
      ) {
        return this.device.xdTime[2] + ':' + this.device.xdTime[3]
      }
      return '00:00'
    },
    g0i2: function() {
      if (
        this.device.xdTime &&
        this.device.xdTime[4] &&
        this.device.xdTime[5]
      ) {
        return this.device.xdTime[4] + ':' + this.device.xdTime[5]
      }
      return '00:00'
    },
    g0i3: function() {
      if (
        this.device.xdTime &&
        this.device.xdTime[6] &&
        this.device.xdTime[7]
      ) {
        return this.device.xdTime[6] + ':' + this.device.xdTime[7]
      }
      return '00:00'
    },
    g0i4: function() {
      if (
        this.device.xdTime &&
        this.device.xdTime[8] &&
        this.device.xdTime[9]
      ) {
        return this.device.xdTime[8] + ':' + this.device.xdTime[9]
      }
      return '00:00'
    },
    g0i5: function() {
      if (
        this.device.xdTime &&
        this.device.xdTime[10] &&
        this.device.xdTime[11]
      ) {
        return this.device.xdTime[10] + ':' + this.device.xdTime[11]
      }
      return '00:00'
    },
    g0i6: function() {
      if (
        this.device.xdTime &&
        this.device.xdTime[12] &&
        this.device.xdTime[13]
      ) {
        return this.device.xdTime[12] + ':' + this.device.xdTime[13]
      }
      return '00:00'
    },
    g0i7: function() {
      if (
        this.device.xdTime &&
        this.device.xdTime[14] &&
        this.device.xdTime[15]
      ) {
        return this.device.xdTime[14] + ':' + this.device.xdTime[15]
      }
      return '00:00'
    },
    g0i8: function() {
      if (
        this.device.xdTime &&
        this.device.xdTime[16] &&
        this.device.xdTime[17]
      ) {
        return this.device.xdTime[16] + ':' + this.device.xdTime[17]
      }
      return '00:00'
    },
    g0i9: function() {
      if (
        this.device.xdTime &&
        this.device.xdTime[18] &&
        this.device.xdTime[19]
      ) {
        return this.device.xdTime[18] + ':' + this.device.xdTime[19]
      }
      return '00:00'
    },
    g0i10: function() {
      if (
        this.device.xdTime &&
        this.device.xdTime[20] &&
        this.device.xdTime[21]
      ) {
        return this.device.xdTime[20] + ':' + this.device.xdTime[21]
      }
      return '00:00'
    },
    g0i11: function() {
      if (
        this.device.xdTime &&
        this.device.xdTime[22] &&
        this.device.xdTime[23]
      ) {
        return this.device.xdTime[22] + ':' + this.device.xdTime[23]
      }
      return '00:00'
    },
    onMqttConnected: function() {
      return this.$root.mqConnected
    }
  },
  watch: {
    onMqttConnected: function(newVal) {
      if (newVal) {
        this.$emit('sendMsg', mqttCmd.getCmdTime())
      }
    }
  }
}
</script>

<style scoped>
.content {
  max-width: 420px;
  height: 100%;
  overflow: scroll;
  padding: 0 6%;
  width: 80%;
  background-color: white;
}

.content::-webkit-scrollbar {
  display: none;
}

.tc-item {
  padding: 5% 0;
  display: flex;
  flex: 1 0 0;
  align-items: center;
}

.tci-title {
  flex: 1 0 0;
}

.tci-time {
  padding: 0 5%;
  flex: 2 0 0;
  display: flex;
  flex-flow: column nowrap;
  border-width: 0 0 0 1px;
  border-style: solid;
  border-color: #b5b5b5;
}

.tcit-item {
  display: flex;
  align-items: center;
}

.tcit-item .tciti-text {
  flex: 0 0 auto;
  padding-right: 10px;
}

.tcit-item .tciti-time {
  flex: 1 0 0;
  text-align: center;
  background-color: #dedede;
  border: 1px solid gray;
  padding: 2px;
}

.tci-time .end-time {
  margin-top: 5%;
}

.btnBox {
  display: flex;
  margin-top: 8%;
  margin-bottom: 5%;
}

.van-button {
  flex: 10 0 0;
  border-radius: 4px;
}

.empty-div {
  flex: 1 0 0;
}

.dev-company {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  font-size: 14px;
  color: #000;
}

.dev-company img {
  height: 14px;
}
</style>
