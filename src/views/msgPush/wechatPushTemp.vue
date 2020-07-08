<template>
  <div class="app-container">
    <div class="filter-container">

      <el-input
        v-model.trim="listQuery.description"
        placeholder="描述"
        style="width: 250px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        />
     
     
      <el-select
        v-model="listQuery.type"
        clearable
        style="width: 220px"
        class="filter-item"
        placeholder="选择配置的模板类型"
        @change="handleFilter"
      >
        <el-option
            v-for="(item,index) in types"
            :key="index"
            :label="item"
            :value="index+1">
            </el-option>
        
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <PButton class="filter-item" icon="el-icon-edit" perms="msgPush-wechatTemp:add" type="primary"
        label="table.add"  @click="handleCreate"/>
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
      @sort-change="sortChange"
    >
      <el-table-column label="序号" prop="id" align="center" type="index" width="50" />
      <el-table-column label="配置类型" align="center" min-width="100px">
        <template slot-scope="{row}">
          <el-tag>{{ types[row.type-1] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="微信模板" align="center">
        <template slot-scope="{row}">
          <el-tag type="success">{{row.weChatMsgTemplate.templateName}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="描述" align="center">
        <template slot-scope="{row}">
          <span>{{row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" sortable="custom" prop="create_date">
        <template slot-scope="{row}">
          <span>{{ row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">

          <PButton
            class="filter-item"
            perms="msgPush-wechatTemp:edit"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row)"
          />

          <PButton
            v-if="row.status!='deleted'"
            class="filter-item"
            perms="msgPush-wechatTemp:delete"
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
      @pagination="getList"
    />

  </div>
</template>

<script>
import { postMsgTempSave, postMsgTempUpdate, postMsgTempDel, getMsgTemp } from '@/api/wechat'
import { getConfigView,postConfigDel } from '@/api/wechat'


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
      name: '',
      tableKey: 0,
      list: [],
      roleList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        description: undefined,
        type: undefined,
      },
      types:[
        '订单付款通知(下单已付钱)',
        '订单收货通知',
        '库存预警通知',
        '维权订单通知',
        '发货通知(商家发货)',
      ],
      temp: {
        uuid: undefined,
        description:undefined,
        type:undefined,
        wechatUsers:[],
        weChatMsgUuid:undefined
      },
    }
  },
  watch: {
    $route() {
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getConfigView(this.listQuery).then(response => {
        this.list = response.respObj.item
        this.total = response.respObj.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
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
    handleCreate() {
      this.$router.push({ name: 'create-pushTemp' })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const data = this.JsonData()

          postTemplateAdd(data).then(response => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.$router.push({ name: 'edit-pushTemp' })
      const data = JSON.stringify(row)
      sessionStorage.setItem('wechatPushData', data)
    },
    handleDelete(row, index) {
      this.$confirm('确定删除当前模板吗?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const param = []
        param.push(row.uuid)
        const requestData = { uuids: param }
        postConfigDel(requestData).then(response => {
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
    hasPerms(role, perms) {
      // 根据权限标识和外部指示状态进行权限判断
      return hasBtnPermission(role, perms) // & !this.disabled
    }
  }
}
</script>
