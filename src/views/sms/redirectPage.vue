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
        <el-form-item label="模板名称" prop="title">
          <el-input v-model="temp.title" clearable placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="服务平台" prop="type">
          <el-radio-group v-model="temp.type">
            <el-radio :label="0">阿里云短信</el-radio>
            <el-radio :label="1">腾讯短信</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" style="width: 300px;">
          <el-select v-model="temp.status" placeholder="请选择状态">
            <el-option key="1" label="启用" :value="1" />
            <el-option key="0" label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <template v-if="temp.type===0">
          <el-form-item label="模板ID" prop="other0.templateCode">
            <el-input v-model="temp.other0.templateCode" clearable placeholder="请输入服务商提供的模板ID" />
          </el-form-item>
          <el-form-item label="短信签名" prop="other0.signName">
            <el-input v-model="temp.other0.signName" clearable placeholder="请输入短信签名" />
          </el-form-item>
          <el-form-item label="上行短信扩展码" prop="smsUpExtendCode">
            <el-input v-model="temp.other0.smsUpExtendCode" clearable placeholder="请输入短信签名" />
          </el-form-item>
          <el-form-item label="外部流水扩展字段" prop="outId">
            <el-input v-model="temp.other0.outId" clearable placeholder="请输入短信签名" />
          </el-form-item>
          <el-form-item
            v-for="(param,index) in temp.other0.templateParam"
            :key="index"
            :label="'模板参数'+(index+1)"
          >
            <el-col :span="7">
              <el-form-item
                prop="smsField"
                :rules="[{required: true, message: '短信模板字段必填', trigger: 'change'}]"
                :prop="'other0.templateParam.'+index+'.smsField'"
                style="margin-right:5px"
              >
                <el-input v-model="param.smsField" placeholder="短信模板字段" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item
                :rules="[{required: true, message: '变量必填', trigger: 'change'}]"
                :prop="'other0.templateParam.'+index+'.name'"
                style="margin-right:5px"
              >
                <el-input v-model="param.name" placeholder="变量" clearable @click.native="changeName(index)" @keyup.native="disable(index)" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item
                v-if="showDescField[index]"
                :rules="[{required: true, message: '描述字段必填', trigger: 'change'}]"
                :prop="'other0.templateParam.'+index+'.value'"
              >
                <el-input
                  v-model="param.value"
                  placeholder="描述字段"
                  clearabl
                  prop="value"
                />
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item style="margin-left:20px">
                <el-button type="danger" @click.prevent="removeParam(param)">删除</el-button>
              </el-form-item>
            </el-col>

          </el-form-item>
          <el-form-item>
            <el-button style="" @click="addParam">添加参数</el-button>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="模板ID" prop="other.templateID">
            <el-input v-model="temp.other.templateID" clearable placeholder="请输入服务商提供的模板ID" />
          </el-form-item>
          <el-form-item label="短信应用ID" prop="other.appid">
            <el-input v-model="temp.other.appid" clearable placeholder="请输入短信应用ID" />
          </el-form-item>
          <el-form-item label="短信签名" prop="other.sign">
            <el-input v-model="temp.other.sign" clearable placeholder="请输入短信签名内容" />
          </el-form-item>
          <el-form-item label="国际/港澳台短信" prop="senderid">
            <el-input v-model="temp.other.senderid" clearable placeholder="请输入国际/港澳台短信" />
          </el-form-item>
          <el-form-item label="用户session" prop="session">
            <el-input v-model="temp.other.session" clearable placeholder="请输入用户session内容" />
          </el-form-item>
          <el-form-item label="短信码号扩展号" prop="extendcode">
            <el-input v-model="temp.other.extendcode" clearable placeholder="请输入用户session内容" />
          </el-form-item>

          <el-form-item
            v-for="(param,index) in temp.other.templateParam"
            :key="index"
            :label="'模板参数'+(index+1)"
          >

            <el-col :span="8">
              <el-form-item
                :rules="[{required: true, message: '变量必填', trigger: 'change'}]"
                :prop="'other.templateParam.'+index+'.name'"
                style="margin-right:10px"
              >
                <el-input v-model="param.name" placeholder="变量" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item
                v-if="showDescField"
                :rules="[{required: true, message: '描述字段必填', trigger: 'change'}]"
                :prop="'other.templateParam.'+index+'.value'"
              >
                <el-input
                  v-model="param.value"
                  placeholder="描述字段"
                  clearable
                  prop="value"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item style="margin-left:20px">
                <el-button type="danger" @click.prevent="removeParam(param)">删除</el-button>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button style="" @click="addParam">添加参数</el-button>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="cancel">取消</el-button>
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
import { getTemplateAll, getTemplates, postTemplateAdd, postTemplateUp, getTemplateDel } from '@/api/sms'
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
        type: 0,
        title: undefined,
        status: 1,
        value: '',
        // 阿里云
        other0: {
          signName: undefined,
          templateCode: undefined,
          smsUpExtendCode: undefined,
          outId: undefined,
          templateParam: [{
            smsField: undefined,
            name: undefined,
            value: undefined
          }]

        },
        // 腾讯
        other: {
          appid: undefined,
          sign: undefined,
          senderid: undefined,
          session: undefined,
          extendcode: undefined,
          templateID: undefined,
          templateParam: [{
            name: undefined,
            value: undefined
          }]
        }
      },
      innerVisible: false,
      dialogStatus: '',
      // textMap: {
      //   update: 'Edit',
      //   create: 'Create'
      // },
      downloadLoading: false,
      rules: {
        'other0.templateCode': [{ required: true, message: '短信模板ID必填', trigger: 'change' }],
        'other0.signName': [{ required: true, message: '短信签名必填', trigger: 'change' }],
        'other.templateCode': [{ required: true, message: '短信模板ID必填', trigger: 'change' }],
        'other.templateID': [{ required: true, message: '短信模板ID必填', trigger: 'change' }],
        'other.sign': [{ required: true, message: '短信签名必填', trigger: 'change' }],
        'other.appid': [{ required: true, message: '短信应用必填', trigger: 'change' }],
        title: [{ required: true, message: '标题必填', trigger: 'change' }]

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
        const t = sessionStorage.getItem('templateData')
        const data = JSON.parse(t)
        console.log(data)
        this.temp.uuid = data.uuid
        this.temp.title = data.title
        this.temp.status = data.status
        this.temp.type = data.type
        if (data.txSmsParam) {
          for (const k in data.txSmsParam) {
            if (k !== 'templateParam') {
              this.temp.other[k] = data.txSmsParam[k]
            }
          }
          var templateParam = JSON.parse(data.txSmsParam.templateParam)
          templateParam = this.changeDescription(templateParam)
          this.temp.other.templateParam = templateParam
        } else if (data.aliSmsParam) {
          for (const k in data.aliSmsParam) {
            console.log()
            if (k !== 'templateParam') {
              this.temp.other0[k] = data.aliSmsParam[k]
            }
          }
          var templateParam = JSON.parse(data.aliSmsParam.templateParam)
          templateParam = this.changeDescription(templateParam)

          this.temp.other0.templateParam = templateParam
        }
        console.log(this.temp)
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
                    if (item2.name === templateParam[i].name) {
                      templateParam[i].name = item2.description
                      this.descriptions[i] = item2.description
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
        console.log(this.fieldList)
        this.getList()
      })
    },
    resetTemp() {
      this.temp = {
        uuid: undefined,
        type: 0,
        title: '',
        status: 1,
        // 阿里云
        other0: {
          signName: undefined,
          templateCode: undefined,
          smsUpExtendCode: undefined,
          outId: undefined,
          templateParam: [{
            smsField: undefined,
            name: undefined,
            value: undefined
          }]

        },
        // 腾讯
        other: {
          appid: undefined,
          sign: undefined,
          senderid: undefined,
          session: undefined,
          extendcode: undefined,
          templateID: undefined,
          templateParam: [{
            name: undefined,
            value: undefined
          }]
        }
      }
    },
    currStationChange(uuid) {
      if (uuid) {
        console.log(typeof this.titleData)

        this.selectChange = true
        this.fieldList.forEach(item => {
          if (item.uuid === uuid) {
            this.titleData = item.children
          }
        })
        console.log(this.titleData)
      } else {
        this.selectChange = false
      }
    },
    onSubmit() {
      const arrPath = this.$route.path.split('/')
      if (arrPath[arrPath.length - 1] === 'create') {
        this.createData()
      } else {
        this.updateData()
      }
    },
    disable(index) {
      this.temp.other0.templateParam[index].name = this.descriptions[index]
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    JsonData() {
      var data = {}

      const temp1 = JSON.stringify(this.temp)
      const temp = JSON.parse(temp1)
      if (temp.type === 0) {
        data = {}
        console.log(data)
        for (const key in temp) {
          if (key !== 'other') {
            if (key === 'other0') {
              if (temp[key].templateParam.length > 0) {
                let i = 0
                temp[key].templateParam.forEach(item => {
                  if (item.key) {
                    delete (item['key'])
                  }
                  item.name = this.titleNames[i]
                  i++
                })
              }

              data.other = temp[key]
              const templateParam = JSON.stringify(temp[key].templateParam)
              data.other.templateParam = templateParam
            } else {
              data[key] = temp[key]
            }
          }
        }
      } else {
        data = {}
        for (const key in temp) {
          if (key !== 'other0') {
            if (key === 'other') {
              data.other = temp[key]
              const templateParam = JSON.stringify(temp[key].templateParam)
              console.log(templateParam)

              data.other.templateParam = templateParam
              console.log(data.other)
            } else {
              data[key] = temp[key]
            }
          }
        }
      }
      return data
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp)

          const data = this.JsonData()

          postTemplateAdd(data).then(response => {
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
            this.resetTemp()
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp)

          const data = this.JsonData()

          postTemplateUp(data).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.$router.push({ name: 'template' })
          })
        }
      })
    },
    addParam() {
      let key = 'other0'
      this.temp.type === 0 ? key : key = 'other'

      this.temp[key].templateParam.push({
        smsField: '',
        name: '',
        value: '',
        key: Date.now()
      })
      this.showDescField.push(false)
    },
    removeParam(item) {
      let key = 'other0'
      this.temp.type === 0 ? key : key = 'other'

      const index = this.temp[key].templateParam.indexOf(item)
      if (index !== -1) {
        this.temp[key].templateParam.splice(index, 1)
      }
      this.titleNames.splice(index, 1)
      this.showDescField.splice(index, 1)
    },
    chooseName(titleName) {
      console.log(titleName.name)
      let k = 'other'
      this.temp.type === 0 ? k = 'other0' : k
      console.log(k)
      const templateParam = this.temp[k].templateParam
      console.log(templateParam)
      templateParam[this.index].name = titleName.description
      titleName.descField === 0 ? this.showDescField[this.index] = false : this.showDescField[this.index] = true
      this.titleNames.splice(this.index, 1, titleName.name)
      console.log(this.titleNames)
    },
    changeName(index) {
      this.index = index
    },
    cancel() {
      this.$router.push({ name: 'template' })
    }
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
    width: 300px;
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
