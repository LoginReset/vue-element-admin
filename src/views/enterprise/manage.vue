<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.name"
        clearable
        placeholder="公司名称"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.linkman"
        clearable
        placeholder="公司联系人"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.phone"
        clearable
        placeholder="联系人电话"
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
        perms="enterprise-manage:add"
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
    >
      <el-table-column
        label="序号"
        prop="id"
        align="center"
        type="index"
        width="50"
      />
      <el-table-column label="企业名称" align="center" width="220">
        <template slot-scope="{row}">
          <el-tag>{{row.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center" width="240">
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司联系人" align="center">
        <template slot-scope="{row}">
          <el-tag type="success">{{ row.linkman }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="联系人电话" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司电话" align="center">
        <template slot-scope="{row}">
          <span>{{ row.companyTel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="二维码类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.qrCodeType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" sortable="custom" prop="create_date" width="230">
        <template slot-scope="{row}">
          <span>{{ row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <PButton
            perms="enterprise-manage:edit"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row)"
          />
          <PButton
            v-if="row.status!='deleted'"
            class="filter-item"
            perms="enterprise-manage:delete"
            size="mini"
            type="danger"
            label="table.delete"
            @click="handleDelete(row,$index)"
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
          label-position="left"
          label-width="100px"
          style="width: 400px; margin-left:50px;">
          <el-form-item label="公司名称" prop="name">
            <el-input v-model.trim="temp.name" clearable placeholder="请输入公司名称" />
          </el-form-item>
          <el-form-item label="公司地址" prop="address">
            <el-input v-model.trim="temp.address" clearable placeholder="请输入公司地址" />
          </el-form-item>
          <el-form-item label="公司电话" prop="companyTel">
            <el-input v-model.trim="temp.companyTel" clearable placeholder="请输入公司电话" />
          </el-form-item>
          <el-form-item label="公司联系人" prop="linkman">
            <el-input v-model.trim="temp.linkman" clearable placeholder="请输入公司联系人" />
          </el-form-item>
          <el-form-item label="联系人电话" prop="phone">
            <el-input v-model.trim="temp.phone" clearable placeholder="请输入联系人电话" />
          </el-form-item>
          <el-form-item label="二维码类型" prop="qrCodeType">
            <el-input v-model.trim="temp.qrCodeType" clearable placeholder="请输入二维码类型" />
          </el-form-item>
        </el-form>
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
import {getEnterpriseView,postEnterpriseAdd,postEnterpriseUp,postImgUpload,postEnterpriseDel} from '@/api/enterprise'
import PButton from '@/components/PermissionBtn'
import waves from '@/directive/waves' // waves directive

import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export default {
  name:'enterprise-manage',
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
      total:0,
      temp:{
        uuid:undefined,
        name:undefined,
        address:undefined,
        companyTel:undefined,
        linkman:undefined,
        phone:undefined,
        qrCodeType:undefined
      },
      listQuery:{
        page:1,
        limit:20,
        name:undefined,
        linkman:undefined,
        phone:undefined,
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
        address:[{required:true, message:'公司地址必填', trigger:'change'}],
        // companyTel:[{required:true, message:'公司电话必填', trigger:'change'}],
        linkman:[{required:true, message:'公司联系人必填', trigger:'change'}],
        // phone:[{ required:true, pattern:/^[1]([3-9]patter)[0-9]{9}$/,message:'请输入正确电话号码', trigger:'change'}],
        qrCodeType:[{required:true, validator: checkSort,trigger:'change'}],
      }
    }
  },
  created(){
    this.getList();
  },
  methods:{
    getList(){
      this.listLoading = true
      getEnterpriseView(this.listQuery).then(response=>{
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
        postEnterpriseAdd(this.temp).then(response=>{
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
          postEnterpriseUp(this.temp).then(response => {
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
    handleDelete(row,index){
      this.$confirm('确定删除当前公司?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const param = []
        param.push(row.uuid)
        const requestData = { uuids: param }
        console.log(requestData)
        postEnterpriseDel(requestData).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
      }).catch(err => {

      })
    },
    resetTemp(){
      this.temp = {
        uuid:undefined,
        name:undefined,
        address:undefined,
        companyTel:undefined,
        linkman:undefined,
        phone:undefined,
        qrCodeType:undefined

      }
    },
    cancel(){
      this.dialogFormVisible = false
      console.log(this.temp)
    }
  }
}
</script>
