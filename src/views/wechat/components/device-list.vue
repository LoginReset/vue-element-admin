<template>
  <el-row>
    <el-col :md="24" :lg="14">
      <!--<div class="c-item device-list">-->
      <div class="app-container">
        <div class="filter-container">
          <el-input
            v-model="listQuery.deviceNumber"
            placeholder="设备编号"
            style="width: 200px;"
            class="filter-item"
            clearable
            @keyup.enter.native="handleFilter"
          />
          <el-input
            v-model="listQuery.deviceName"
            placeholder="设备deviceName"
            style="width: 200px;"
            class="filter-item"
            clearable
            @keyup.enter.native="handleFilter"
          />
          <el-input
            v-model="listQuery.title"
            placeholder="设备名"
            style="width: 200px;"
            class="filter-item"
            clearable
            @keyup.enter.native="handleFilter"
          />
          <!--<el-input-->
          <!--v-model="listQuery.username"-->
          <!--placeholder="用户名"-->
          <!--style="width:200px"-->
          <!--class="filter-item"-->

          <!--@keyup.enter.native="handleFilter"/>-->

          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            {{ $t('table.search') }}
          </el-button>
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="success"
            icon="el-icon-refresh"
            @click="getList"
          >{{ $t('table.refresh') }}
          </el-button>
        </div>
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          row-key="openId"
          @sort-change="sortChange"
        >
          <el-table-column label="序号" prop="id" align="center" type="index" width="50"/>
          <el-table-column label="编号" align="center">
            <template slot-scope="{row}">
              <span>{{ row.deviceNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="设备名" align="center">
            <template slot-scope="{row}">
              <span>{{ row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="appKey" align="center">
            <template slot-scope="{row}">
              <span>{{ row.appKey }}</span>
            </template>
          </el-table-column>
          <el-table-column label="deviceName" align="center">
            <template slot-scope="{row}">
              <span>{{ row.deviceName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" sortable="custom" prop="create_date">
            <template slot-scope="{row}">
              <span>{{ row.createDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
            <template slot-scope="{row,$index}">
              <el-button
                class="filter-item"
                size="mini"
                icon="el-icon-check"
                type="success"
                @click="selectDev(row)"
              >选择设备
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList"
        />
        <!--添加 更新-->
        <!--<el-dialog title="edit" :visible.sync="dialogFormVisible">-->
        <!--<el-form-->
        <!--ref="dataForm"-->
        <!--:rules="rules"-->
        <!--:model="temp"-->
        <!--label-position="left"-->
        <!--label-width="80px"-->
        <!--style="width: 400px; margin-left:50px;"-->
        <!--&gt;-->
        <!--<el-form-item label="地址" prop="address">-->
        <!--<el-input v-model="temp.address" clearable placeholder="请输入地址"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="手机号" prop="phone">-->
        <!--<el-input v-model="temp.phone" clearable placeholder="请输入手机号"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="用户名" prop="username">-->
        <!--<el-input v-model="temp.username" clearable placeholder="请输入用户名"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="地址" prop="province">-->
        <!--<el-cascader-->
        <!--v-model="province"-->
        <!--:options="provinceList"-->
        <!--:props="provinceProps"-->
        <!--@change="handleChange"-->
        <!--/>-->
        <!--</el-form-item>-->

        <!--</el-form>-->
        <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click="dialogFormVisible = false">-->
        <!--{{ $t('table.cancel') }}-->
        <!--</el-button>-->
        <!--<el-button type="primary" @click="updateData()">-->
        <!--{{ $t('table.confirm') }}-->
        <!--</el-button>-->
        <!--</div>-->
        <!--</el-dialog>-->

      </div>
      <!--</div>-->
    </el-col>
    <el-col :md="24" :lg="10">
      <ctl-panel v-if="0===type" @changeView="changeView" @sendMsg="sendMsg"/>
      <super-set v-if="1===type" @changeView="changeView" @sendMsg="sendMsg"/>
      <sys-set v-if="2===type" @changeView="changeView" @sendMsg="sendMsg"/>
    </el-col>
  </el-row>
</template>

<script>
  import {getList} from '@/api/device'
  import waves from '@/directive/waves' // waves directive
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import PButton from '@/components/PermissionBtn'
  import {hasBtnPermission} from '@/utils/permission'
  import CtlPanel from '@/views/wechat/ctlPanel'
  import SuperSet from '@/views/wechat/ctlPanel/superSet'
  import SysSet from '@/views/wechat/ctlPanel/sysSet'

  import {mapState, mapMutations, mapActions} from 'vuex'
  import Vue from 'vue'
  import {Dialog, Toast} from 'vant'

  Vue.use(Dialog).use(Toast)
  import mqtt from 'mqtt'
  import tools from '../ctlPanel/js/tools'
  import mqttCmd from '../ctlPanel/js/mqttCmd'

  let client
  const debug = true// TODO
  const options = {
    connectTimeout: 40000,
    clientId: 'mqtitId-Home',
    username: 'MQTT_USERNAME',
    password: 'MQTT_PASSWORD',
    clean: true
  }

  export default {
    name: 'DeviceList',
    components: {Pagination, PButton, CtlPanel, SuperSet, SysSet},
    directives: {waves},
    data() {
      return {
        province: [],
        provinceList: [],
        provinceProps: {
          value: 'uuid',
          label: 'provinceName',
          children: 'areas'
        },
        name: '',
        tableKey: 0,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          deviceNumber: undefined,
          deviceName: undefined,
          title: undefined,
          orderType: undefined,
          orderField: undefined
        },
        // temp: {
        //   openId: undefined,
        //   nickname: undefined,
        //   username: undefined,
        //   headimgurl: '',
        //   address: undefined,
        //   phone: undefined
        // },
        // rules: {
        //   address: [{
        //     required: true, message: '地址必填', trigger: 'change'
        //   }],
        //   phone: [{
        //     required: true, pattern: /^1[3456789]\d{9}$/, message: '请选择正确手机号', trigger: 'change'
        //   }],
        //   username: [{
        //     required: true, message: '用户名必填', trigger: 'change'
        //   }]
        // },
        // dialogFormVisible: false,
        //  控制面板
        type: 0,
        pubTopic: null,
        subTopic: null,
        sendHeartbeatTimer: null, // 发送心跳定时器
        monitorDeviceStatusTimer: null, // 监听设备状态定时器
        lastReceiveMsgTs: 0, // 上一次收到消息的时间戳 单位：秒
        heartbeatInterval: 6000, // 发送心跳频率
        firstOfflineTimer: null, // 登录成功后没有收到消息定时器，解决没有收到任何消息一直处于登录中的问题
        firstOfflineTimeout: 3000// 倒计时三秒
      }
    },
    created() {
      this.getList();
      this.loginMqtt();
    },
    methods: {
      ...mapMutations('device', ['dStatus', 'fjStatus', 'zqStatus', 'jhdjs', 'xddjs', 'jhTimeAll', 'xdTimeAll', 'setDevice', 'ghlw', 'gzsc']),
      ...mapActions('device', ['userInfo']),
      // mqtt begin
      loginMqtt() { // 登录
        this.userInfo().then(() => {
          options.clientId = this.index.deviceName
          options.username = this.index.appKey
          options.password = this.index.deviceSecret
          console.log(options)
          client = mqtt.connect('ws://www.cdxdkj.com.cn:8083/mqtt', options)
          this.mqttMSG()
        }).catch(error => {
          Dialog({message: error})
        })
      },
      mqttMSG() {
        // mqtt连接
        client.on('connect', (e) => {
          console.log('连接成功:')
          this.sendHeartbeat()
          this.monitorDeviceStatus()
          // if (this.index.currentDevice) {//存在目标
          //
          // } else {
          this.dStatus(3)
          // }
        })
        // 接收消息处理
        client.on('message', (topic, message) => {
          try {
            if (debug) {
              console.log('收到topic=', topic, '的消息=', message)
            }
            const deviceName = topic.split('/')[2].split('&')[0]
            // 验证是是否是当前设备的指令
            if (this.index.currentDevice !== deviceName) {
              return
            }
            this.lastReceiveMsgTs = new Date().getTime() / 1000
            if (message.toString() === 'online') { // online 设备在线 [111, 102, 102, 108, 105, 110, 101]
              this.dStatus(1)
              return
            } else if (message.toString() === 'offline') { // offline 设备离线 [111, 110, 108, 105, 110, 101]
              this.dStatus(2)
              return
            }
            if (message[0] === 0x20 && message[1] === 0x20 && message[2] === 0x05 && message[3] === 0x17 &&
              message.length === parseInt(message[4].toString(16) + tools.formatLengthTox(message[5].toString(16), 2), 16)) { // 包头验证
              if (message[6] === 0x10 && message[7] === 0x00 && message[8] === 0x14) { // 心跳反馈指令
                const version = message[9]
                const checkedStatus = message[10]
                const fjStatus = message[11]
                const zqStatus = message[12]
                const jhStatus = message[13]
                const xdStatus = message[14]
                const jhdjs = parseInt((tools.lenFormat(message[15].toString(16), 2) +
                  tools.lenFormat(message[16].toString(16), 2) +
                  tools.lenFormat(message[17].toString(16), 2)), 16)
                const xddjs = parseInt((tools.lenFormat(message[18].toString(16), 2) +
                  tools.lenFormat(message[19].toString(16), 2) +
                  tools.lenFormat(message[20].toString(16), 2)), 16)
                const gzsc = parseInt((tools.lenFormat(message[21].toString(16), 2) +
                  tools.lenFormat(message[22].toString(16), 2) +
                  tools.lenFormat(message[23].toString(16), 2) +
                  tools.lenFormat(message[24].toString(16), 2)), 16)
                const ghlw = parseInt((tools.lenFormat(message[25].toString(16), 2) +
                  tools.lenFormat(message[26].toString(16), 2) +
                  tools.lenFormat(message[27].toString(16), 2) +
                  tools.lenFormat(message[28].toString(16), 2)), 16)
                this.setDevice({
                  version: version, checkedStatus: checkedStatus, fjStatus: fjStatus,
                  zqStatus: zqStatus, jhStatus: jhStatus, xdStatus: xdStatus, jhdjs: jhdjs, xddjs: xddjs,
                  gzsc: gzsc, ghlw: ghlw
                })
              } else if (message[6] === 0x10 && message[7] === 0x01 && message[8] === 0x18) { // 设置消毒时间段反馈
                this.xdTimeAll([tools.formatLengthTox(message[9].toString(), 2), tools.formatLengthTox(message[10].toString(), 2),
                  tools.formatLengthTox(message[11].toString(), 2), tools.formatLengthTox(message[12].toString(), 2),
                  tools.formatLengthTox(message[13].toString(), 2), tools.formatLengthTox(message[14].toString(), 2),
                  tools.formatLengthTox(message[15].toString(), 2), tools.formatLengthTox(message[16].toString(), 2),
                  tools.formatLengthTox(message[17].toString(), 2), tools.formatLengthTox(message[18].toString(), 2),
                  tools.formatLengthTox(message[19].toString(), 2), tools.formatLengthTox(message[20].toString(), 2),
                  tools.formatLengthTox(message[21].toString(), 2), tools.formatLengthTox(message[22].toString(), 2),
                  tools.formatLengthTox(message[23].toString(), 2), tools.formatLengthTox(message[24].toString(), 2),
                  tools.formatLengthTox(message[25].toString(), 2), tools.formatLengthTox(message[26].toString(), 2),
                  tools.formatLengthTox(message[27].toString(), 2), tools.formatLengthTox(message[28].toString(), 2),
                  tools.formatLengthTox(message[29].toString(), 2), tools.formatLengthTox(message[30].toString(), 2),
                  tools.formatLengthTox(message[31].toString(), 2), tools.formatLengthTox(message[32].toString(), 2)],
                )
              } else if (message[6] === 0x20 && message[7] === 0x00 && message[8] === 0x01) { // 设置风速反馈
                this.fjStatus(message[9])
              } else if (message[6] === 0x20 && message[7] === 0x01 && message[8] === 0x01) { // 设置增强反馈
                this.zqStatus(message[9])
              } else if (message[6] === 0x20 && message[7] === 0x02 && message[8] === 0x03) { // 设置净化倒计时反馈
                this.jhdjs(message[9].toString(16) + tools.lenFormat(message[10].toString(16), 2) +
                  tools.lenFormat(message[11].toString(16), 2))
              } else if (message[6] === 0x20 && message[7] === 0x03 && message[8] === 0x03) { // 设置消毒倒计时反馈
                this.xddjs(message[9].toString(16) + tools.lenFormat(message[10].toString(16), 2) +
                  tools.lenFormat(message[11].toString(16), 2))
              } else if (message[6] === 0x20 && message[7] === 0x04 && message[8] === 0x01) { // 设置进入自动模式反馈 即关闭净化或消毒
                this.jhdjs(0)
                this.xddjs(0)
              } else if (message[6] === 0x20 && message[7] === 0x05 && message[8] === 0x01) { // 设置时间段反馈
                if (message[9] === 0x01) { // 成功
                  Toast.success('设置消毒时段成功！')
                } else {
                  Toast.fail('设置净化时段失败！')
                  this.sendMSG(this.pubTopic, mqttCmd.getCmdTime())// 重新获取真实时间段
                }
              } else if (message[6] === 0x20 && message[7] === 0x06 && message[8] === 0x01) { // 同步时间反馈
                if (message[9] !== 0x01) { // 同步时间失败
                  setTimeout(() => {
                    this.sendMSG(this.pubTopic, mqttCmd.setTime())
                  }, 1000)
                }
              } else if (message[6] === 0x20 && message[7] === 0x07 && message[8] === 0x04) { // 设置滤网寿命反馈
                this.ghlw(parseInt((tools.lenFormat(message[9].toString(16), 2) +
                  tools.lenFormat(message[10].toString(16), 2) +
                  tools.lenFormat(message[11].toString(16), 2) +
                  tools.lenFormat(message[12].toString(16), 2)), 16))
                Toast.success('操作成功！')
              } else if (message[6] === 0x20 && message[7] === 0x08 && message[8] === 0x04) { // 设置累计工作时长反馈
                this.gzsc(parseInt((tools.lenFormat(message[9].toString(16), 2) +
                  tools.lenFormat(message[10].toString(16), 2) +
                  tools.lenFormat(message[11].toString(16), 2) +
                  tools.lenFormat(message[12].toString(16), 2)), 16))
                Toast.success('操作成功！')
              }
            }
          } catch (e) {
            if (debug) {
              console.log('抛出异常的topic=', topic, '，消息', message, e)
            } else {
              console.error(e)
            }
          }
        })
        // 断开发起重连
        client.on('reconnect', (error) => {
          console.log('断开发起重连', error)
        })
        // 链接异常处理
        client.on('error', (error) => {
          console.log('连接失败:', error)
        })
      },
      subAndObtainStatus() { // 订阅设备和获取设备状态
        this.pubTopic = '/' + this.index.appKey + '/' + this.index.currentDevice + '&RX'
        this.subTopic = '/' + this.index.appKey + '/' + this.index.currentDevice + '&TX'
        client.subscribe(this.subTopic, (error) => {
          if (!error) {
            this.sendMSG(this.pubTopic, "getState")
          } else {
            // TODO 订阅失败
          }
        })
      },
      sendMSG: function (topic, msg) { // 发送消息 msg=操作码+值长度+值
        if (typeof (msg) === 'string') {
          if (debug) {
            console.log('发送主题' + topic + '，HEX消息' + msg)
          }
          client.publish(topic, msg)
        } else {
          const msgLength = 4 + 2 + msg.length + 2// 包头+包长+msg+crc
          const msgTemp = [0x20, 0x20, 0x05, 0x16].concat([msgLength >> 8, msgLength % 256]).concat(msg)// 未加crc的协议
          const fullMsg = tools.addCRC(msgTemp)// 完整的hex协议
          if (debug) {
            console.log('发送主题' + topic + '，HEX消息' + fullMsg)
          }
          // 添加crc和转换类型
          client.publish(topic, new Uint8Array(fullMsg))
        }
      },
      sendMsg(msg) { // 提供给子元素的发送消息方法
        this.sendMSG(this.pubTopic, msg)
      },
      sendHeartbeat: function () { // 发送心跳即获取设备状态
        if (!this.sendHeartbeatTimer) {
          this.sendHeartbeatTimer = setInterval(() => {
            if (this.index.currentDevice) {
              if (debug) {
                console.log('发送心跳')
              }
              this.sendMSG(this.pubTopic, mqttCmd.getCmdStatus())
            }
          }, this.heartbeatInterval)
        }
      },
      monitorDeviceStatus: function () { // 监听硬件设备状态
        if (!this.monitorDeviceStatusTimer) {
          this.monitorDeviceStatusTimer = setInterval(() => {
            if (this.index.currentDevice) {
              if (debug) {
                console.log('心跳检查')
              }
              if (new Date().getTime() / 1000 - this.lastReceiveMsgTs > this.heartbeatInterval / 1000 * 1.5) { // 硬件设备上报协议超时
                this.dStatus(2)
              } else {
                this.dStatus(1)
              }
            }
          }, this.heartbeatInterval / 2)
        }
      },
      // mqtt end
      changeView(type) {
        this.type = type
      },
      key() {
        console.log(this.$route.title)
        return this.$route.title
      },
      getList() {
        this.listLoading = true;
        getList(this.listQuery).then(response => {
          this.list = response.respObj.item
          this.total = response.respObj.total
          this.listLoading = false
        }).catch(error => {
          console.log(error)
          this.listLoading = false
        })


        // getWechatUser(this.listQuery).then(response => {
        //   this.list = response.respObj.item
        //   this.total = response.respObj.total
        //   this.listLoading = false
        // })
        // getProvinceView().then(response => {
        //   console.log(response.respObj)
        //   const list = JSON.stringify(response.respObj)
        //   this.provinceList = JSON.parse(list)
        //   this.provinceList.forEach(item => {
        //     const cities = item.cities
        //     item.areas = cities
        //     delete item.cities
        //   })
        // })
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      selectDev(row) { // 选择设备
        // this.resetTemp()
        // this.dialogFormVisible = true
        // this.temp = row
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].clearValidate()
        // })

        if(this.index.currentDevice){//先解除之前的设备
          client.unsubscribe('/' + this.index.appKey + '/' + this.index.currentDevice + '&TX')
        }
        this.index.currentName = row.title;
        this.index.currentDevice = row.deviceName;
        this.dStatus(4);
        this.lastReceiveMsgTs = 0;
        if (this.monitorDeviceStatusTimer) {
          clearInterval(this.monitorDeviceStatusTimer);
          this.monitorDeviceStatusTimer = null;
        }
        this.monitorDeviceStatus();
        this.subAndObtainStatus();
      },
      // updateData() {
      //   this.$refs['dataForm'].validate((valid) => {
      //     if (valid) {
      //       postWechatUserUp(this.temp).then(response => {
      //         this.dialogFormVisible = false
      //         this.$notify({
      //           title: '成功',
      //           message: '更新成功',
      //           type: 'success',
      //           duration: 2000
      //         })
      //       })
      //     }
      //   })
      // },
      // resetTemp() {
      //   this.temp = {
      //     openId: undefined,
      //     nickname: undefined,
      //     username: undefined,
      //     headimgurl: '',
      //     address: undefined,
      //     phone: undefined
      //   }
      // },
      sortChange(data) { // 排序
        console.log(data);
        const {prop, order} = data;
        if (prop === 'create_date') {
          if (order === 'ascending') {
            this.listQuery.orderType = 'asc'
            // this.list.sort(function (a, b) {
            //   return b.createDate < a.createDate ? 1 : -1
            // })
          } else if (order === 'descending') {
            this.listQuery.orderType = 'desc'
            // this.list.sort(function (a, b) {
            //   return b.createDate < a.createDate ? -1 : 1
            // })
          } else {
            this.listQuery.orderType = undefined
          }
          this.handleFilter();
        }
      },
      // errorHandler() {
      //   return true
      // },
      // handleChange(province) {
      //   console.log(province)
      // }
    },
    computed: {
      ...mapState('device', ['index', 'device'])

    },
    beforeDestroy() {
      this.index.currentDevice = null;
      this.index.currentName = "请选择设备";
      if (this.sendHeartbeatTimer) {
        clearInterval(this.sendHeartbeatTimer);
      }
      if (this.monitorDeviceStatusTimer) {
        clearInterval(this.monitorDeviceStatusTimer);
      }
      client.end(true);
    }
  }
</script>

<style scoped>
  .fixed-width .el-button--mini {
    width: auto !important;
  }
</style>
