<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.rankName"
        clearable
        placeholder="元件级别"
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
        perms="element-rank:add"
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
      <el-table-column label="元件级别" align="center">
        <template slot-scope="{row}">
          <el-tag>{{row.rankName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" sortable="custom" prop="createDate" width="230">
        <template slot-scope="{row}">
          <span>{{ row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="220">
        <template slot-scope="{row}">
          <span>{{ row.updateDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <PButton
            perms="element-rank:edit"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row)"
          />
          <PButton
            v-if="row.status!='deleted'"
            class="filter-item"
            perms="element-rank:delete"
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
          <el-form-item label="元件名称" prop="rankName">
            <el-input v-model.trim="temp.rankName" clearable placeholder="请输入元件级别" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model.trim="temp.description" clearable placeholder="请输入描述" />
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
import {getRankView,postRankAdd,postRankUp,getRankDel} from '@/api/ele'
import PButton from '@/components/PermissionBtn'
import waves from '@/directive/waves' // waves directive

import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export default {
  name:'element-rank',
  directives: { waves },
  components:{
    PButton,
    Pagination
  },
  data(){
 
    return{
      tableKey:0,
      list:[],
      total:0,
      temp:{
        uuid:undefined,
        description :undefined,
        rankName:undefined
      },
      listQuery:{
        page:1,
        limit:20,
        rankName:undefined,
        orderField: undefined,
        orderType: undefined, // desc|asc
      },
      listLoading:false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap:{
        update: 'Edit',
        create: 'Create'
      },
      rules:{
        rankName:[{ required: true, message: '元件级别必填', trigger: 'change' }],
        // address:[{required:true, message:'公司地址必填', trigger:'change'}],
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
      getRankView(this.listQuery).then(response=>{
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
      if (prop === 'createDate') {
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
        postRankAdd(this.temp).then(response=>{
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
          postRankUp(this.temp).then(response => {
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
      this.$confirm('确定删除元件级别?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const param = []
        param.push(row.uuid)
        const requestData = { uuids: param }
        console.log(requestData)
        getRankDel(requestData).then(response => {
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
        description :undefined,
        rankName :undefined
      }
    },
    cancel(){
      this.dialogFormVisible = false
    }
  }
}
</script>
<style scoped>
    .el-tag{
        font-size: 14px;
    }
</style>