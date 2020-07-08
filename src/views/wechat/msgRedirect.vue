<template>
  <div class="components-container">
    <div class="page">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="125px"
        style="width: 900px; margin-left:100px;"
      >
        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model.trim="temp.templateName" clearable placeholder="请输入模板名称" />
        </el-form-item>
          <el-form-item label="模板ID" prop="templateId">
            <el-input v-model.trim="temp.templateId" clearable placeholder="请输入模板ID" />
          </el-form-item>
          <el-form-item label="跳转页面路径" prop="url">
            <el-input v-model.trim="temp.url" clearable placeholder="请输入跳转页面地址" />
          </el-form-item>
          <el-form-item label="小程序appid" prop="appid">
            <el-input v-model.trim="temp.appid" clearable placeholder="请输入小程序appid"/>
          </el-form-item>
          <el-form-item label="小程序跳转路径" prop="pagePath" v-show="temp.appid">
            <el-input v-model.trim="temp.pagePath " clearable placeholder="请输入小程序跳转路径" />
          </el-form-item>
         <el-form-item label="状态" style="width: 300px;">
          <el-radio-group v-model="temp.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
          </el-form-item>
          <el-form-item
            v-for="(param,index) in temp.templateParams" :key="index" :label="'模板参数'+(index+1)">
            <el-col :span="4">
              <el-form-item
                prop="smsField"
                :rules="[{required: true, message: '模板字段必填', trigger: 'change'}]"
                :prop="'templateParams.'+index+'.name'"
                style="margin-right:5px">
                <el-input v-model.trim="param.name" placeholder="模板字段" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                :rules="[{required: true, message: '变量必填', trigger: 'change'}]"
                :prop="'templateParams.'+index+'.value'"
                style="margin-right:5px">
                <el-input v-model.trim="param.value" placeholder="变量" clearable @keyup.native="disable(index)" @click.native="changeName(index)"  />
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="showDescField[index]">
              <el-form-item
                :rules="[{required: true, message: '描述必填', trigger: 'change'}]"
                :prop="'templateParams.'+index+'.description'"
                style="margin-right:5px">
                <el-input v-model.trim="param.description" placeholder="描述" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item
                :rules="[{required: true, message: '输入十六进制颜色',pattern:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, trigger: 'change'}]"
                :prop="'templateParams.'+index+'.color'"
              >
                <el-input
                  v-model.trim="param.color"
                  placeholder="颜色"
                  clearabl
                  prop="color"/>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item>
                <el-color-picker v-model="param.color"/>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item>
                <el-button type="danger" @click.prevent="removeParam(param)">删除</el-button>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button style="" @click="addParam">添加参数</el-button>
          </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="resetTemp">重置</el-button>
          <el-button @click="cancel">返回</el-button>
        </el-form-item>
      </el-form>
      <div class="nameType">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-select v-model="name" placeholder="请选择模板变量类型" clearable @change="currStationChange(name)">
              <el-option v-for="item in fieldList" :key="item.uuid" :label="item.description" :value="item.uuid">
                {{ item.description }}</el-option>
            </el-select>
          </div>
          <template v-if="titleData.length>0">
            <div v-for="title in titleData" class="title-box">
              <div class="title">
                {{ title.description }}
              </div>
              <div v-show="title.children.length>0" class="title-name">
                <el-tag v-for="titleName in title.children" :key="titleName.uuid" class="tag text-muted" @click="chooseName(titleName)">{{ titleName.description }}</el-tag>
              </div>
            </div>
          </template>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import { postMsgTempSave, postMsgTempUpdate, postMsgTempDel, getMsgTemp } from '@/api/wechat'

import { getFieldKeyAll } from '@/api/sys'

export default {
  name: 'TemplatePage',
  data() {
    return {
      name: '',
      titleNames: [],
      descriptions: [],
      index: 0,
      selectChange: false,
      titleData: [],
      listLoading: true,
      fieldList: [],

      showDescField: [false], // 默认不显示描述字段
      temp: {
        uuid: undefined,
        appid : undefined,
        pagePath : undefined,
        status: 1,
        templateId:undefined,
        templateName:undefined,
        url:undefined,
        templateParams: [{
          uuid:undefined,
          color : undefined,
          name: undefined,
          value: undefined,
          description: undefined
        }],
      },
      innerVisible: false,
      dialogStatus: '',
      downloadLoading: false,
      rules: {
        url: [{ required: false, message: '请输入正确跳转页面地址',
          pattern: /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/,
          trigger: 'change' }],
        // appid : [{ required: true, message: '小程序appid必填', trigger: 'change' }],
        pagePath : [{ required: true, message: '小程序跳转路径必填', trigger: 'change' }],
        templateId : [{ required: true, message: '微信模板ID必填', trigger: 'change' }],
        templateName : [{ required: true, message: '模板标题必填', trigger: 'change' }],

      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getList() {
      const arrPath = this.$route.path.split('/')
      if (arrPath[arrPath.length - 1] === 'edit') {
        const t = sessionStorage.getItem('msgTempData')
        const data = JSON.parse(t)
        data.templateParams= this.changeDescription(data.templateParams)
        this.temp = Object.assign({}, data)
      }
    },
    changeDescription(templateParam) {
      if (templateParam.length > 0) {
        for (let i = 0; i < templateParam.length; i++) {
          this.fieldList.forEach(item => {

            if (item.children.length > 0) {
              item.children.forEach(item1 => {
                if (item1.children.length > 0) {
                  item1.children.forEach(item2 => {
                    if (item2.name === templateParam[i].value) {
                      templateParam[i].value = item2.description
                      this.descriptions[i] = item2.description
                      item2.descField === 1?this.showDescField[i]=true:this.showDescField[i]=false
                      this.titleNames[i] = item2.name
                    }
                  })
                }
              })
            }
          })
        }
      }
      return templateParam
    },
    getData() {
      getFieldKeyAll().then(response => {
        const res = JSON.stringify(response.respObj)
        this.fieldList = JSON.parse(res)
        this.getList()
      })
    },
    resetTemp() {
      this.temp = {
        uuid: undefined,
        appid : undefined,
        pagePath : undefined,
        status: 1,
        templateId:undefined,
        templateName:undefined,
        url:undefined,
        templateParams: [{
          uuid:undefined,
          color : undefined,
          name: undefined,
          value: undefined,
          description: undefined
        }],
      }
    },
    currStationChange(uuid) {
      if (uuid) {
        this.selectChange = true
        this.fieldList.forEach(item => {
          if (item.uuid === uuid) {
            this.titleData = item.children
          }
        })
      } else {
        this.selectChange = false
      }
    },
    changeKey(){
        this.temp.template_name = this.temp['templateName']
        this.temp.template_id = this.temp['templateId']
        for(let i=0;i<this.temp.templateParams.length;i++){
            this.temp.templateParams[i].value = this.titleNames[i]
        }
    },
    onSubmit() {
      const arrPath = this.$route.path.split('/')
      if(!this.temp.appid){
          this.rules.pagePath = []
          this.temp.pagePath = ''
          this.temp.appid = ''
        }
      if (arrPath[arrPath.length - 1] === 'create') {
        this.createData()
      } else {
        this.updateData()
      }
    },
    disable(index) {
      this.temp.templateParams[index].value = this.descriptions[index]
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
          this.changeKey();
          postMsgTempSave(this.temp).then(response => {
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
            this.$store.dispatch('tagsView/delView', this.$route).then(() => {
              this.$nextTick(() => {
                this.$router.push({ name: 'wehcat-msgTemp' })
              })
            })

          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {

         this.changeKey()
          postMsgTempUpdate(this.temp).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.$store.dispatch('tagsView/delView', this.$route).then(() => {
              this.$nextTick(() => {
                this.$router.push({ name: 'wehcat-msgTemp' })
              })
            })
          })
        }
      })
    },
    addParam() {

      this.temp.templateParams.push({
        color: '',
        name: '',
        value: '',
        key: Date.now()
      })
      this.showDescField.push(false)
    },
    removeParam(item) {
      const index = this.temp.templateParams.indexOf(item)
      if (index !== 0) {
        this.temp.templateParams.splice(index, 1)
      }
      this.titleNames.splice(index, 1)
      this.showDescField.splice(index, 1)
    },
    chooseName(titleName) {
      const templateParam = this.temp.templateParams
      templateParam[this.index].value = titleName.description
      titleName.descField === 0 ? this.showDescField[this.index] = false : this.showDescField[this.index] = true
      this.titleNames.splice(this.index, 1, titleName.name)
    },
    changeName(index) {
      this.index = index
    },
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route).then(() => {
            this.$nextTick(() => {
                this.$router.push({ name: 'wehcat-msgTemp' })
            })
      })
    },
  }

}
</script>
<style scope>

  .page{
        display:flex;
    }
  .nameType{
        margin-left:200px
    }
  .clearfix:after {
    clear: both
  }
  .el-select{
      width:100%;
  }
  .box-card {
    width: 450px;
  }
  .title-box{
      margin-bottom:20px;
  }
  .title{
      border:1px solid #eee;
      border-top-left-radius:5px;
      border-top-right-radius:5px;
      width:100%;
      height:40px;
      line-height:20px;
      text-align:center;
      padding:10px;
  }
  .title-name{
      display:flex;
      flex-wrap:wrap;
      width:100%;
      border:1px solid #eee;
      border-bottom-left-radius:5px;
      border-bottom-right-radius:5px;
      padding:10px;
      justify-content:space-around;
  }
  .tag{
      margin-bottom:10px;
      font-size:14px;
  }
  .tag:hover{
      cursor:pointer;
  }
</style>
