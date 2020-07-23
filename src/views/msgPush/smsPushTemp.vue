<template>
  <div class="app-container">
    <div class="filter-container">
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
      row-key="uuid"
      @sort-change="sortChange">
      <el-table-column label="序号" prop="id" align="center" type="index" width="50" />
      <el-table-column label="配置类型" align="center" min-width="100px">
        <template slot-scope="{row}">
          <el-tag>{{ row.description }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="短信模板" align="center">
        <template slot-scope="{row}">
          <el-tag type="success" v-if="row.smsTemplate">{{row.smsTemplate.title}}</el-tag>
          <el-tag type="info" v-else>无</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" sortable="custom" prop="update_date">
        <template slot-scope="{row}">
          <span>{{ row.updateDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <PButton
            class="filter-item"
            perms="msgPush-smsTemp:edit"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="edit" :visible.sync="dialogFormVisible">
        <el-form
            ref="dataForm"
            :rules="rules"
            :model="temp"
            label-position="left"
            label-width="80px"
            style="width: 400px; margin-left:50px;">
            <el-form-item label="短信模板" prop="tUuid">
                <el-select v-model="temp.tUuid" filterable placeholder="请选择"  style="width:100%">
                    <el-option v-for="item in smsList" 
                    :key="item.uuid" :label="item.title" :value="item.uuid">
                    </el-option>
                </el-select>
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
import { getConfigView,getConfigDel } from '@/api/wechat'
import { getSmsConfig,getTemplateAll,postSmsConfigUp } from '@/api/sms'


import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import PButton from '@/components/PermissionBtn'
import { hasBtnPermission } from '@/utils/permission'

export default {
  name: 'msgTemp',
  components: { Pagination, PButton },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      smsList:[],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        description: undefined,
        type: undefined,
      },
      temp: {
        uuid: undefined,
        tUuid:undefined
      },
      rules:{
        tUuid:[{required: true, message:'请选择模板消息',trigger: 'change'}]
      },
      dialogFormVisible: false,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true

      getSmsConfig().then(response => {
        this.list = response.respObj
        this.listLoading = false
      })
      getTemplateAll().then(response=>{
          this.smsList = response.respObj
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) { // 排序
      const { prop, order } = data
      if (prop === 'update_date') {
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
    handleUpdate(row) {
      this.resetTemp()

      this.dialogFormVisible = true
      this.temp.uuid = row.uuid
      if(row.smsTemplate){
        this.temp.tUuid = row.smsTemplate.uuid
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData(){
        this.$refs['dataForm'].validate((valid) => {
            if (valid) {
            postSmsConfigUp(this.temp).then(response => {
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
    resetTemp(){
      this.temp={
        tUuid:undefined,
        uuid:undefined
      }
    },
    hasPerms(role, perms) {
      // 根据权限标识和外部指示状态进行权限判断
      return hasBtnPermission(role, perms) // & !this.disabled
    }
  }
}
</script>
