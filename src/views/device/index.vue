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
        v-model.trim="listQuery.deviceName"
        clearable
        placeholder="设备名称"
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
        v-model.trim="listQuery.registerNum"
        clearable
        placeholder="注册编号"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
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
      </el-select>
       <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <PButton
        class="filter-item"
        icon="el-icon-edit"
        perms="product-manage:export"
        type="primary"
        label="table.export"
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
      <el-table-column label="设备昵称" align="center" width="300">
        <template slot-scope="{row}">
          <el-tag>{{row.nickName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" align="center">
        <template slot-scope="{row}">
          <span>{{row.deviceName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="appKey" align="center" width="220">
        <template slot-scope="{row}">
          <el-tag type="success">{{row.appKey}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="设备秘钥" align="center">
        <template slot-scope="{row}">
          <span>{{row.deviceSecret}}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="注册编号" align="center">
        <template slot-scope="{row}">
          <span>{{row.registerNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="150">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.isEnable"
            :active-value="Number(1)"
            :inactive-value="Number(0)"
            active-text="启用"
            inactive-text="禁用"
            :disabled="!hasPerms('device-manage:switch')"
            @change="enableChange($event,row)"
          />
        </template>
      </el-table-column>
      
      <el-table-column label="超级用户" align="center" width="150">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.isSuperuser"
            :active-value="Number(1)"
            :inactive-value="Number(0)"
            active-text="启用"
            inactive-text="禁用"
            :disabled="!hasPerms('device-manage:switch')"
            @change="spChange($event,row)"
          />
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
      <!-- <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <PButton
            perms="product-manage:edit"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row)"
          />
          <PButton
            v-if="row.status!='deleted'"
            class="filter-item"
            perms="product-manage:rk"
            size="mini"
            type="success"
            label="table.registerKey"
            @click="handleRk(row,$index)"
          />
        </template>
      </el-table-column> -->
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"/>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
   
      <!-- <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="100px"
          style="width: 400px; margin-left:50px;">
          <el-form-item label="选择项目" prop="appKey">
            <el-select v-model="temp.appKey" filterable placeholder="请选择"  style="width:100%">
                <el-option v-for="item in proList" 
                    :key="item.uuid" :label="item.name" :value="item.appKey">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="注册数量" prop="count">
            <el-input v-model.trim="temp.remark" clearable placeholder="请输入备注" />
          </el-form-item>
        </el-form> -->
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
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
import {getProView,postProAdd,postProUp,postProKey} from '@/api/product'
import {getMqView,postMqAdd,postMqBatch,postMqSp,postMqEnable} from '@/api/device'
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
        uuid:undefined,
        name:undefined,
        // appKey:undefined,
        // registerKey:undefined,
        remark:undefined,
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
        deviceName:undefined,
        isEnable:undefined,
        isSuperuser:undefined,
        registerNum:undefined,
      },
      listLoading:false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap:{
        update: 'Edit',
        create: 'Create'
      },
      rules:{
        name:[{ required: true, message: '公司名称必填', trigger: 'change' }],
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
        this.listLoading = false
      })
      // getProView(this.query).then(response=>{
      //   this.proList = response.respObj.item
      //   this.total = response.respObj.total
      //   if(this.total>this.query.limit){
      //       this.query.limit = this.total
      //       getProView(this.query).then(response=>{
      //           this.proList = response.respObj.item
      //       })
      //   }
      //   this.listLoading = false
      // })
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
      this.resetTemp()
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(()=>{
        this.$refs['dataForm'].clearValidate()
      })

    },
    createData(){
      console.log(this.temp)
      this.$refs['dataForm'].validate((valid) => {
      if(valid){
        postProAdd(this.temp).then(response=>{
          this.dialogFormVisible = false
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
      this.dialogStatus = 'update'
      console.log(row)
      this.temp = Object.assign({}, row)
      console.log(this.temp)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData(){
      console.log(this.temp)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          postProUp(this.temp).then(response => {
              this.dialogFormVisible = false
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
    handleRk(row,index){
      this.$confirm('确定重置registerKey?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // const param = []
        // param.push(row.uuid)
        const requestData = { uuid: row.uuid }
        console.log(requestData)
        postProKey(requestData).then(response => {
          this.$notify({
            title: '成功',
            message: '重置成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        //   this.list.splice(index, 1)
        })
      }).catch(err => {

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
      // const formData = new FormData()
      // formData.append('nickName', row.nickName)
      // formData.append('status', status)
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
