<template>
  <div class="components-container">
    <div class="page">
      <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="100px"
          v-loading="listLoading"
          style="width: 700px; margin-left:50px;">

          <el-form-item label="元件名称" prop="elementName">
            <el-select v-model="temp.elementName" filterable placeholder="请选择元件名称"  style="width:100%">
                <el-option v-for="(item,index) in nameList"
                  :key="index" :label="item" :value="item">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="元件类型" prop="typeName">
            <el-select v-model="temp.typeName" filterable placeholder="请选择元件类型"  style="width:100%">
                <el-option v-for="(item,index) in typeList"
                  :key="index" :label="item" :value="item">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="元件级别" prop="rankName">
            <el-select v-model="temp.rankName" clearable filterable placeholder="请选择元件级别"  style="width:100%">
                <el-option v-for="(item,index) in rankList"
                  :key="index" :label="item" :value="item">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品牌" prop="brand">
            <el-input v-model="temp.brand" clearable placeholder="请输入品牌" />
          </el-form-item>
          <el-form-item label="精度" prop="elPrecision">
            <el-select v-model="temp.elPrecision"
                      filterable
                      default-first-option
                      allow-create
                      placeholder="请输入元件精度"
                      clearable
                      @blur="changePercision"
                      >
                        <el-option
                            v-for="(item,index) in options"
                            :key="index"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
            <!-- <el-input v-model.trim="temp.elPrecision" clearable placeholder="请输入元件精度" /> -->
          </el-form-item>
          <el-form-item label="选择图片" prop="imgPath">
            <el-upload
              ref="upload"
              action="#"
              :file-list="modeList"
              :http-request="modeUpload"
              :on-preview="handlePreview"
              :on-change="fileChange"
              :on-remove="handleRemove"
              accept="image/png,image/gif,image/jpg,image/jpeg,xlsx"
              list-type="picture"
              :auto-upload="false">
              <!--<div class="el-upload__tip" slot="tip" v-if="modeList.length===0">图片不存在</div>-->
              <el-button slot="trigger" size="small" type="primary">上传图片</el-button>
            </el-upload>


            <!-- <el-button @click="submitUpload">点击上传文件</el-button> -->
          </el-form-item>
          <el-form-item label="参数" prop="parameter">
            <el-input v-model.trim="temp.parameter" clearable placeholder="请输入参数" />
          </el-form-item>
          <el-form-item
            v-for="(param,index) in temp.packaging"
            :key="index"
            :label="'封装'+(index+1)"
            prop="packaging">
            <el-col :span="19">
              <el-form-item
                :rules="[{required: true, message: '封装参数必填', trigger: ['change','blur']}]"
                :prop="'packaging.'+index+'.value'"
                style="margin-right:10px">
                <el-input v-model.trim="param.value" placeholder="封装" clearable @input="change($event,index)" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item style="margin-left:20px" v-show="index>0">
                <el-button type="danger" @click.prevent="removeParam(param)">删除</el-button>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button style="" @click="addParam">添加参数</el-button>
          </el-form-item>
          <!-- <el-form-item label="封装" prop="packaging">
            <el-input v-model.trim="temp.packaging" clearable placeholder="请输入封装参数" />
          </el-form-item> -->
          <el-form-item label="功率" prop="power">
            <el-input v-model="temp.power" clearable placeholder="请输入功率" />
          </el-form-item>
          <el-form-item label="库存" prop="stock">
            <el-input v-model="temp.stock" clearable placeholder="请输入库存" />
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model.trim="temp.price" clearable placeholder="请输入价格(单位/元)" :disabled="disable"/>
          </el-form-item>
          <!-- <el-form-item label="价格上浮比例" prop="comeUp">
            <el-input v-model.trim="temp.comeUp" clearable placeholder="请输入价格上浮比例" />
          </el-form-item> -->

          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="temp.description" clearable placeholder="请输入描述" />
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
import {getElView,getRankView,getTypeView,postParameter,postComAdd,postComeUp} from '@/api/ele'
import {postImgUpload} from '@/api/enterprise'

export default {
  name: 'element-edit',
  data() {
    var checkPrecision = (rule,value,callback)=>{
      if(value!==''){
          if(value.split('%').length>2){
              callback(new Error('格式不正确'))
          }
          value = value.split('%')[0]
          value = Number(value)
          if(!/^\+?[1-9][0-9]*$/.test(value)||value>100||value<=0){
              callback(new Error('请输入[1,100]的正整数'))
              this.temp.elPrecision = ''

          }else{
            this.flag = true
          }
      }
      callback()
      // value = Number(value)
      // if(!/^0\.[0-9]{1}$|^0{1}$|^1{1}$|^1\.[0]{1}$/.test(value)){
      //   callback(new Error('范围为[0,1]精确到小数点后一位'))
      // }
      // callback()
    }
    var checkPrice = (rule,value,callback) =>{
      if(!value){
        this.temp.price=0;
      }
      if(!new RegExp("((^[1-9][0-9]{0,10})+(.?[0-9]{1,3})?$)|(^[0]+(.[0-9]{1,3})?$)").test(value)){
        callback(new Error('价格可精确到厘'))
      }
      callback()
    };
    return {
      url:'',
      index: 0,
      disable:false,
      flag : true,
      titleData: [],
      listLoading: true,
      nameList: [],
      typeList: [],
      rankList:[],
      modeList:[],
      fileList:[],
      mode:{},
      action: 'https://jsonplaceholder.typicode.com/posts/',
      options:['5%','10%','15%','20%','50%','75%','100%'],
      // [{
      //     value:5,
      //     label:'5%'
      //   },{
      //     value:10,
      //     label:'10%'
      //   },{
      //     value:15,
      //     label:'15%'
      //   },{
      //     value:20,
      //     label:'20%'
      //   },{
      //     value:25,
      //     label:'25%'
      //   },{
      //     value:50,
      //     label:'50%'
      //   },{
      //     value:75,
      //     label:'75%'
      //   },{
      //     value:100,
      //     label:'100%'
      //   }],
      temp:{
        uuid:undefined,
        description :'',
        brand:'',
        elPrecision :'',
        elementName :'',
        packaging :[{
          value:''
        }],
        power :'',
        price :'',
        rankName :'',
        stock :'',
        parameter :'',
        typeName :'',
        // comeUp:undefined
      },
      listQuery:{
        page:1,
        limit:20
      },

      innerVisible: false,
      dialogStatus: '',
      downloadLoading: false,
      rules: {
       elPrecision:[{ validator: checkPrecision, trigger: 'change' }],
      //  comeUp:[{validator: checkPrecision, trigger: 'change'}],
       price:[{validator:checkPrice,trigger: 'change'}],
      //  power:[{ required: true, message: '功率必填', trigger: 'change' }],
       elementName:[{ required: true, message: '元件名称必填', trigger: 'change' }],
       parameter:[{ required: true, message: '参数必填', trigger: 'change' }],
      //  rankName:[{ required: true, message: '元件必填', trigger: 'change' }],
      //  stock:[{ required: true, message: '库存必填', trigger: 'change' }],
       typeName:[{ required: true, message: '类型必填', trigger: 'change' }],
       packaging:[{ required: true, message: '封装参数必填', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const arrPath = this.$route.path.split('/')
      this.listLoading = true

      if (arrPath[arrPath.length - 1] === 'edit') {
        this.disable = true
        const t = sessionStorage.getItem('elData')
        console.log(t)
        const data = JSON.parse(t)
        this.temp = data
        let newArr = this.temp.packaging.split(',')
        console.log(newArr)
        let i = 0
        this.temp.packaging = []
        newArr.forEach(item=>{
            this.temp.packaging.push({
                value:item
            })
            i++
        })

        // this.temp.elPrecision = this.temp.elPrecision/100
        // this.temp.comeUp = this.temp.comeUp/100
        // this.temp.price = this.temp.price/1000
        this.temp.imgPath&&this.modeList.push({
          url:this.temp.imgPath
        })
        // this.temp.packaging = this.temp.packaging.join(',')
      }
      postParameter().then(response=>{
          this.nameList = response.respObj.elementNames
          this.typeList = response.respObj.typeNames
          this.rankList = response.respObj.rankNames
          this.listLoading = false
      })

    },

    onSubmit() {
      const arrPath = this.$route.path.split('/')
      // this.temp.description = this.temp.description.trim()
      if (arrPath[arrPath.length - 1] === 'create') {
        this.createData()
      } else {
        this.updateData()
      }
    },
    resetTemp(){
      this.temp={
        uuid:undefined,
        description :'',
        brand:'',
        elPrecision :'',
        elementName :'',
        packaging :[{
            value:''
        }],
        power :'',
        price :'',
        rankName :'',
        stock :'',
        parameter :'',
        typeName :'',
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
          let data = this.changeData()
          console.log(data)
          postComAdd(data).then(response => {
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
            this.$store.dispatch('tagsView/delView', this.$route).then(() => {
              this.$nextTick(() => {
                this.$router.push({ name: 'element-manage' })
              })
            })
          })
        }
      })
    },
    changeData(){
        let data = JSON.parse(JSON.stringify(this.temp))
        // data.elPrecision = data.elPrecision*100
        // data.comeUp = data.comeUp*100

        data.price = data.price*1000

        console.log(typeof data.elPrecision)
            // 处理packging格式
          if(data.packaging.length>1){
            let newParam = []
            data.packaging.forEach(item=>{
                newParam.push(item.value)
            })
             data.packaging = newParam.join(',')

          }else{
             data.packaging = data.packaging[0].value
          }
          for(let k in data){
            console.log(data[k])
            if(data[k]&&typeof data[k]==='string'){
              console.log(data[k])
              data[k] = data[k].trim()
            }
          }
          return data
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {

          let data = this.changeData()
          console.log(data)
          postComeUp(data).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.$store.dispatch('tagsView/delView', this.$route).then(() => {
              this.$nextTick(() => {
                this.$router.push({ name: 'element-manage' })
              })
            })
          })
        }
      })
    },
    addParam(){
      console.log(this.temp.packaging)
        this.temp.packaging.push({
          value: '',
          key: Date.now()
        });

    },
    removeParam(param){
        let index = this.temp.packaging.indexOf(param)
        if (index>0) {
          this.temp.packaging.splice(index, 1)
        }
    },
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route).then(() => {
        this.$nextTick(() => {
            this.$router.push({ name: 'element-manage' })
        })
      })
    },
    handlePreview(file){
    },
    handleRemove(file,fileList){
      this.temp.imgPath = ''
      this.modeList = []
    },
    modeUpload(item) {
      this.mode = item.file
      let fd = new FormData()// FormData 对象
      fd.append('file', this.mode)// 文件对象
      console.log(fd.get('file'))
      postImgUpload(fd).then(response=>{
        this.temp.imgPath = response.respObj.relUrl
        this.url = response.respObj.absUrl
      })
    },
    fileChange(file, fileList) {
      console.log(file)
      // console.log(file.raw)
      this.modeList = []
      this.modeList.push(file)
      this.submitUpload()
    },
    submitUpload() {
        this.$refs.upload.submit();
      },
    change(e,index){
      // this.temp.packaging[index].value = e

      // this.$forceUpdate()
    },
    changePercision(){
      // if(!this.flag){
      //   this.temp.elPrecision = ''
      // }
    }
  }

}
</script>
<style scope>

 .el-select{
      width:100%;
  }
  .el-upload__tip{
    color:#e64242
  }
</style>
