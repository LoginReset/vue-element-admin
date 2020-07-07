<template>
  <div class="components-container">
    <div class="page">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="125px"
        style="width: 800px; margin-left:100px;"
      >
      <el-form-item label="通知类型" prop="type">
          <el-select v-model.trim="temp.type" filterable placeholder="请选择" >
            <el-option
            v-for="(item,index) in types"
            :key="index"
            :label="item"
            :value="index+1">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板消息" prop="weChatMsgUuid">
          <el-select v-model="temp.weChatMsgUuid" filterable placeholder="请选择" @change="change()">
            <el-option
            v-for="(item,index) in wechatList"
            :key="index"
            :label="item.templateName"
            :value="item.uuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择通知人">
          <el-select
            v-model="temp.wechatUsers" multiple filterable remote reserve-keyword 
            placeholder="搜索用户昵称/手机号/姓名" 
            :remote-method="remoteMethod"
            :loading="listLoading">
            <el-option
              v-for="item in userList"
              :key="item.openId"
              :label="'昵称:'+item.nickname+' '+'用户名:'+item.username+' '+'手机号:'+item.phone"
              :value="item.openId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="temp.description"
            :autosize="{ minRows: 2, maxRows: 10}"
            type="textarea"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="resetTemp">重置</el-button>
          <el-button @click="cancel">返回</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>
<script>
import { getWechatUser } from '@/api/user'
import { postConfigSave,getWechatTemp,postConfigUp } from '@/api/wechat'

import { getFieldKeyAll } from '@/api/sys'

export default {
  name: 'TemplatePage',
  data() {
    return {
      index: 0,
      titleData: [],
      listLoading: true,
      fieldList: [],
      wechatList: [],
      userList:[],
      types:[
        '订单付款通知(下单已付钱)',
        '订单收货通知',
        '库存预警通知',
        '维权订单通知',
        '发货通知(商家发货)',
      ],
      temp: {
        weChatMsgUuid:'',
        wechatUsers:[],
        type:'',
        description:'',
        weChatMsgTemplate:undefined
      },
      listQuery: {
        page: 1,
        limit: 20,
        nickname: undefined,
        phone: undefined,
        username: undefined
      },
      innerVisible: false,
      dialogStatus: '',
      downloadLoading: false,
      rules: {
        weChatMsgUuid:[{
          required: true, message:'请选择模板消息',trigger: 'change'
        }],
        type:[{
          required: true, message:'请选择通知类型',trigger: 'change'
        }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const arrPath = this.$route.path.split('/')
      
      if (arrPath[arrPath.length - 1] === 'edit') {
        const t = sessionStorage.getItem('wechatPushData')
        const data = JSON.parse(t)
        this.temp = data
        this.temp.weChatMsgUuid = this.temp.weChatMsgTemplate.uuid
        this.userList = data.wechatUsers
        this.temp.wechatUsers = []
        this.userList.forEach(item=>{
          this.temp.wechatUsers.push(item.openId)
        })
      }
      getWechatTemp().then(response=>{
          this.wechatList = response.respObj
          console.log(this.wechatList)
      })
      
      getWechatUser(this.listQuery).then(response=>{
        this.listQuery.limit = response.respObj.total
      })
      getWechatUser(this.listQuery).then(response=>{
          this.userList = response.respObj.item
      })
    },
    remoteMethod(query){
      console.log(query)
      if(query!==''){
        
        this.userList = []
        this.listLoading = true
          //判断
          this.listQuery.username = undefined
          this.listQuery.phone = undefined

          this.listQuery.nickname = query
          getWechatUser(this.listQuery).then(response=>{
            if(response.respObj.total===0){
              this.listQuery.nickname = undefined
              this.listQuery.username = query
              this.userList = []
              getWechatUser(this.listQuery).then(response=>{
                if(response.respObj.total===0){
                  this.listQuery.username = undefined
                  this.listQuery.phone = query
                  this.userList = []
                  getWechatUser(this.listQuery).then(response=>{
                    if(response.respObj.total>0){
                       this.userList = response.respObj.item
                    }else{
                      this.userList = []
                    }
                  })
                }else{
                  this.userList = response.respObj.item
                }
              })
            }else{
              this.userList = response.respObj.item
            }
          })
          this.listLoading = false

      }
    
    },
    onSubmit() {
      const arrPath = this.$route.path.split('/')
      this.temp.description = this.temp.description.trim()
      if (arrPath[arrPath.length - 1] === 'create') {
        this.createData()
      } else {
        this.updateData()
      }
    },
    resetTemp(){
      this.temp={
        weChatMsgUuid:'',
        wechatUsers:[],
        type:'',
        description:'',
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          postConfigSave(this.temp).then(response => {
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
            this.$store.dispatch('tagsView/delView', this.$route).then(() => {
              this.$nextTick(() => {
                this.$router.push({ name: 'wechatTemp' })
              })
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          postConfigUp(this.temp).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.$store.dispatch('tagsView/delView', this.$route).then(() => {
              this.$nextTick(() => {
                this.$router.push({ name: 'wechatTemp' })
              })
            })
          })
        }
      })
    },
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route).then(() => {
        this.$nextTick(() => {
            this.$router.push({ name: 'wechatTemp' })
        })
      })
    },
    change(){
      this.$forceUpdate()
    }
  }

}
</script>
<style scope>

 .el-select{
      width:100%;
  }
</style>
