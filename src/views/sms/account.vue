<template>
  <div class="app-container">
    <div class="filter-container">
      <PButton
        v-if="length<2"
        class="filter-item"
        icon="el-icon-edit"
        perms="add"
        role="sys-user"
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
      <el-table-column label="服务平台" align="center" width="220">
        <template slot-scope="{row}">
          <el-tag v-if="row.type===0">阿里云</el-tag>
          <el-tag v-else type="success">腾讯</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="账号ID" align="center" width="240">
        <template slot-scope="{row}">
          <el-tag>{{ row.accountId }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="账号密钥" align="center">
        <template slot-scope="{row}">
          <el-tag type="success">{{ row.accountSecret }}</el-tag>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column label="状态" align="center" width="220">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.status"
            :active-value="Number(1)"
            :inactive-value="Number(0)"
            active-text="启用"
            inactive-text="禁用"
            :disabled="!hasPerms('sys-user','switch')"
            @change="statusChange($event,row)"
          />
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
            perms="edit"
            role="sys-user"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="服务平台" prop="type">
          <el-radio-group v-model="temp.type">
            <el-radio :label="0" :disabled="disableAli">阿里云短信</el-radio>
            <el-radio :label="1" :disabled="disabletx">腾讯短信</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账号ID" prop="accountId">
          <el-input v-model="temp.accountId" clearable placeholder="请输入账号ID" />
        </el-form-item>
        <el-form-item label="密钥" prop="accountSecret">
          <el-input v-model="temp.accountSecret" clearable placeholder="请输入密钥" />
        </el-form-item>
        <el-form-item label="状态" style="width: 300px;">
          <el-select v-model="temp.status" placeholder="请选择状态">
            <el-option key="1" label="启用" :value="1" />
            <el-option key="0" label="禁用" :value="0" />
          </el-select>
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

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { postAccountSave, getAccount } from '@/api/sms'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import PButton from '@/components/PermissionBtn'
import { hasBtnPermission } from '@/utils/permission'

export default {
  name: 'Account',
  components: { Pagination, PButton },
  directives: { waves },
  data() {
    return {
      disableAli: false,
      disabletx: false,
      length: 0,
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        orderField: undefined,
        orderType: undefined// desc|asc
      },
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        uuid: undefined,
        accountId: '',
        type: undefined,
        status: 1,
        accountSecret: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        accountId: [{ required: true, message: '账号ID必填', trigger: 'change' },
          { min: 4, max: 20, message: '长度范围[4,20]字符', trigger: 'change' }],
        accountSecret: [{ required: true, message: '密钥必填', trigger: 'change' }]

      },
      downloadLoading: false,
      treeProp: {
        children: 'children',
        label: 'roleName'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAccount().then(response => {
        console.log(response)
        this.list = response.respObj
        this.length = response.respObj.length
        console.log(this.list[0].type)
        console.log(this.temp.type)
        if (this.length === 1 && this.list[0].type === 0) {
          this.disableAli = true
          this.disabletx = false
          this.temp.type = 1
        } else if (this.length === 1 && this.list[0].type === 1) {
          this.disableAli = false
          this.disabletx = true
          this.temp.type = 0
        } else {
          this.disableAli = false
          this.disabletx = false
        }

        this.listLoading = false
      })
    },
    handleFilter() {
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
    resetTemp() {
      this.temp = {
        uuid: undefined,
        accountId: '',
        type: 0,
        status: 1,
        accountSecret: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      console.log(this.temp.temp)

      if (this.list[0].type === 0) {
        this.temp.type === 1
      } else {
        this.temp.temp === 0
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp)
          postAccountSave(this.temp).then(response => {
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
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp)
          postAccountSave(this.temp).then(response => {
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
    statusChange(status, row) {
      postAccountSave(row).then(response => {
        this.$notify({
          title: '成功',
          message: '修改状态成功',
          type: 'success',
          duration: 2000
        })
      }).catch(error => {
        row.status = status === 1 ? 0 : 1
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

</style>
