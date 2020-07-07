<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.roleName"
        placeholder="角色名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <PButton
        class="filter-item"
        icon="el-icon-edit"
        perms="add"
        role="sys-role"
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
      row-key="permission"
      :tree-props="{children: 'children'}"
      @sort-change="sortChange"
    >
      <el-table-column
        label="序号"
        prop="id"
        align="center"
        type="index"
        width="50"
      />
      <el-table-column label="角色名" align="center" width="220">
        <template slot-scope="{row}">
          <el-tag type="success">{{ row.roleName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" sortable="custom" prop="sort" width="220">
        <template slot-scope="{row}">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" sortable="custom" prop="create_date" width="220">
        <template slot-scope="{row}">
          <span>{{ row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <PButton
            perms="edit"
            role="sys-role"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row)"
          />
          <PButton
            v-if="row.status!='deleted'"
            class="filter-item"
            perms="delete"
            role="sys-role"
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="角色名" prop="permission">
          <el-input v-model.trim="temp.roleName" clearable placeholder="请输入角色名" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.trim="temp.sort" clearable placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="temp.description"
            :autosize="{ minRows: 2, maxRows: 10}"
            type="textarea"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="系统权限" prop="puuid">
          <el-tree
            ref="tree"
            default-expand-all
            class="permission-tree"
            :data="permissionAll"
            show-checkbox
            node-key="uuid"
            :props="treeProp"
          />
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
import { getRoles, getPermissionAll, postRoleAdd, postRoleUp, getRoleDel } from '@/api/sys'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import PButton from '@/components/PermissionBtn'
export default {
  name: 'Role',
  components: { Pagination, PButton },
  directives: { waves },
  data() {
    var checkSort = (rule, value, callback) => {
      if (!value) {
        callback()
      }
      if (!/^[0-9]+$/.test(value)) {
        return callback(new Error('序号必须是数字'))
      }
      if (parseInt(value) > 9999 || parseInt(value) < -9999) {
        return callback(new Error('序号范围[-9999,9999]'))
      }
      callback()
    }
    return {
      tableKey: 0,
      list: [],
      permissionAll: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        orderField: undefined,
        orderType: undefined, // desc|asc
        roleName: undefined
      },
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        uuid: undefined,
        roleName: '',
        description: '',
        sort: 0
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
        roleName: [{ required: true, message: '角色名必填', trigger: 'change' },
          { max: 30, message: '长度不能超过30字符', trigger: 'change' }],
        description: [{ max: 200, message: '长度不能超过200字符', trigger: 'change' }],
        sort: [{ validator: checkSort, trigger: 'change' }]
      },
      downloadLoading: false,
      treeProp: {
        children: 'children',
        label: 'menuName'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getRoles(this.listQuery).then(response => {
        this.list = response.respObj.item
        this.total = response.respObj.total
        // Just to simulate the time of the request
        // setTimeout(() => {
        this.listLoading = false
        // }, 1.5 * 1000)
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
    resetTemp() {
      this.temp = {
        uuid: undefined,
        roleName: '',
        description: '',
        sort: 0
      }
    }, checkedPermission() {
      const checkedUuid = this.$refs.tree.getCheckedKeys()
      if (checkedUuid.length === 0) {
        this.$notify({
          title: '警告',
          message: '请选择权限',
          type: 'warning',
          duration: 2000
        })
        return []
      }
      return checkedUuid
    },
    showPermissionAll() {
      getPermissionAll().then(response => {
        this.permissionAll = response.respObj.item
        if (this.dialogStatus === 'update') {
          this.$refs.tree.setCheckedKeys(this.temp.permissions) // this.temp.permissions===permission的uuid
        }
      })
    },
    handleCreate() {
      this.showPermissionAll()
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.temp.description = this.temp.description.trim()

    },
    createData() {
      const permiUuids = this.checkedPermission()
      if (permiUuids.length === 0) {
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          postRoleAdd(Object.assign(this.temp, { permissionList: permiUuids })).then(response => {
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
      this.showPermissionAll()
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.temp.description = this.temp.description.trim()

    },
    updateData() {

      const permiUuids = this.checkedPermission()
      if (permiUuids.length === 0) {
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({ permissionList: permiUuids }, this.temp)

          postRoleUp(tempData).then(response => {
            // const index = this.list.findIndex(v => v.id === this.temp.id)
            // this.list.splice(index, 1, this.temp)
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
    handleDelete(row, index) {
      this.$confirm('确定删除当前角色吗?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const param = []
        param.push(row.uuid)
        const requestData = { uuids: param.toString() }
        getRoleDel(requestData).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          // this.getList();
          this.list.splice(index, 1)
        })
      }).catch(err => {

      })
    },
    handleDownload() {
      this.downloadLoading = true
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
            const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
            const data = this.formatJson(filterVal)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: 'table-list'
            })
            this.downloadLoading = false
          })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style scoped>
  .permission-tree {
    margin-bottom: 30px;
  }
</style>
