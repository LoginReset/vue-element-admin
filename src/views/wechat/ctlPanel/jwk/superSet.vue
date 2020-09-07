<template>
  <!-- <ViewBeginAndEnd @changeView="changeView"> -->
  <div slot="content" class="content">
    <el-button type="primary" @click="setBtn(0)">更换滤网</el-button>
    <el-button type="success" @click="setBtn(1)">设置工作时长</el-button>
    <el-dialog :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item v-if="dialogStatus === 'filter-mesh'" label="更换滤网" prop="filterMesh">
          <el-input v-model="temp.filterMesh" placeholder="请输入滤网寿命" />
        </el-form-item>

        <el-form-item v-if="dialogStatus ==='time'" label="设置工作时长" prop="time">
          <el-input v-model="temp.time" placeholder="设置工作时长" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editDialogConfirm">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- <van-button class="cItem" type="primary" block @click="btnEvent(0)">更换滤网</van-button>
      <van-button class="cItem" type="info" block @click="btnEvent(1)">设置工作时长</van-button>
      <van-dialog v-model="editDialogShow" :title="placeholder" show-cancel-button @confirm="editDialogConfirm()">
        <van-field v-model="editValue" input-align="center" type="number" :placeholder="placeholder" />
    </van-dialog>-->
  </div>
  <!-- </ViewBeginAndEnd> -->
</template>

<script>
import ViewBeginAndEnd from '../slot/ViewBeginAndEnd'
import Vue from 'vue'
import { Button, Dialog, Field, Toast } from 'vant'
import { mapState } from 'vuex'
import mqttCmd from '../js/mqttCmd'

Vue.use(Button).use(Dialog).use(Field).use(Toast)
export default {
  name: 'SuperSet',
  components: { ViewBeginAndEnd },
  data() {
    var filterValid = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('滤网寿命必填'))
      }
      if (!/^[0-9]+$/.test(value)) {
        return callback(new Error('必须是数字'))
      }
      if (parseInt(value) > 9999 || parseInt(value) < 0) {
        return callback(new Error('请输入[0,9999]有效参数'))
      }
      callback()
    }
    return {
      editDialogShow: false,
      editValue: 1000, // 输入框值
      placeholder: '',
      setType: 0, // 0更换滤网，1设置工作时长

      temp: {
        time: 0,
        filterMesh: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        filterMesh: [{ validator: filterValid, trigger: 'change' }]
      }
    }
  },
  methods: {
    setBtn(type) {
      if (type === 0) {
        this.dialogStatus = 'filter-mesh'
        this.filterMesh = this.device.ghlw
      } else {
        this.dialogStatus = 'time'
        this.time = this.device.gzsc
      }
      this.dialogFormVisible = true
    },

    // 分割线
    editDialogConfirm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dialogStatus === 'filter-mesh') {
            this.$emit('sendMsg', mqttCmd.setLwsm(this.temp.filterMesh))
          } else {
            this.$emit('sendMsg', mqttCmd.setGzsc(this.temp.time))
          }
          this.dialogFormVisible = false
        }
      })
    }
    // btnEvent(type) {
    //   this.setType = type;
    //   switch (type) {
    //     case 0:
    //       this.placeholder = "请输入滤网寿命（小时）";
    //       this.editValue = this.device.ghlw;
    //       break;
    //     case 1:
    //       this.placeholder = "请输入设备工作总时间（小时）";
    //       this.editValue = this.device.gzsc;
    //       break;
    //   }
    //   this.editDialogShow = true;
    // },
    // changeView() {
    //   // 返回首页
    //   this.$emit("changeView", 0);
    // },
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
  display: none;
}

.content .cItem {
  margin-top: 20px;
  font-size: 16px;
}
</style>
