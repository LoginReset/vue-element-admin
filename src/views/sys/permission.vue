<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.permission"
        placeholder="权限名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.menuName"
        placeholder="菜单名"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.filterUrl"
        placeholder="路径"
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
        perms="sys-permission:add"
        type="primary"
        label="table.add"
        @click="handleCreate"
      />
      <PButton
        class="filter-item"
        icon="el-icon-refresh"
        perms="sys-permission:add"
        type="primary"
        label="table.override"
        @click="handleOverride"
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
      <el-table-column label="权限名" align="left" min-width="250px">
        <template slot-scope="{row}">
          <!-- <el-tag v-if="row.description=='冲突'" type="danger">{{ row.permission }}</el-tag>
          <el-tag v-else-if="row.description=='1'">{{ row.permission }}</el-tag> -->
          <el-tag  type="success">{{ row.permission }}</el-tag>

        </template>
      </el-table-column>
      <el-table-column label="菜单名" align="center" min-width="150px">
        <template slot-scope="{row}">
          <el-tag>{{ row.menuName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="路径" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.filterUrl?row.filterUrl:'无' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
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
            perms="sys-permission:edit"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row)"
          />

          <PButton
            v-if="row.status!='deleted'"
            class="filter-item"
            perms="sys-permission:delete"
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
        <el-form-item label="权限名" prop="permission">
          <el-input v-model.trim="temp.permission" clearable placeholder="请输入权限名" />
        </el-form-item>
        <el-form-item label="菜单名" prop="menuName">
          <el-input v-model.trim="temp.menuName" clearable placeholder="请输入菜单名" />
        </el-form-item>
        <el-form-item label="路径" prop="filterUrl">
          <el-input v-model.trim="temp.filterUrl" clearable placeholder="请输入路径" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="temp.description"
            :autosize="{ minRows: 2, maxRows: 10}"
            type="textarea"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item v-if="showPermissionAllSelect" label="菜单" prop="puuid">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            class="permission-tree"
            :data="permissionAll"
            show-checkbox
            node-key="uuid"
            :props="treeProp"
            @check="treeCheck"
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
import store from '@/store'
import { getPermissions, getPermissionAll, postPermissionAdd,postPermissionOver, postPermissionUp, getPermissionDel } from '@/api/sys'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// 按钮组件 全局使用
import PButton from '@/components/PermissionBtn'

export default {
  name: 'permission',
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
        permission: undefined,
        menuName: undefined,
        filterUrl: undefined
      },
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        uuid: undefined,
        permission: '',
        description: '',
        menuName: '',
        filterUrl: '',
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
        permission: [{ required: true, message: '权限名必填', trigger: 'change' },
          { max: 50, message: '长度不能超过50字符', trigger: 'change' }],
        menuName: [{ required: true, message: '菜单名必填', trigger: 'change' },
          { max: 30, message: '长度不能超过30字符', trigger: 'change' }],
        // filterUrl: [{ required: true, message: '路径必填', trigger: 'change' },
        //   { max: 50, message: '长度不能超过50字符', trigger: 'change' }],
        description: [{ max: 200, message: '长度不能超过200字符', trigger: 'change' }],
        sort: [{ validator: checkSort, trigger: 'change' }]
      },
      downloadLoading: false,
      treeProp: {
        children: 'children',
        label: 'menuName'
      },
      checkStrictly: true,
      showPermissionAllSelect: true,
      currentRow: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getPermissions(this.listQuery).then(response => {
        this.list = response.respObj.item
        console.log(this.list)
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
        permission: '',
        description: '',
        menuName: '',
        filterUrl: '',
        sort: 0
      }
    },
    showPermissionAll() {
      getPermissionAll().then(response => {
        this.permissionAll = response.respObj.item
      })
    },
    handleCreate() {
      this.$refs.tree&&this.$refs.tree.setCheckedKeys([])
      this.showPermissionAllSelect = true
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
      const checkedUuid = this.$refs.tree.getCheckedKeys()
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          postPermissionAdd(Object.assign(this.temp, { puuid: (checkedUuid.length > 0 ? checkedUuid[0] : undefined) })).then(response => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })

          //
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          // this.temp.author = 'vue-element-admin'
          // createArticle(this.temp).then(() => {
          //   this.list.unshift(this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: '成功',
          //     message: '创建成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },
    handleUpdate(row) {
      this.showPermissionAllSelect = false
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.filterUrl === '' ? this.temp.filterUrl = undefined : this.temp.filterUrl
          const tempData = Object.assign({}, this.temp)
          postPermissionUp(tempData).then(response => {
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
      this.$confirm('确定删除当前权限及子孙权限?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const param = []
        param.push(row.uuid)
        const requestData = { uuids: param.toString() }
        getPermissionDel(requestData).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
          // this.list.splice(index, 1)
        })
      }).catch(err => {

      })
    },
    handleOverride(){
      this.$confirm('确定重构权限?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        postPermissionOver().then(response=>{
          console.log(response)
          this.$notify({
            title: '成功',
            message: '重构成功',
            type: 'success',
            duration: 2000
          })
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
    },
    treeCheck(data, status) {
      console.log(data)
      console.log(status)
      this.$refs.tree.setCheckedKeys([])
      if (status.checkedKeys.length !== 0) {
        this.$refs.tree.setCheckedKeys([data.uuid])
      }
    }

  }
}

</script>

<style scoped>
  .permission-tree {
    margin-bottom: 30px;
  }
  .el-tag{
    font-size:14px;
  }
</style>
