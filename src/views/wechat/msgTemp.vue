<template>
  <div class="app-container">
    <div class="filter-container">

      <el-input
        v-model="listQuery.template_id"
        placeholder="微信模板ID"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
        />
      <el-input
        v-model="listQuery.template_name"
        placeholder="模板名称"
        style="width: 200px;"
        class="filter-item"
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
        perms="wechat-msgTemp:add" 
        type="primary"
        label="table.add"  
        @click="handleCreate"/>
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
      <el-table-column label="模板ID" align="center" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.templateId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模板名称" align="center">
        <template slot-scope="{row}">
          <span>{{row.templateName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="小程序appid" align="center">
        <template slot-scope="{row}">
          <span>{{row.appid}}</span>
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
            perms="wechat-msgTemp:vertify"
            type="success" 
            size="mini" 
            label="table.vertify"
            @click="handleVertify(row)">
          </PButton>
          <PButton
            class="filter-item"
            perms="wechat-msgTemp:edit"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row)"
          />

          <PButton
            v-if="row.status!='deleted'"
            class="filter-item"
            perms="wechat-msgTemp:delete"
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
    <el-dialog title="vertify" :visible.sync="dialogFormVisible">
      <el-form ref="vertifyForm" :model="vertifyForm" 
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;">
        <el-form-item v-for="(user,index) in vertifyForm.tousers" label="微信openId" 
          :key="user.key" :prop="'tousers.'+index+'.value'"
          :rules="{required: true, message: '微信openId必填', trigger: 'change'}" >
          <el-col :span="20">
            <el-input v-model="user.value"></el-input>
          </el-col>
          <el-col :span="3" style="margin-left:10px">
            <el-button @click.prevent="removeDomain(user)" type="danger">删除</el-button>
          </el-col>
        </el-form-item>
          <el-button @click="addDomain" style="margin-left:100px">新增接收方</el-button>
        <el-form-item>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="vertify">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { postMsgTempSave, postMsgTempUpdate, postMsgTempDel, getMsgTemp,postWechatVertify } from '@/api/wechat'

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
      vertifyForm:{
        tousers:[{
          value:''
        }],
        uuid:undefined,
      },
      roleList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        template_id: undefined,
        template_name: undefined,
        status: undefined
      },
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        uuid: undefined,
        appid : undefined,
        pagePath : undefined,
        status: 1,
        template_id:undefined,
        template_name:undefined,
        url:undefined,
        templateParams: [{
          uuid:undefined,
          color : undefined,
          name: undefined,
          value: undefined
        }],
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
      downloadLoading: false
    }
  },
  watch: {
    $route() {
      // if(this.$route.path===)
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true

      getMsgTemp(this.listQuery).then(response => {
        console.log(response)
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
    showTemplateAll() {
      getTemplateAll().then(response => {
        this.roleList = response.respObj.item
      })
    },
    handleCreate() {
      this.$router.push({ name: 'createMsgTemp' })
    },
    JsonData() {
      var data = {}
      const temp1 = JSON.stringify(this.temp)
      const temp = JSON.parse(temp1)
      if (temp.type === 0) {
        data = {}
        for (const key in temp) {
          if (key !== 'other') {
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
      this.$router.push({ name: 'editMsgTemp' })
      const data = JSON.stringify(row)
      sessionStorage.setItem('msgTempData', data)
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
        postMsgTempDel(requestData).then(response => {
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
    handleVertify(row){
      this.vertifyForm.uuid = row.uuid
      this.dialogFormVisible = true

    },
    vertify(){
      const wechatMsgParam = {
        tousers:[],
      }
      this.vertifyForm.tousers.forEach(item=>{
        wechatMsgParam.tousers.push(item.value)
      })
      wechatMsgParam.uuid = this.vertifyForm.uuid
      postWechatVertify(wechatMsgParam).then(response=>{
        if(response.code===0){
          this.$message({
            message:response.errorMsg,
            type:'success'
          })
        }
        console.log(response)
      })
    },
    statusChange(status, row) {
      let dataStr = JSON.stringify(row)
      const data = JSON.parse(dataStr)
      data.template_id = data.templateId
      data.template_name = data.templateName
      console.log(data)
      postMsgTempUpdate(data).then(response => {
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
    },
    
    addDomain() {
        this.vertifyForm.tousers.push({
          value: '',
          key: Date.now()
        });
      },
    removeDomain(item) {
      console.log(item)
        var index = this.vertifyForm.tousers.indexOf(item)
        if (index !== 0) {
          this.vertifyForm.tousers.splice(index, 1)
        }
      },
  }
}
</script>
