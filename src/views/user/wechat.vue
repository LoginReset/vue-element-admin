<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.nickname"
        placeholder="微信用户昵称"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"/>
      <el-input
        v-model="listQuery.phone"
        placeholder="用户绑定手机号"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-input
       v-model="listQuery.username"
       placeholder="用户名"
       style="width:200px"
       class="filter-item"

       @keyup.enter.native="handleFilter"/>
      
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-refresh" 
        @click="getList">{{ $t('table.refresh') }}</el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      row-key="openId"
      @sort-change="sortChange">
      <el-table-column label="序号" prop="id" align="center" type="index" width="50" />
      <el-table-column label="头像" align="center" width="100">
        <template slot-scope="{row}">
          <el-image 
            :src="row.headimgurl" 
            :preview-src-list="srcList">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center">
        <template slot-scope="{row}">
          <span>{{row.nickname}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="{row}">
          <span>{{row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="{row}">
          <span>{{row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="{row}">
          <span>{{row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" sortable="custom" prop="create_date">
        <template slot-scope="{row}">
          <span>{{ row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <PButton
            class="filter-item"
            perms="user-wechat:edit"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row)"/>
        </template>

      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog title="edit" :visible.sync="dialogFormVisible">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="left"
          label-width="80px"
          style="width: 400px; margin-left:50px;">
            <el-form-item label="地址" prop="address">
              <el-input v-model="temp.address" clearable placeholder="请输入地址" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="temp.phone" clearable placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input v-model="temp.username" clearable placeholder="请输入用户名" />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                {{ $t('table.cancel') }}
                </el-button>
                <el-button type="primary" @click="updateData()">
                {{ $t('table.confirm') }}
                </el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
   import {getWechatUser,postWechatUserUp} from '@/api/user' 
   import waves from '@/directive/waves' // waves directive
   import { parseTime } from '@/utils'
   import Pagination from '@/components/Pagination' // secondary package based on el-pagination
   import PButton from '@/components/PermissionBtn'
   import { hasBtnPermission } from '@/utils/permission'
   export default {
      name:'user-wechat',
      components: { Pagination, PButton },
      directives: { waves },
      data() {
        return {
        name: '',
        tableKey: 0,
        list: [],
        srcList:[],
        total: 0,
        listLoading: true,
        listQuery: {
            page: 1,
            limit: 20,
            nickname: undefined,
            phone: undefined,
            username: undefined
        },
        temp: {
            openId:undefined,
            nickname:undefined,
            username:undefined,
            headimgurl:'',
            address:undefined,
            phone:undefined,
        },
        rules:{
          address:[{
            required: true, message:'地址必填',trigger: 'change'}],
          phone:[{
            required: true, pattern:/^1[3456789]\d{9}$/,message:'请选择正确手机号',trigger: 'change'}],
          username:[{
            required: true, message:'用户名必填',trigger: 'change'}]
        },
        dialogFormVisible: false,
        }
    },
    created(){
        this.getList();
    },
    methods:{
        getList(){
            this.listLoading = true
            getWechatUser(this.listQuery).then(response=>{
                this.list = response.respObj.item
                this.total = response.respObj.total
                this.listLoading = false
                this.list.forEach(item=>{
                  this.srcList.push(item.headimgurl)
                })
            })
            
        },
        handleFilter(){
            this.listQuery.page = 1
            this.getList()
        },
        handleUpdate(row) {
          // this.resetTemp()

          this.dialogFormVisible = true
          this.temp = row
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        },
        updateData(){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              postWechatUserUp(this.temp).then(response => {
                  this.dialogFormVisible = false
                  this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                })
              })
            }
          })
        },
        resetTemp(){
          this.temp={
            openId:undefined,
            nickname:undefined,
            username:undefined,
            headimgurl:'',
            address:undefined,
            phone:undefined,
          }
        },
        sortChange(data) { // 排序
            const { prop, order } = data
            if (prop === 'create_date') {
                if (order === 'ascending') {
                this.list.sort(function(a, b) {
                    return b.createDate < a.createDate ? 1 : -1
                })
                } else if (order === 'descending') {
                this.list.sort(function(a, b) {
                    return b.createDate < a.createDate ? -1 : 1
                })
                }
            }
        },
        errorHandler() {
          return true
        },
    }
 }
</script>