<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.nickName"
        clearable
        placeholder="设备昵称"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.registerNum"
        clearable
        placeholder="注册编号"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.appKey"
        clearable
        placeholder="appKey"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.currentVersion"
        clearable
        placeholder="当前版本"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.targetVersion"
        clearable
        placeholder="最新目标版本"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <!-- <el-select
        v-model="listQuery.isEnable"
        clearable
        style="width: 140px"
        class="filter-item"
        placeholder="请选择状态"
        @change="handleFilter"
      >
        <el-option key="1" label="启用" :value="1" />
        <el-option key="0" label="禁用" :value="0" />
      </el-select>-->
      <el-select
        v-model="listQuery.upgradeStatus"
        clearable
        style="width: 160px"
        class="filter-item"
        placeholder="升级状态"
        @change="handleFilter"
      >
        <el-option key="0" label="失败" :value="0" />
        <el-option key="1" label="成功" :value="1" />
      </el-select> 
      <el-select
        v-model="listQuery.checkVersion"
        clearable
        style="width: 160px"
        class="filter-item"
        placeholder="查询版本匹配"
        @change="handleFilter"
      >
        <el-option key="false" label="允许" :value="false" />
        <el-option key="true" label="不允许" :value="true" />
      </el-select> 
       <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <PButton
        class="filter-item"
        icon="el-icon-download"
        perms="version-batch:import"
        type="primary"
        label="table.versionImport"
        @click="handleImport"
      />
      <PButton
        class="filter-item"
        icon="el-icon-thumb"
        perms="version-batch:version"
        type="primary"
        label="table.multipleVersion"
        @click="handleMultiple"
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
      <el-table-column label="设备昵称" align="center" width="300" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag>{{row.nickName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="appKey" align="center" width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag type="success">{{row.appKey}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="批量注册编号" align="center"  width="280" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.registerNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生产编号" align="center"  width="150" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.productNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前版本" align="center" >
        <template slot-scope="{row}">
          <span>{{row.currentVersion}}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="最新版本" align="center">
        <template slot-scope="{row}">
          <span>{{row.targetVersion}}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新结果说明" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{row.upgradeRemark}}</span>
        </template>
      </el-table-column>
      <el-table-column label="升级状态" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.upgradeStatus===0" type="danger">失败</el-tag>
          <el-tag v-if="row.upgradeStatus===1" type="success">成功</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="备注" align="center" >
        <template slot-scope="{row}">
          <span>{{row.remark}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="升级时间" align="center"   width="180">
        <template slot-scope="{row}">
          <span>{{ row.upgradeDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <PButton
            perms="version-batch:edit"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleSingle(row)"
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
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label="100px"
          label-position="left"
          style="width: 600px; margin-left:150px;">
          <template v-if="dialogStatus==='import'">
              <el-form-item>
                <el-upload
                style="margin-left:100px"
                drag
                ref="upload"
                action="#"
                :file-list="modeList"
                :http-request="modeUpload"
                :on-change="fileChange"
                :on-remove="handleRemove"
                :auto-upload="false">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <!-- <el-button slot="trigger" size="small" type="primary">选择文件</el-button> -->
              </el-upload>
            </el-form-item>
          </template>
          <!-- <el-form-item label="最新版本号" prop="targetVersion ">
            <el-input v-model.trim="temp.targetVersion " clearable placeholder="请输入最新版本号" />
          </el-form-item> -->
          <template v-else>
            <el-form-item label="最新版本号" style="width:100%">
                <el-select v-model="temp.targetVersion" filterable placeholder="请选择" clearable >
                    <el-option v-for="item in versionList" 
                        :key="item.uuid" :label="item.apkVersion+'('+item.name+')'" :value="item.apkVersion">
                    </el-option>
                </el-select>
            </el-form-item>
           
          </template>
          
        </el-form> 
       <div slot="footer" class="dialog-footer" v-if="dialogStatus!=='import'">
          <el-button @click="dialogFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="dialogStatus==='single'?single(): specify()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>

      </el-dialog>
  </div>
</template>
<script>
import {getMqView,postMqImport,postVersion,getVersionView,postSingleVersion} from '@/api/device'
import PButton from '@/components/PermissionBtn'
import waves from '@/directive/waves' // waves directive
import { hasBtnPermission } from '@/utils/permission'

import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export default {
  name:'device-versionBatch',
  directives: { waves },
  components:{
    PButton,
    Pagination
  },
  data(){
    return{
      tableKey:0,
      list:[],
      modeList:[],
      versionList:[],
      total:0,
      temp:{
        nickName:undefined,
        currentVersion:undefined,
        appKey:undefined,
        registerNum:undefined,
        currentVersion:undefined,
        targetVersion:undefined,
      },
      query:{
        page:1,
        limit:20,
      },
      listQuery:{
        page:1,
        limit:20,
        orderField:undefined,
        orderType:undefined,
        nickName:undefined,
        appKey:undefined,
        currentVersion:undefined,
        isEnable:undefined,
        targetVersion:undefined,
        registerNum:undefined,
        apkVersion:undefined,
        upgradeStatus:undefined,
        checkVersion:true
      },
      listLoading:false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap:{
        single: '指定版本',
        multiple: '批量指定',
        import: '导入设备',
      },
      rules:{
        // apkVersion:[{ required: true, message: '最新版本号必选', trigger: 'change' }],
        // address:[{required:true, message:'公司地址必填', trigger:'change'}],
        // // companyTel:[{required:true, message:'公司电话必填', trigger:'change'}],
        // linkman:[{required:true, message:'公司联系人必填', trigger:'change'}],
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
      if(this.listQuery.checkVersion === ''){
        this.listQuery.checkVersion = null
      }
      getMqView(this.listQuery).then(response=>{
        this.list = response.respObj.item
        this.total = response.respObj.total
        console.log(this.listQuery)
        this.listLoading = false
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
    handleImport(){
      this.modeList = []
      this.dialogStatus = 'import'
      this.dialogFormVisible = true
    },
    //添加
    beforeUpload(file){
      file.name = file.name.toLowerCase()
      console.log(file.name)
      let testmsg = file.name.substring(file.name.lastIndexOf('.')+1)
      let extension = testmsg === 'xls'
      let extension2 = testmsg === 'xlsx'
      if(!extension && !extension2 ) {
          this.$message({
            message: '上传文件只能是 xls 、xlsx格式!',
            type: 'error'
          });
      }
      return extension||extension2
    },
    modeUpload(item) {
      console.log(item.file);
      this.mode = item.file
      let fd = new FormData()// FormData 对象
      fd.append('file', this.mode)// 文件对象
      postMqImport(fd).then(response=>{
        console.log(response)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: response.errorMsg,
          type: 'success',
          duration: 2000
        })
        this.getList();
      })
    },
    fileChange(file, fileList) {
      this.modeList = []
      if(this.beforeUpload(file)){
        this.modeList.push(file)
        this.submitUpload()
      }

    },
    submitUpload() {
        this.$refs.upload.submit();
    },
    handleRemove(){
      console.log('handleRemove')
    },
    handleSingle(row){
      let param = {
        appKey:row.appKey
      }
      getVersionView(param).then(response=>{
          this.versionList = response.respObj.item
      })
      this.dialogStatus = 'single'
      console.log(row)
      this.temp.nickName = row.nickName
      this.reset()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleMultiple(){
      this.reset()
      if(!this.listQuery.appKey||!this.listQuery.currentVersion){
        this.$message({
          message:'appKey、当前版本必填',
          type:'error'
        })
      }else{
        let param = {
          appKey:this.listQuery.appKey
        }
        getVersionView(param).then(response=>{
          this.versionList = response.respObj.item
        })
        this.dialogStatus = 'multiple'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
      
    },
    single(){
      let data = {}
      data.nickName = this.temp.nickName
      if(this.temp.targetVersion === ''){
        this.temp.targetVersion = null
      }
      data.targetVersion = this.temp.targetVersion
      
      console.log(data)

      postSingleVersion(data).then(response=>{
        console.log(response)
        this.$notify({
          title: '成功',
          message: '已修改为指定版本',
          type: 'success',
          duration: 2000
        })
        this.getList()

        this.dialogFormVisible = false
      })
    },
    specify(){
      let data = {}
      if(this.temp.targetVersion === ''){
        this.temp.targetVersion = null
      }
      data.appKey = this.listQuery.appKey
      data.currentVersion = this.listQuery.currentVersion
      data.registerNum = this.listQuery.registerNum?this.listQuery.registerNum:''
      data.targetVersion = this.temp.targetVersion
      console.log('data',data)
      postVersion(data).then(response=>{
        console.log(response)
        this.$notify({
          title: '成功',
          message: '已修改为指定版本',
          type: 'success',
          duration: 2000
        })
        this.getList()
        this.dialogFormVisible = false
      })
    },
    reset(){
      this.temp.targetVersion = null
    },
    cancel(){
      this.dialogFormVisible = false
      console.log(this.temp)
    },
    hasPerms(role, perms) {
      // 根据权限标识和外部指示状态进行权限判断
      return hasBtnPermission(role, perms) // & !this.disabled
    }
  }
}
</script>
<style scoped>
    .el-tag{
        font-size: 14px;
    }
</style>
