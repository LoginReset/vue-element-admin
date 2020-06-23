<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <PButton
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
      <el-table-column label="序号" prop="id" align="center" type="index" width="50" />
      <el-table-column label="模板名称" align="center" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务平台" align="center">
        <template slot-scope="{row}">
          <el-tag v-show="row.type===0">阿里云短信</el-tag>
          <el-tag v-show="row.type===1" type="success">腾讯短信</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
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
      <el-table-column label="创建时间" align="center" sortable="custom" prop="create_date">
        <template slot-scope="{row}">
          <span>{{ row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">

          <PButton
            class="filter-item"
            perms="edit"
            role="sys-permission"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row)"
          />

          <PButton
            v-if="row.status!='deleted'"
            class="filter-item"
            perms="delete"
            role="sys-permission"
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
import { getTemplateAll, getTemplates, postTemplateAdd, postTemplateUp, getTemplateDel } from '@/api/sms'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import PButton from '@/components/PermissionBtn'
import { hasBtnPermission } from '@/utils/permission'

export default {
  name: 'Template',
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
        orderField: undefined,
        orderType: undefined, // desc|asc
        type: undefined,
        title: undefined,
        status: undefined
      },
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        uuid: undefined,
        type: 0,
        title: undefined,
        status: 1,
        // 阿里云
        other0: {
          signName: undefined,
          templateCode: undefined,
          smsUpExtendCode: undefined,
          outId: undefined,
          templateParam: [{
            smsField: undefined,
            name: undefined,
            value: undefined
          }]

        },
        // 腾讯
        other: {
          appid: undefined,
          sign: undefined,
          senderid: undefined,
          session: undefined,
          extendcode: undefined,
          templateID: undefined,
          templateParam: [{
            name: undefined,
            value: undefined
          }]
        }
      },
      dialogFormVisible: false,
      innerVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {

      },
      downloadLoading: false
    }
  },
  watch: {
    $route() {
      // if(this.$route.path===)
      console.log(this.$route.path)
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      console.log(this.listQuery)
      this.listLoading = false

      getTemplates(this.listQuery).then(response => {
        console.log(response)
        this.list = response.respObj.item
        this.total = response.respObj.total
        // Just to simulate the time of the request
        // setTimeout(() => {
        // }, 1.5 * 1000)
      })
    },
    addParam() {
      let key = 'other0'
      this.temp.type === 0 ? key : key = 'other'

      this.temp[key].templateParam.push({
        smsField: '',
        name: '',
        value: '',
        key: Date.now()
      })
    },
    removeParam(item) {
      let key = 'other0'
      this.temp.type === 0 ? key : key = 'other'

      const index = this.temp[key].templateParam.indexOf(item)
      if (index !== 0) {
        this.temp[key].templateParam.splice(index, 1)
      }
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
    resetTemp() {
      this.temp = {
        uuid: undefined,
        type: 0,
        title: '',
        status: 1,
        // 阿里云
        other0: {
          signName: undefined,
          templateCode: undefined,
          smsUpExtendCode: undefined,
          outId: undefined,
          templateParam: [{
            smsField: undefined,
            name: undefined,
            value: undefined
          }]

        },
        // 腾讯
        other: {
          appid: undefined,
          sign: undefined,
          senderid: undefined,
          session: undefined,
          extendcode: undefined,
          templateID: undefined,
          templateParam: [{
            name: undefined,
            value: undefined
          }]
        }
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
    showTemplateAll() {
      getTemplateAll().then(response => {
        this.roleList = response.respObj.item
      })
    },
    openInner(name) {
      console.log(56656)
      this.innerVisible = true
      console.log(name)
    },
    handleCreate() {
      this.$router.push({ name: 'createTemplate' })
    },
    JsonData() {
      var data = {}

      const temp1 = JSON.stringify(this.temp)
      const temp = JSON.parse(temp1)
      if (temp.type === 0) {
        data = {}
        console.log(data)
        for (const key in temp) {
          if (key !== 'other') {
            console.log(44545)
            if (key === 'other0') {
              data.other = temp['other0']
              const templateParam = JSON.stringify(temp[key].templateParam)
              data.other.templateParam = templateParam
            } else {
              data[key] = temp[key]
            }
          }
        }
      } else {
        data = {}
        for (const key in temp) {
          if (key !== 'other0') {
            if (key === 'other') {
              const templateParam = JSON.stringify(temp[key].templateParam)
              data.other.templateParam = templateParam
            } else {
              data[key] = temp[key]
            }
          }
        }
      }
      return data
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp)
          const data = this.JsonData()
          console.log(data)

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
      this.$router.push({ name: 'editTemplate' })
      const data = JSON.stringify(row)
      sessionStorage.setItem('templateData', data)
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
        console.log(requestData)
        getTemplateDel(requestData).then(response => {
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
    },
    JsonData(tempData) {
      const data = {}
      data.type = tempData.type
      data.uuid = tempData.uuid
      data.title = tempData.title
      data.status = tempData.status
      tempData.txSmsParam ? data.other = tempData.txSmsParam : data.other = tempData.aliSmsParam
      return data
    },
    statusChange(status, row) {
      var data = {}
      data = this.JsonData(row)
      console.log(data)
      postTemplateUp(data).then(response => {
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
