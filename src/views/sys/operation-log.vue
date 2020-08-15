<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.account"
        clearable
        placeholder="管理员账号"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.name"
        clearable
        placeholder="管理员姓名"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.logType"
        clearable
        style="width: 180px"
        class="filter-item"
        placeholder="请选择日志类型"
        @change="handleFilter"
      >
        <el-option key="1" label="接口日志" :value="1" />
        <el-option key="0" label="操作日志" :value="0" />
      </el-select>
       <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
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
      <el-table-column label="账号" align="center" width="200">
        <template slot-scope="{row}">
          <el-tag>{{row.account}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日志" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="ip地址" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" align="center">
        <template slot-scope="{row}">
          <span>{{ row.content }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          <span>{{ row.errcode==='0'?'成功':'失败'}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="日志类型" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.logType===1?'接口日志':'操作日志' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" sortable="custom" prop="create_date" width="220">
        <template slot-scope="{row}">
          <span>{{ row.createDate }}</span>
        </template>
      </el-table-column>
      
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"/>
      
  </div>
</template>
<script>
import {getLog} from '@/api/sys'
import PButton from '@/components/PermissionBtn'
import waves from '@/directive/waves' // waves directive

import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export default {
  name:'operation-log',
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
      listQuery:{
        page:1,
        limit:20,
        account:undefined,
        name:undefined,
        logType:undefined,
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
    }
  },
  created(){
    this.getList();
  },
  methods:{
    getList(){
      this.listLoading = true
      getLog(this.listQuery).then(response=>{
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
    console.log(11111111111111111)
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
    }
  }
}
</script>
<style scoped>
    .el-tag{
        font-size: 14px;
    }
</style>