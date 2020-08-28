<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.apkVersion"
        clearable
        placeholder="版本号"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select 
      v-model="listQuery.name" 
      style="width: 150px;"
      class="filter-item"
      clearable
      filterable 
      placeholder="产品名称" 
      @change="handleFilter" >
          <el-option 
            v-for="item in proList" 
            :key="item.uuid" 
            :label="item.name" 
            :value="item.name">
          </el-option>
      </el-select>
      <el-input
        v-model.trim="listQuery.remark"
        clearable
        placeholder="备注"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
     
       <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <PButton
        class="filter-item"
        icon="el-icon-edit"
        perms="version-manage:add"
        type="primary"
        label="table.add"
        @click="handleCreate"
      />
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
      row-key="uuid"
      @sort-change="sortChange"
    >
      <el-table-column
        label="序号"
        prop="id"
        align="center"
        type="index"
        width="50"
      />
      <el-table-column label="A区升级文件" align="center" width="300" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" :content="'点击下载文件'+row.apkNamea" placement="top">
            <a :href="row.apkNamea" download>{{row.fileNamea}}</a>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="B区升级文件" width="300" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" :content="'点击下载文件'+row.apkNameb" placement="top">
            <a :href="row.apkNameb" download>{{row.fileNameb}}</a>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="数字版本号" align="center" width="150">
        <template slot-scope="{row}">
          <el-tag type="success">{{row.apkVersion}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" align="center" width="180" show-overflow-tooltip >
        <template slot-scope="{row}">
          <span>{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.remark}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="备注" align="center" >
        <template slot-scope="{row}">
          <span>{{row.remark}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="创建时间" align="center" sortable="custom" prop="create_date" width="180">
        <template slot-scope="{row}">
          <span>{{ row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center"  width="180">
        <template slot-scope="{row}">
          <span>{{ row.updateDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <PButton
            perms="version-manage:edit"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"/>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :before-close="handleDialogClose">
   
      <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="120px"
          style="width: 400px; margin-left:50px;">
          <el-form-item label="A区升级文件" prop="apkNamea" >
              <el-upload
              ref="upload"
              action="#"
              :file-list="AList"
              :http-request="modeUpload"
              :on-change="fileChange"
              :on-remove="handleRemoveA"
              :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary" @click="fileA">选择文件</el-button>
              </el-upload>
          </el-form-item>
          <el-form-item label="B区升级文件" prop="apkNameb">
              <el-upload
              ref="uploads"
              action="#"
              :file-list="BList"
              :http-request="modeUpload"
              :on-change="fileChange"
              :on-remove="handleRemoveB"
              :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary" @click="fileB">选择文件</el-button>
              </el-upload>
          </el-form-item>
          <el-form-item label="选择项目" prop="productUuid">
            <el-select v-model="temp.productUuid" filterable placeholder="请选择" :disabled="disable" style="width:100%" >
                <el-option v-for="item in proList" 
                    :key="item.uuid" :label="item.name" :value="item.uuid">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本号" prop="apkVersion">
            <el-input  v-model.trim="temp.apkVersion" clearable placeholder="请输入数字版本号" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model.trim="temp.remark" clearable placeholder="请输入备注" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>

      </el-dialog>
  </div>
</template>
<script>
import {getVersionView,postVersionUp,postVersionAdd,postUpFile} from '@/api/device'
import {getProView} from '@/api/product'
import PButton from '@/components/PermissionBtn'
import waves from '@/directive/waves' // waves directive
import { hasBtnPermission } from '@/utils/permission'

import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export default {
  name:'version-manage',
  directives: { waves },
  components:{
    PButton,
    Pagination
  },
  data(){
    var checkApkVersion = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('数字版本号必填'))
      }
      if (!/^[0-9]+$/.test(value)) {
        return callback(new Error('类型必须是数字'))
      }
      if (value.length<6||value.length>10) {
        return callback(new Error('数字版本号为[6,10]位'))
      }
      callback()
    }
    return{
      tableKey:0,
      list:[],
      proList:[],
      AList:[],
      BList:[],
      total:0,
      chooseA:false,
      chooseB:false,
      disable:false,
      temp:{
        uuid:undefined,
        apkNamea:undefined,
        apkNameb:undefined,
        fileNamea:undefined,
        fileNameb:undefined,
        apkVersion:undefined,
        productUuid:undefined,
        remark:undefined,
      },
      query:{
        page:1,
        limit:20,
      },
      listQuery:{
        page:1,
        limit:20,
        name:undefined,
        orderField:undefined,
        orderType:undefined,
        apkVersion:undefined,
        remark:undefined
      },
      listLoading:false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap:{
        update: 'Update',
        create: 'Create'
      },
      rules:{
        apkNamea:[{ required: true, message: ' A区升级文件名称必填', trigger: 'change' }],
        apkNameb:[{required:true, message:'B区升级文件名称必填', trigger:'change'}],
        apkVersion:[{required:true,validator: checkApkVersion,trigger:'change'}],
        productUuid:[{required:true, message:'项目必选', trigger:'change'}],
        // phone:[{required:true,pattern:/^[1]([3-9])[0-9]{9}$/,message:'请输入正确电话号码', trigger:'change'}],
        // qrCodeType:[{required:true, validator: checkSort,trigger:'change'}],
      }
    }
  },
  created(){
    this.getList();
  },
  methods:{
    getList(){
      this.listLoading = true
      getVersionView(this.listQuery).then(response=>{
        this.list = response.respObj.item
        this.total = response.respObj.total
        console.log(this.listQuery)
        getProView().then(response=>{
            this.proList = response.respObj.item
            this.listLoading = false

        })
      })
    },
    handleFilter(){
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) { // 排序
      const { prop, order } = data
      if (prop === 'create_date') {
        if (order === 'ascending') {
          this.listQuery.orderType = 'asc'
        } else if (order === 'descending') {
          this.listQuery.orderType = 'desc'
        } else {
          this.listQuery.orderType = undefined
        }
        this.listQuery.orderField = prop
      }
      this.handleFilter()
    },
    handleCreate(){
        this.disable = false
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(()=>{
            this.$refs['dataForm'].clearValidate()
        })
    },
    createData(){
      this.$refs['dataForm'].validate((valid) => {
      if(valid){
        postVersionAdd(this.temp).then(response=>{
          this.cancel()
          console.log(response)
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      }
      })
    },
    handleUpdate(row){
        this.disable = true
        this.dialogStatus = 'update'
        this.temp = Object.assign({},row)
        console.log(this.temp)
        this.AList = []
        this.BList = []
        this.AList.push({
          name:this.temp.fileNamea,
          url:this.temp.apkNamea
        })
        this.BList.push({
          name:this.temp.fileNameb,
          url:this.temp.apkNameb
        })
        this.dialogFormVisible = true
        this.$nextTick(()=>{
            this.$refs['dataForm'].clearValidate()
        })
        console.log(this.temp)
    },
    updateData(){
        this.$refs['dataForm'].validate((valid) => {
        if (valid) {
             postVersionUp(this.temp).then(response => {
                    // const index = this.list.findIndex(v => v.id === this.temp.id)
                    // this.list.splice(index, 1, this.temp)
                this.cancel()
                this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
                })
                this.getList()
            })
          }
        })
    },
    
    handleExport(){
      console.log(this.listQuery)
      let arr = []
      for(let k in this.listQuery){
        if(this.listQuery[k]){
          arr.push(k+'='+this.listQuery[k])
        }
      }
      let param = '?'
      param = param+arr.join('&')
      let url = process.env.VUE_APP_BASE_API+'/b/mqUser/export'+param
      window.location.href = url
    },
    resetTemp(){
      this.temp = {
        uuid:undefined,
        apkNamea:undefined,
        apkNameb:undefined,
        fileNamea:undefined,
        fileNameb:undefined,
        apkVersion:undefined,
        productUuid:undefined,
        remark:undefined,
      }
      this.AList = []
      this.BList = []
    },
    cancel(){
      this.dialogFormVisible = false
      
    },
    fileA(){
        this.chooseA = true
        this.chooseB = false
    },
    fileB(){
        this.chooseB = true
        this.chooseA = false
    },
    //添加
    beforeUpload(file){
      file.name = file.name.toLowerCase()
      console.log(file.name)
      let testmsg = file.name.substring(file.name.lastIndexOf('.')+1)
      let extension = testmsg === 'bin'
      // let extension2 = testmsg === 'xlsx'
      console.log(testmsg === '.bin')
      
      if(!extension ) {
          this.$message({
            message: '上传文件只能是 .bin格式!',
            type: 'error'
          });
      }
      return extension
    },
    modeUpload(item) {
      let fd = new FormData()// FormData 对象
      fd.append('file', item.file)// 文件对象
      let sign = 0
      this.chooseA?sign = 0:sign = 1
      fd.append('sign',sign)
      console.log('modeUpload')
      postUpFile(fd).then(response=>{
        console.log(this.temp.fileNamea,this.temp.fileNameb)
        if(sign===0){
         this.temp.fileNamea = response.respObj.fileNamea
        }else{
         this.temp.fileNameb = response.respObj.fileNameb
        }
        // const copyFile = new File([item.file], item.file.name)
        // console.log(copyFile)
        // item.file.name = response.respObj.relUrl.split('/').reverse()[0]

        if(this.chooseA){
            this.AList.push(item.file)
            this.temp.apkNamea = response.respObj.relUrl
        }else{
            this.BList.push(item.file)
            this.temp.apkNameb = response.respObj.relUrl
        }
        console.log(this.temp)
        // this.dialogFormVisible = false
        // this.$notify({
        //   title: '成功',
        //   message: response.errorMsg,
        //   type: 'success',
        //   duration: 2000
        // })
        // this.getList();
      })
    },
    fileChange(file, fileList) {
        console.log(this.chooseA,this.chooseB)
      if(this.chooseA){
        this.AList = []
      }else if(this.chooseB){
        this.BList = []
      }
      this.submitUpload()
      

    },
    submitUpload() {
        if(this.chooseA){
            this.$refs.upload.submit();
        }else{
            this.$refs.uploads.submit();

        }
    },
    handleRemoveA(file){
        console.log(file,this.AList)
        this.AList = []
        this.temp.apkNamea = '' 
      console.log('handleRemoveA')
    },
    handleRemoveB(file){
        console.log(file,this.BList)
        this.BList =  []
        this.temp.apkNameb = '' 
      console.log('handleRemoveB')
    },
    handleDialogClose(){
      this.dialogFormVisible = false
      this.resetTemp()
    },
    cancel(){
      this.dialogFormVisible = false
      this.resetTemp()
    },
    // download(fileName,row){
    //   if(fileName === 'a'){
    //     window.location.href = row.apkNamea
    //   }else if(fileName === 'b'){
    //     window.location.href = row.apkNameb
    //   }
    // }
  }
}
</script>
<style>
    .el-tag{
        font-size: 14px;
    }
</style>
