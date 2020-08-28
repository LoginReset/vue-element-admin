<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.searchText"
        clearable
        placeholder="角色描述或密钥"
        style="width: 300px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <PButton
        class="filter-item"
        icon="el-icon-edit"
        perms="sys-secretKey:add"
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
      @sort-change="sortChange"
    >
      <el-table-column
        label="序号"
        prop="id"
        align="center"
        type="index"
        width="50"
      />
      <el-table-column label="Key" align="center" width="300">
        <template slot-scope="{row}">
          <el-tag type="success">{{ row.secretKey }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效时间" align="center" sortable="custom" prop="valid_date">
        <template slot-scope="{row}">
          <span>{{ row.validDate == '-1' ? '永久有效' :row.validDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" sortable="custom" prop="create_date" width="220">
        <template slot-scope="{row}">
          <span>{{ row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" sortable="custom" prop="update_date" width="220">
        <template slot-scope="{row}">
          <span>{{ row.updateDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <PButton
            class="filter-item"
            perms="sys-secretKey:change"
            role="sys-secretKey"
            size="mini"
            type="success"
            label="table.change"
            @click="handleChange(row)"
          />
          <PButton
            perms="sys-secretKey:edit"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row)"
          />
          <PButton
            v-if="row.status!='deleted'"
            class="filter-item"
            perms="sys-secretKey:delete"
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
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="temp.description"
            :autosize="{ minRows: 2, maxRows: 10}"
            type="textarea"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="日期" prop="validDate">
          <el-date-picker v-model="temp.validDate" type="date" placeholder="选择日期" :picker-options="pickerOptions" @change="changeDate(temp.validDate)"  />
          <el-radio v-model="validDate" label="-1" style="margin-left:20px" @click.native.prevent="clickItem('-1')">永久有效</el-radio>
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
import { getSecreteKey, getSecreteKeyAll, postSecreteKeyAdd, postSecreteKeyUp, postSecreteKeyChange, getSecreteKeyDel } from '@/api/sys'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import PButton from '@/components/PermissionBtn'
export default {
  name: 'secretKey',
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
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        orderField: undefined,
        orderType: undefined// desc|asc
      },
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        description: '',
        validDate: ''
      },
      validDate: '',
      changeFlag: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        description: [{ max: 200, message: '长度不能超过200字符', trigger: 'change' }],
        sort: [{ validator: checkSort, trigger: 'change' }]
      },
      downloadLoading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() + 3600 * 1000 * 24 <= Date.now()
        }
      }
    }
  },
  watch: {

    // validDate(){

    //   if(this.changeFlag){
    //     this.validDate = ''
    //   }
    // }
  },
  created() {
    this.getList()
  },
  methods: {
    changeDate(validDate) {
      this.changeFlag = true
      if(typeof validDate === 'object'){
        this.validDate = ''
      }
    },
    clickItem(label) {
      console.log(label === this.validate)
      label === this.validDate ? this.validDate = '' : this.validDate = label
      if (this.validDate === '-1') {
        this.temp.validDate = ''
      } else {
        this.temp.validDate = new Date()
      }
    },
    getList() {
      this.listLoading = true
      getSecreteKey(this.listQuery).then(response => {
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
      if (prop === 'create_date' || 'update_date' || 'valid_date') {
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
        description: '',
        validDate: new Date()
      },
      this.validDate = ''
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.temp.description = this.temp.description.trim()
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.validDate == '-1') {
            this.temp.validDate = this.validDate
          } else {
            this.temp.validDate = this.formatter(this.temp.validDate)
          }

          postSecreteKeyAdd(this.temp).then(response => {
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
      this.resetTemp()
      this.temp = Object.assign({},row)
      //为永久有效时
      if(row.validDate === '-1'){
        this.validDate = '-1'
        this.temp.validDate = ''
      }
      this.temp.uuid = row.uuid
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
          if (this.validDate == '-1') {
            this.temp.validDate = this.validDate
          } else {
            this.temp.validDate = this.formatter(this.temp.validDate)
          }
          console.log(this.temp)
          postSecreteKeyUp(this.temp).then(response => {
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
    handleChange(row) {
      this.$confirm('确定更换当前密钥吗?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const param = []
        param.push(row.uuid)
        const requestData = { uuids: param }
        postSecreteKeyChange(requestData).then(response => {
          this.$notify({
            title: '成功',
            message: '更换成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      }).catch(err => {

      })
    },
    handleDelete(row, index) {
      this.$confirm('确定删除当前密钥吗?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const param = []
        param.push(row.uuid)
        const requestData = { uuids: param }
        getSecreteKeyDel(requestData).then(response => {
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
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    formatter(date) {
      //进入编辑时非永久有效不操作则直接返回
      if(typeof date ==='string'){
        return date
      }
      const dd = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      date = year + '-' + month + '-' + day
      return date
    }
  }
}
</script>

<style scoped>
  .permission-tree {
    margin-bottom: 30px;
  }
</style>
