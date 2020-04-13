<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.permission" placeholder="权限名" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.menuName" placeholder="菜单名" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.filterUrl" placeholder="路径" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                 @click="handleDownload">
        {{ $t('table.export') }}
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
      row-key="permission"
      :tree-props="{children: 'children'}"
    >
      <!--<el-table-column label="序号" prop="id" sortable="custom" align="center" :class-name="getSortClass('id')">-->
      <!--<template slot-scope="{row}">-->
      <!--<span>{{ row.uuid }}</span>-->
      <!--</template>-->

      <!--</el-table-column>-->
      <el-table-column label="序号" prop="id" align="center"
                       type="index"
                       width="50">
      </el-table-column>
      <el-table-column label="权限名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.permission}}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单名" align="center" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
          <el-tag>{{ row.menuName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="路径" align="center">
        <template slot-scope="{row}">
          <span>{{ row.filterUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" sortable="custom" prop="sort">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" sortable="custom" prop="create_date">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.createDate }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column :label="$t('table.importance')" width="80px">-->
      <!--<template slot-scope="{row}">-->
      <!--<svg-icon v-for="n in +row.importance" :key="n" icon-class="star" class="meta-item__icon" />-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column :label="$t('table.readings')" align="center" width="95">-->
      <!--<template slot-scope="{row}">-->
      <!--<span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>-->
      <!--<span v-else>0</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column :label="$t('table.status')" class-name="status-col" width="100">-->
      <!--<template slot-scope="{row}">-->
      <!--<el-tag :type="row.status | statusFilter">-->
      <!--{{ row.status }}-->
      <!--</el-tag>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="权限名" prop="permission">
          <el-input v-model="temp.permission" clearable placeholder="请输入权限名"/>
        </el-form-item>
        <el-form-item label="菜单名" prop="menuName">
          <el-input v-model="temp.menuName" clearable placeholder="请输入菜单名"/>
        </el-form-item>
        <el-form-item label="路径" prop="filterUrl">
          <el-input v-model="temp.filterUrl" clearable placeholder="请输入路径"/>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="temp.description" clearable placeholder="请输入描述"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort" clearable placeholder="请输入排序号"/>
        </el-form-item>
        <el-form-item label="菜单" prop="puuid">
          <el-tree
            default-expand-all
            ref="tree"
            :check-strictly="checkStrictly"
            @check="treeCheck"
            class="permission-tree"
            :data="permissionAll"
            show-checkbox
            node-key="uuid"
            :props=treeProp>
          </el-tree>
          <!--:render-content="renderContent"-->
          <!--:default-expanded-keys="[2, 3]"-->
          <!--:default-checked-keys="[5]"-->
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
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getPermissions, getPermissionAll, postPermissionAdd} from '@/api/sys'
  import waves from '@/directive/waves' // waves directive
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'permission',
    components: {Pagination},
    directives: {waves},
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    data() {
      var checkSort = (rule, value, callback) => {
        if(!value){
          callback();
        }
        if (!/^[0-9]{+}$/.test(value)) {
          return callback(new Error("序号必须是数字"))
        }
        if (parseInt(value) > 9999 || parseInt(value) < -9999) {
          return callback(new Error("序号范围[-9999,9999]"))
        }
        callback();
      };
      return {
        tableKey: 0,
        list: null,
        permissionAll: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          orderField: undefined,
          orderType: undefined,//desc|asc
          permission: undefined,
          menuName: undefined,
          filterUrl: undefined,
        },
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          uuid: undefined,
          permission: '',
          description: '',
          menuName: '',
          filterUrl: '',
          sort: 0,
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
          permission: [{required: true, message: '权限名必填', trigger: 'change'},
            {max: 50, message: '长度不能超过50字符', trigger: 'change'}],
          menuName: [{required: true, message: '菜单名必填', trigger: 'change'},
            {max: 30, message: '长度不能超过30字符', trigger: 'change'}],
          filterUrl: [{required: true, message: '路径必填', trigger: 'change'},
            {max: 50, message: '长度不能超过50字符', trigger: 'change'}],
          description: [{max: 200, message: '长度不能超过200字符', trigger: 'change'}],
          sort: [{validator: checkSort, trigger: 'change'}]
        },
        downloadLoading: false,
        treeProp: {
          children: 'children',
          label: 'description'
        },
        checkStrictly:true
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getPermissions(this.listQuery).then(response => {
          console.log(response)
          this.list = response.respObj.item
          this.total = response.respObj.total

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
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
      sortChange(data) {
        const {prop, order} = data;
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
        console.log(data)
        this.handleFilter();
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
      handleCreate() {
        getPermissionAll().then(response => {
          console.log(response)
          this.permissionAll = response.respObj.item
          console.log(this.permissionAll)
        })
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        const checkedUuid = this.$refs.tree.getCheckedKeys();
        console.log(checkedUuid)
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            postPermissionAdd(Object.assign(this.temp,{puuid:(checkedUuid.length > 0?checkedUuid[0]:undefined)})).
            then(response=>{
              this.dialogFormVisible = false;
              this.getList();
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
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateArticle(tempData).then(() => {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
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
      handleDelete(row, index) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      },
      handleFetchPv(pv) {
        fetchPv(pv).then(response => {
          this.pvData = response.data.pvData
          this.dialogPvVisible = true
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
        this.$refs.tree.setCheckedKeys([]);
        console.log(status)
        if (status.checkedKeys.length !== 0) {
          this.$refs.tree.setCheckedKeys([data.uuid]);
        }
      }
    }
  }

</script>

<style scoped>
  .permission-tree {
    margin-bottom: 30px;
  }
</style>
