<template>
  <div class="app-container">
    <div class="filter-container">
      <PButton
        class="filter-item"
        icon="el-icon-edit"
        perms="add"
        role="sys-secretKey"
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
      row-key="description"
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

      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="变量" align="center" width="300">
        <template slot-scope="{row}">
          <el-tag type="success">{{ row.name?row.name:'无' }}</el-tag>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column label="描述字段" align="center" width="300">
        <template slot-scope="{row}">
          <span>{{ row.descField?row.descField:'无' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="{row}">

          <span>{{ row.type===0 ?'标题':'具体项目' }}</span>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column label="创建时间" align="center" sortable="custom" prop="create_date">
        <template slot-scope="{row}">
          <span>{{ row.createDate }}</span>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">

          <PButton
            perms="edit"
            role="sys-secretKey"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row)"
          />
          <PButton
            v-if="row.status!='deleted'"
            class="filter-item"
            perms="delete"
            role="sys-secretKey"
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
      :page.sync="page"
      :limit.sync="limit"
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
        <el-form-item label="类型" prop="type">
          <el-radio-group v-if="dialogStatus==='update'" v-model="temp.type">
            <el-radio :disabled="disableTitle" :label="0">标题</el-radio>
            <el-radio :disabled="!disableTitle" :label="1">具体项目</el-radio>
          </el-radio-group>
          <el-radio-group v-else v-model="temp.type">
            <el-radio :label="0">标题</el-radio>
            <el-radio :label="1">具体项目</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.type=== 1" label="描述字段" prop="descField">
          <el-radio-group v-model="temp.descField">
            <el-radio :label="1">需要</el-radio>
            <el-radio :label="0">不需要</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="temp.type===1" label="变量" prop="name">
          <el-input v-model="temp.name" clearable placeholder="请输入变量" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="temp.description" clearable placeholder="请输入描述" />
        </el-form-item>

        <el-form-item v-show="dialogStatus==='create'&&temp.type===0" label="分类" prop="puuid">
          <el-tree
            ref="tree"
            default-expand-all
            :check-strictly="checkStrictly"
            class="fieldName-tree"
            :data="fieldNameSelect"
            show-checkbox
            node-key="uuid"
            :props="treeProp"
            @check="treeCheck"
          />

        </el-form-item>
        <el-form-item v-show="dialogStatus==='create'&&temp.type===1" label="分类" prop="puuid">
          <el-tree
            ref="tree"
            default-expand-all
            :check-strictly="checkStrictly"
            class="fieldName-tree"
            :data="fieldNameAll"
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

  </div>
</template>

<script>
import { getSecreteKey, getSecreteKeyAll, postSecreteKeyAdd, postSecreteKeyUp, postSecreteKeyChange, getSecreteKeyDel } from '@/api/sys'
import { getFieldKeyAll, postFieldKeyAdd, postFieldKeyUp, getFieldKeyDel } from '@/api/sys'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import PButton from '@/components/PermissionBtn'
export default {
  name: 'SecretKey',
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
      total: 0,
      page: 1,
      limit: 20,
      listLoading: true,
      listQuery: {

      },
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        uuid: undefined,
        type: 0,
        name: '',
        descField: 0,
        description: ''
      },
      fieldNameAll: [],
      fieldNameSelect: [],
      fieldNameTitle: [],
      fieldNameDetail: [],

      showFileNameSelect: true,
      changeFlag: false,
      dialogFormVisible: false,
      dialogStatus: '',
      disableTitle: false,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [{ required: true, message: '格式：${具体变量,只能是大小写字母和数字组成}',
          pattern: /^\$\{[a-zA-Z0-9]{1,20}\}$/, trigger: 'change' }],
        description: [{ required: true, message: '描述必填', trigger: 'change' }]
        // description:[{required: true, message:'请输入描述'}, trigger:'blur'}]
      },
      downloadLoading: false,
      checkStrictly: true,
      updateKeys: [],
      treeProp: {
        children: 'children',
        label: 'description'
      },
      testList: [],
      puuid: ''
    }
  },
  watch: {
    // temp(){
    //     console.log(temp.type)
    // }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getFieldKeyAll().then(response => {
        const change = JSON.stringify(response.respObj)
        this.fieldNameSelect = JSON.parse(change)
        this.fieldNameAll = JSON.parse(change)
        this.list = response.respObj
        this.total = this.list.length
        if (this.total > this.limit) {
          const start = (this.page - 1) * this.limit
          const end = this.page * this.limit
          this.list = this.list.splice(start, end)
        }

        // 将具体项目选择禁用
        // 一级
        this.fieldNameAll.forEach(item => {
          console.log(item.children.length)
          // 二级
          item.children.forEach(child => {
            child.children.forEach(grandson => {
              grandson['disabled'] = true
            })
          })
        })
        this.fieldNameSelect.forEach(item => {
          if (item.children.length > 0) {
            // 二级
            item.children.forEach(child => {
              child['disabled'] = true
              if (child.children.length > 0) {
                child.children.forEach(grandson => {
                  grandson['disabled'] = true
                })
              }
            })
          }
        })
        this.listLoading = false
      })
    },
    handleFilter() {
      this.getList()
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
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },

    resetTemp() {
      this.temp = {
        uuid: undefined,
        type: 0,
        name: '',
        descField: 0,
        description: ''

      }
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.resetTemp()
      this.dialogFormVisible = true
      this.changeFlag = true

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      const checkedUuid = this.$refs.tree.getCheckedKeys()
      this.$refs['dataForm'].validate((valid) => {
        if (this.temp.type === 1 && checkedUuid.length === 0) {
          this.$notify({
            title: '警告',
            message: '请勾选项目所属分类',
            type: 'error',
            duration: 2000
          })
          return
        }
        if (valid) {
          console.log(this.temp)
          postFieldKeyAdd(Object.assign(this.temp, { puuid: (checkedUuid.length > 0 ? checkedUuid[0] : undefined) })).then(response => {
            console.log(this.temp)
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
      console.log(row)
      this.temp = Object.assign({}, row)

      this.list.forEach(item => {
        if (item.children.length > 0) {
          item.children.forEach(item1 => {
            if (row.type === 0 && item1.uuid === row.uuid) {
              this.puuid = item.uuid
            } else if (row.type === 1) {
              item1.children.forEach(item2 => {
                if (item2.uuid === row.uuid) {
                  this.puuid = item1.uuid
                }
              })
            }
          })
        }
      })
      console.log(this.puuid)

      // this.getPuuid(this.list,row)
      // this.updateKeys = []
      // if(this.changeFlag){
      // console.log(this.$refs.tree.getCheckedKeys())

      //     this.$refs.tree.setCheckedKeys([])
      // console.log(this.$refs.tree.getCheckedKeys())

      //   }
      // this.updateKeys.push(row.uuid)

      row.type === 0 ? this.disableTitle = false : this.disableTitle = true

      this.dialogStatus = 'update'
      this.dialogFormVisible = true

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign(this.temp, { puuid: this.puuid })
          console.log(tempData)

          postFieldKeyUp(tempData).then(response => {
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
      this.$confirm('确定删除当前变量吗?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const param = []
        param.push(row.uuid)
        const requestData = { uuids: param }
        console.log(requestData)
        getFieldKeyDel(requestData).then(response => {
          console.log(requestData)
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
          this.list.splice(index, 1)
        })
      }).catch(err => {

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
      console.log(status)
      this.$refs.tree.setCheckedKeys([])
      console.log(data)
      if (status.checkedKeys.length !== 0) {
        this.$refs.tree.setCheckedKeys([data.uuid])
      }
      console.log(this.$refs.tree.getCheckedKeys())
    }
  }
}
</script>

<style scoped>
  .permission-tree {
    margin-bottom: 30px;
  }
</style>
