<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input 
        v-model.trim="listQuery.title"
        clearable
        placeholder="图片名称"
        style="width: 150px;"
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
        perms="advertise-manage:add"
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
      <el-table-column label="图片" align="center" width="150">
        <template slot-scope="{row}">
          <el-image 
            :src="row.imgUrl" 
            :preview-src-list="srcList">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="{row}">
          <el-tag>{{row.title}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" sortable="custom" prop="sort" width="100">
        <template slot-scope="{row}">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="150">
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
      <el-table-column label="创建时间" align="center" sortable="custom" prop="create_date" width="230">
        <template slot-scope="{row}">
          <span>{{ row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center"  width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <PButton
            perms="advertise-manage:edit"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row)"
          />
          <PButton
            v-if="row.status!='deleted'"
            class="filter-item"
            perms="advertise-manage:delete"
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
      @pagination="getList"/>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="left"
          label-width="100px"
          style="width: 400px; margin-left:50px;">
          <el-form-item label="标题" prop="title">
            <el-input v-model.trim="temp.title" clearable placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model.trim="temp.sort" clearable placeholder="请输入排序" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="temp.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择图片" prop="companyTitle">
            <el-upload
              ref="upload"
              action="#"
              accept="image/png,image/gif,image/jpg,image/jpeg"
              :file-list="modeList"
              :http-request="modeUpload"
              :on-change="fileChange"
              list-type="picture"
              :auto-upload="false"
              >
              <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
              <div slot="tip" class="el-upload__tip">图片宽高比推荐为18:10</div>
            </el-upload>
            <!-- <el-button @click="submitUpload">点击上传文件</el-button> -->
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">
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
import {getEnterpriseView,postEnterpriseAdd,postEnterpriseUp,postImgUpload} from '@/api/enterprise'
import {getAdvertsView,postAdvertsAdd,getAdvertsDel,getAdvertsUp} from '@/api/enterprise'
import PButton from '@/components/PermissionBtn'
import { hasBtnPermission } from '@/utils/permission'
import waves from '@/directive/waves' // waves directive

import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export default {
  name:'advertise-manage',
  directives:{waves},
  components:{
    PButton,
    Pagination
  },
  data(){
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
    return{
      baseUrl:process.env.VUE_APP_BASE_API+'/',
      tableKey:0,
      list:[],
      srcList:[],
      modeList:[],
      total:0,
      temp:{
        uuid:undefined,
        imgUrl:undefined,
        sort:undefined,
        status:1,
        title:undefined,
      },
      listQuery:{
        page:1,
        limit:20,
        name:undefined,
        title:undefined,
        orderType:undefined
      },
      listLoading:false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap:{
        update: 'Edit',
        create: 'Create'
      },
      rules:{
        title:[{ required: true, message: '公司名称必填', trigger: 'change' }],
        sort: [{ validator: checkSort, trigger: 'change' }],
        address:[{required:true, message:'公司地址必填', trigger:'change'}],
        companyTel:[{required:true, message:'公司电话必填', trigger:'change'}],
        linkman:[{required:true, message:'公司联系人必填', trigger:'change'}],
        phone:[{required:true, message:'联系人电话必填', trigger:'change'}],
        qrCodeType:[{required:true, message:'二维码类型必填', trigger:'change'}],
      }
    }
  },
  created(){
    this.getList();
  },
  methods:{
    getList(){
      this.srcList = []
      this.listLoading = true
      getAdvertsView(this.listQuery).then(response=>{
        this.list = response.respObj.item
        this.total = response.respObj.total
        this.list.forEach(item=>{
            this.srcList.push(item.imgUrl)
        })
        this.listLoading = false

      })
    },
    handleFilter(){
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate(){
      this.resetTemp()
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(()=>{
        this.$refs['dataForm'].clearValidate()
      })

    },
    createData(){
      this.$refs['dataForm'].validate((valid) => {
      if(valid){
        postAdvertsAdd(this.temp).then(response=>{
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      }
      })
    },
    handleUpdate(row){
      this.dialogStatus = 'update'
      this.temp = Object.assign({}, row)
      this.modeList = []
      this.modeList.push({
        name:row.title,
        url:row.imgUrl
      })
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          getAdvertsUp(this.temp).then(response => {
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
    handleDelete(row,index){
      this.$confirm('确定删除当前广告?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const param = []
        param.push(row.uuid)
        const requestData = { uuids: param}
        getAdvertsDel(requestData).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      }).catch(err => {

      })
    },
    resetTemp(){
      this.temp = {
        uuid:undefined,
        imgUrl:undefined,
        sort:undefined,
        status:1,
        title:undefined,
      }
      this.modeList = []
    },
    cancel(){
      this.dialogFormVisible = false
    
    },
    statusChange(status, row) {
      // const formData = new FormData()
      // formData.append('uuids', row.uuid)
      // formData.append('status', status)
      this.temp = row
      getAdvertsUp(this.temp).then(response => {
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
    sortChange(data) { // 排序
      const { prop, order } = data
      if (prop === 'sort') {
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
    submitUpload() {
        this.$refs.upload.submit();
    },
    modeUpload(item) {
      this.mode = item.file
      let fd = new FormData()// FormData 对象
      fd.append('file', this.mode)// 文件对象
      postImgUpload(fd).then(response=>{
        this.temp.imgUrl = response.respObj.relUrl
      })
    },
    fileChange(file, fileList) {
      this.modeList = []
      this.modeList.push(file)
      this.submitUpload()

    },
  }
}
</script>
<style scoped>
  .el-upload__tip{
    font-size: 14px;
    color:#fb2121;
  }
</style>
