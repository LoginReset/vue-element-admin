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
      </el-select>
      <el-select
        v-model="listQuery.isSuperuser"
        clearable
        style="width: 160px"
        class="filter-item"
        placeholder="是否为超级用户"
        @change="handleFilter"
      >
        <el-option key="1" label="启用" :value="1" />
        <el-option key="0" label="禁用" :value="0" />
      </el-select> -->
       <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <PButton
        class="filter-item"
        icon="el-icon-download"
        perms="product-manage:version"
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
      <el-table-column label="批量注册编号" align="center">
        <template slot-scope="{row}">
          <span>{{row.registerNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="appKey" align="center" width="220">
        <template slot-scope="{row}">
          <el-tag type="success">{{row.appKey}}</el-tag>
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
      <!-- <el-table-column label="备注" align="center" >
        <template slot-scope="{row}">
          <span>{{row.remark}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="创建时间" align="center" sortable="custom" prop="create_date" width="230">
        <template slot-scope="{row}">
          <span>{{ row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <PButton
            perms="product-manage:edit"
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
          label-position="right"
          label-width="100px"
          style="width: 400px; margin-left:50px;">
          <template v-if="dialogStatus==='multiple'">
              <el-form-item label="项目" prop="appKey">
                <el-select v-model="temp.appKey" filterable placeholder="请选择"  style="width:100%">
                    <el-option v-for="item in proList" 
                        :key="item.uuid" :label="item.name" :value="item.appKey">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="批量注册编号" prop="registerNum">
                <el-input v-model.trim="temp.registerNum" clearable placeholder="请输入批量注册编号" />
            </el-form-item>
          </template>
          <el-form-item label="最新版本号" prop="targetVersion ">
            <el-input v-model.trim="temp.targetVersion " clearable placeholder="请输入最新版本号" />
          </el-form-item>
        </el-form> 
       <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="dialogStatus==='single'?handleSingle():handleMultiple()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>

      </el-dialog>
  </div>
</template>
<script>
import {getProView} from '@/api/product'
import {getMqView,postMqAdd,postMqBatch,postMqSp,postMqEnable,getMqExport,postVersion} from '@/api/device'
import PButton from '@/components/PermissionBtn'
import waves from '@/directive/waves' // waves directive
import { hasBtnPermission } from '@/utils/permission'

import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export default {
  name:'device-manage',
  directives: { waves },
  components:{
    PButton,
    Pagination
  },
  data(){
    var checkSort = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('二维码类型必填'))
      }
      if (!/^[0-9]+$/.test(value)) {
        return callback(new Error('类型必须是数字'))
      }
      if (parseInt(value) > 99 || parseInt(value) < 0) {
        return callback(new Error('二维码类型范围[0,99]'))
      }
      callback()
    }
    return{
      tableKey:0,
      list:[],
      proList:[],
      total:0,
      temp:{
        nickName:undefined,
        currentVersion:undefined,
        appKey:undefined,
        registerNum:undefined,
        currentVersion:undefined,
      },
      query:{
        page:1,
        limit:20,
      },
      listQuery:{
        page:1,
        limit:20,
        nickName:undefined,
        appKey:undefined,
        currentVersion:undefined,
        isEnable:undefined,
        targetVersion:undefined,
        registerNum:undefined,
      },
      listLoading:false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap:{
        single: '指定版本',
        multiple: '批量指定'
      },
      rules:{
        // name:[{ required: true, message: '公司名称必填', trigger: 'change' }],
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
      getMqView(this.listQuery).then(response=>{
        this.list = response.respObj.item
        this.total = response.respObj.total
        console.log(this.listQuery)
      })
      getProView(this.query).then(response=>{
          if(this.query.limit<response.respObj.total){
              this.query.limit = response.respObj.total
              getProView(this.query).then(response=>{
                  this.proList = response.respObj.item
                  this.listLoading = false
              })
          }else{
            this.proList = response.respObj.item
          }
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
    handleSingle(row){
      this.dialogStatus = 'single'
      console.log(row)
      this.temp = Object.assign({}, row)
      console.log(this.temp)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleMultiple(){
      this.dialogStatus = 'multiple'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp(){
      this.temp = {
        uuid:undefined,
        name:undefined,
        remark:undefined,

      }
    },
    cancel(){
      this.dialogFormVisible = false
      console.log(this.temp)
    },
    enableChange(status, row) {
      const formData = new FormData()
      formData.append('nickName', row.nickName)
      formData.append('status', status)
      const data = {
        nickName:row.nickName,
        status
      }
      console.log(data)
      postMqEnable(data).then(response => {
        this.$notify({
          title: '成功',
          message: '修改状态成功',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        row.isEnable = status === 1 ? 0 : 1
      })
    },
    spChange(status, row) {
      const data = {
        nickName:row.nickName,
        status
      }
      console.log(data)
      postMqSp(data).then(response => {
        console.log(response)
        this.$notify({
          title: '成功',
          message: '修改用户成功',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        row.isSuperuser = status === 1 ? 0 : 1
      })
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
