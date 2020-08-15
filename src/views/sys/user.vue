<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.account"
        placeholder="管理员账号"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.phoneNum"
        placeholder="管理员手机号"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        placeholder="管理员姓名"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.status"
        clearable
        style="width: 140px"
        class="filter-item"
        placeholder="请选择状态"
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
        perms="sys-user:add"
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
      <el-table-column label="账号" align="center" width="220">
        <template slot-scope="{row}">
          <el-tag>{{ row.account }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" width="120">
        <template slot-scope="{row}">
          <el-tag type="success">{{ row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" width="200">
        <template slot-scope="{row}">
          <el-tag type="info">{{ row.phoneNum }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="220">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.status"
            :active-value="Number(1)"
            :inactive-value="Number(0)"
            active-text="启用"
            inactive-text="禁用"
            :disabled="!hasPerms('sys-user:switch')"
            @change="statusChange($event,row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" sortable="custom" prop="sort" width="100">
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
            perms="sys-user:edit"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row)"
          />
          <PButton
            perms="sys-user:delete"
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
        label-width="100px"
        style="width: 400px; margin-left:50px;">
          <el-form-item label="账号" prop="account">
            <el-input v-model.trim="temp.account" clearable placeholder="请输入账号" />
          </el-form-item>
          <el-form-item v-if="dialogStatus === 'create'" label="密码" prop="pwd">
            <el-input v-model.trim="temp.pwd" clearable placeholder="请输入密码" show-password />
          </el-form-item>
          <el-form-item v-if="dialogStatus === 'create'" label="确认密码" prop="confirmPwd">
            <el-input v-model.trim="temp.confirmPwd" clearable placeholder="请确认密码" show-password />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model.trim="temp.name" clearable placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="手机号" prop="phoneNum">
            <el-input v-model.trim="temp.phoneNum" clearable placeholder="请输入手机号" />
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
          <el-form-item label="角色" prop="puuid">
            <el-tree
              ref="tree"
              default-expand-all
              class="role-tree"
              :data="roleList"
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
import { getRoles, getUsers, postUserAdd, postUserUp, postUserStatus,postUserDel } from '@/api/sys'
import waves from '@/directive/waves' // waves directive
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import PButton from '@/components/PermissionBtn'
import { hasBtnPermission } from '@/utils/permission'

export default {
  name: 'user',
  components: { Pagination, PButton },
  directives: { waves },
  data() {
    // 验证序号
    var checkSort = (rule, value, callback) => {
      if (!value) {
        callback()
      }
      if (!/^[0-9]+$/.test(value)) {
        callback(new Error('序号必须是数字'))
      }
      if (parseInt(value) > 9999 || parseInt(value) < -9999) {
        callback(new Error('序号范围[-9999,9999]'))
      }
      callback()
    }
    // 确认密码
    var confirmPwd = (rule, value, callback) => {
      if (this.temp.pwd !== value) {
        callback(new Error('前后密码不一致'))
      }
      callback()
    }
    // 验证手机号
    var checkPhoneNum = (rule, value, callback) => {
      if (!/^[0-9]{11}$/.test(value)) {
        callback(new Error('手机号必须是11位数字'))
      }
      callback()
    }

    return {
      tableKey: 0,
      list: [],
      deviceData:[],
      roleList: null,
      total: 0,
      cTotal: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        orderField: undefined,
        orderType: undefined, // desc|asc
        account: undefined,
        phoneNum: undefined,
        name: undefined,
        status: undefined
      },
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        uuid: undefined,
        account: '',
        pwd: '',
        confirmPwd: '',
        phoneNum: '',
        name: '',
        description:'',
        sort: 0,
        sysRole: undefined
      },
      disable:true,//禁用
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create',
        device: 'Device'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        account: [{ required: true, message: '账号必填', trigger: 'change' },
          { min: 8, max: 20, message: '长度范围[8,20]字符', trigger: 'change' }],
        pwd: [{ required: true, message: '密码必填', trigger: 'change' },
          { min: 6, max: 100, message: '长度范围[6,100]字符', trigger: 'change' }],
        confirmPwd: [{ required: true, message: '请确认密码', trigger: 'change' },
          { validator: confirmPwd, trigger: 'change' }],
        phoneNum: [{ required: true, message: '手机号必填', trigger: 'change' },
          { validator: checkPhoneNum, trigger: 'change' }],
        name: [{ required: true, message: '姓名必填', trigger: 'change' },
          { min: 2, max: 10, message: '长度范围[2,10]字符', trigger: 'change' }],
        sort: [{ validator: checkSort, trigger: 'change' }]
      },
      downloadLoading: false,
      treeProp: {
        children: 'children',
        label: 'roleName'
      }
    }
  },
  computed: {
    ...mapGetters([
      'admin'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getUsers(this.listQuery).then(response => {
        this.list = response.respObj.item
        this.total = response.respObj.total
        // Just to simulate the time of the request
        // setTimeout(() => {
        this.listLoading = false
        // }, 1.5 * 1000)
        const query = {
          page:1,
          limit:20
        }
     
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
        account: '',
        pwd: '',
        confirmPwd: '',
        phoneNum: '',
        name: '',
        description:'',
        sort: 0,
        sysRole: undefined
      }
    },
    checkedRole() {
      const checkedUuid = this.$refs.tree.getCheckedKeys()
      if (checkedUuid.length === 0) {
        this.$notify({
          title: '警告',
          message: '请选择角色',
          type: 'warning',
          duration: 2000
        })
        return []
      }
      return checkedUuid
    },
    showRoleAll() {
      getRoles().then(response => {
        this.roleList = response.respObj.item
        if (this.dialogStatus === 'update') {
          this.$refs.tree.setCheckedKeys([])
          this.$refs.tree.setCheckedKeys([this.temp.sysRole])
        }
      })
    },
    handleCreate() {
      this.disable = false
      this.showRoleAll()
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      console.log(this.temp.description)
      this.temp.description = this.temp.description.trim()
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const roleUuids = this.checkedRole()
          if (roleUuids.length === 0) {
            return
          }
          this.temp.sysRole = roleUuids[0]
          console.log(this.temp)
          postUserAdd(this.temp).then(response => {
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
      this.disable = true
      console.log(this.disable)
      console.log(row)
      this.temp = Object.assign({}, row) // copy obj
      this.showRoleAll()
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      console.log(this.temp.description)

    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const roleUuids = this.checkedRole()
          if (roleUuids.length === 0) {
            return
          }
          if(this.temp.description){
            this.temp.description = this.temp.description.trim()
          }
          this.temp.sysRole = roleUuids[0]
          postUserUp(this.temp).then(response => {
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
      this.$confirm('确定删除当前管理员吗?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const param = []
        param.push(row.uuid)
        const requestData = { uuids: param }
        postUserDel(requestData).then(response => {
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
    // handleDevice(row){
    //   this.deviceData = row.devices
    //   console.log(this.deviceData)
    //   this.dialogStatus = 'device'
    //   this.dialogFormVisible = true
    // },
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
      this.$refs.tree.setCheckedKeys([])
      if (status.checkedKeys.length !== 0) {
        this.$refs.tree.setCheckedKeys([data.uuid])
      }
    },
    statusChange(status, row) {
      const formData = new FormData()
      formData.append('uuids', row.uuid)
      formData.append('status', status)
      postUserStatus(formData).then(response => {
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
  .role-tree {
    margin-bottom: 30px;
  }
  .el-tag{
    font-size: 14px;
  }
</style>
