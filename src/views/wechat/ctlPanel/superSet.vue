<template>
  <ViewBeginAndEnd @changeView="changeView">
    <div slot="content" class="content">
      <van-button class="cItem" type="primary" block @click="btnEvent(0)">更换滤网</van-button>
      <van-button class="cItem" type="info" block @click="btnEvent(1)">设置工作时长</van-button>
      <van-dialog v-model="editDialogShow" :title="placeholder" show-cancel-button @confirm="editDialogConfirm()">
        <van-field v-model="editValue" input-align="center" type="number" :placeholder="placeholder" />
      </van-dialog>
    </div>
  </ViewBeginAndEnd>
</template>

<script>
import ViewBeginAndEnd from './slot/ViewBeginAndEnd'
import Vue from 'vue'
import { Button, Dialog, Field, Toast } from 'vant'
import { mapState } from 'vuex'
import mqttCmd from './js/mqttCmd'

Vue.use(Button).use(Dialog).use(Field).use(Toast)
export default {
  name: 'SuperSet',
  components: { ViewBeginAndEnd },
  data() {
    return {
      editDialogShow: false,
      editValue: 1000, // 输入框值
      placeholder: '',
      setType: 0// 0更换滤网，1设置工作时长
    }
  },
  methods: {
    editDialogConfirm() {
      if (/^[0-9]+$/.test(this.editValue)) {
        const editVal = parseInt(this.editValue)
        if (editVal >= 0 && editVal <= 9999) {
          if (this.setType === 0) {
            this.$emit('sendMsg', mqttCmd.setLwsm(editVal))
          } else {
            this.$emit('sendMsg', mqttCmd.setGzsc(editVal))
          }
        } else {
          Toast.fail('请输入0-99999有效参数！')
        }
      } else {
        Toast.fail('参数只能是数字！')
      }
    },
    btnEvent(type) {
      this.setType = type
      switch (type) {
        case 0:
          this.placeholder = '请输入滤网寿命（小时）'
          this.editValue = this.device.ghlw
          break
        case 1:
          this.placeholder = '请输入设备工作总时间（小时）'
          this.editValue = this.device.gzsc
          break
      }
      this.editDialogShow = true
    },
    changeView() { // 返回首页
      this.$emit('changeView', 0)
    }
  },
  computed: {
    ...mapState('device', ['device'])
  }
}
</script>

<style scoped>
  .content {
    height: 100%;
    overflow: scroll;
    padding: 0 6%;
    width: 80%;
    max-width: 420px;
    background-color: white;
  }

  .content::-webkit-scrollbar {
    display: none
  }

  .content .cItem {
    margin-top: 20px;
    font-size: 16px;

  }
</style>
