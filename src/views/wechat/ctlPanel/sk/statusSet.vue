<template>
  <div slot="content" class="content">
    <div class="title">工作时长</div>
    <!-- <template>
      <div class="item">
        <div class="itemTitle">设备工作时长：</div>
        <div class="itemTime">1小时</div>
        <el-button size="mini" type="success">重置</el-button>
      </div>
    </template>-->
    <div class="work-time">
      <div class="item">
        <div class="itemTitle">设备工作时长：</div>
        <div class="itemTime">1小时</div>
        <el-button size="mini" type="success">重置</el-button>
      </div>
      <div class="item">
        <div class="itemTitle">滤网使用时长：</div>
        <div class="itemTime">1小时</div>
        <el-button size="mini" type="success">重置</el-button>
      </div>
      <div class="item">
        <div class="itemTitle">紫外线灯管使用时长：</div>
        <div class="itemTime">1小时</div>
        <el-button size="mini" type="success">重置</el-button>
      </div>
      <div class="item">
        <div class="itemTitle">等离子使用时长：</div>
        <div class="itemTime">1小时</div>
        <el-button size="mini" type="success">重置</el-button>
      </div>
      <div class="item">
        <div class="itemTitle">臭氧使用时长：</div>
        <div class="itemTime">1小时</div>
        <el-button size="mini" type="success">重置</el-button>
      </div>
    </div>
    <div class="title">设备状态</div>

    <div class="device-status">
      <div class="item">
        <div class="itemTitle">低风状态</div>
        <el-button size="mini" type="success">正常</el-button>
      </div>
      <div class="item">
        <div class="itemTitle">中风状态</div>
        <el-button size="mini" type="danger">故障</el-button>
      </div>
      <div class="item">
        <div class="itemTitle">高风状态</div>
        <el-button size="mini" type="success">正常</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Button, Dialog, Field, Toast } from 'vant'
import { mapState } from 'vuex'
import mqttCmd from '../js/mqttCmd'

Vue.use(Button).use(Dialog).use(Field).use(Toast)
export default {
  name: 'StatusSet',
  components: {},
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
        filterMesh: 1
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
      } else {
        this.dialogStatus = 'time'
      }
      this.dialogFormVisible = true
    },

    // 分割线
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
    changeView() {
      // 返回首页
      this.$emit('changeView', 0)
    }
  },
  computed: {
    ...mapState('device', ['device'])
  }
}
</script>

<style scoped>
.title {
  font-size: 16px;
  font-weight: bold;
  text-align: center;

  margin-bottom: 20px;
}
.item {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  margin-bottom: 20px;
}
.itemTitle {
  /* display: flex; */
  flex: 3 0 0;
}
.itemTime {
  /* display: flex; */
  flex: 1 0 auto;
}
.item span {
  margin-left: 30px;
}
.device-status {
  margin-top: 20px;
}
.el-button {
  float: right;
}
.content {
  height: 100%;
  overflow: scroll;
  padding: 0 6%;
  width: 100%;
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
