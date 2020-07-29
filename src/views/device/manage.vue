<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.deviceNumber"
        clearable
        placeholder="设备编号"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.deviceName"
        clearable
        placeholder="deviceName"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.batch"
        clearable
        placeholder="设备上传批次"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.title"
        clearable
        placeholder="标题"
        style="width: 170px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <PButton
        class="filter-item"
        icon="el-icon-edit"
        perms="device-manage:add"
        type="primary"
        label="table.add"
        @click="handleCreate"
      />
      <PButton
        class="filter-item"
        icon="el-icon-download"
        perms="device-manage:import"
        type="primary"
        label="table.import"
        @click="handleImport"
      />
      <PButton
        class="filter-item"
        icon="el-icon-right"
        perms="device-manage:assign"
        type="success"
        @click="handleAssign"
        label="table.assign"/>
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
      ref="tableData"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      row-key="uuid"
      @select="select"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
    <el-table-column
      align="center"
      type="selection"
      :reserve-selection="true"
      width="55">
    </el-table-column>
      <el-table-column
        label="序号"
        prop="id"
        align="center"
        type="index"
        width="50"
      />
      
      <el-table-column label="deviceName" align="center">
        <template slot-scope="{row}">
          <el-tag>{{row.deviceName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="设备编号" align="center">
        <template slot-scope="{row}">
          <span>{{row.deviceNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column label="appKey" align="center">
        <template slot-scope="{row}">
          <el-tag type="success">{{row.appKey}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="设备上传批次" min-width="230" align="center">
        <template slot-scope="{row}">
          <span>{{row.batch}}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本号" align="center">
        <template slot-scope="{row}">
          <el-tag>{{row.version}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" sortable="custom" prop="create_date" width="230">
        <template slot-scope="{row}">
          <span>{{ row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center"  width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <PButton
            perms="device-manage:edit"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row)"
          />
          <!-- <PButton
            class="filter-item"
            perms="device-manage:delete"
            size="mini"
            type="danger"
            label="table.delete"
            @click="handleDelete(row,$index)"
          /> -->
        </template>
      </el-table-column>
    </el-table>
    
    <el-checkbox v-model="allCheck" @change="selectAll" style="margin-top:10px;margin-left:20px">
      {{ $t('table.selectAll') }}
      </el-checkbox>
      <!-- <el-select v-model="optionUuid" filterable placeholder="已选择">
          <el-option
              v-for="item in listSelect"
              :key="item.uuid"
              :label="item.deviceName"
              :value="item.uuid">
          </el-option>
      </el-select> -->
    <pagination
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
          label-width="120px"
          style="width: 400px; margin-left:50px;">
          <template v-if="dialogStatus==='import'">
            <el-form-item label="选择文件">
              <el-upload
              ref="upload"
              action="#"
              accept=".xls,.xlsx"
              :file-list="modeList"
              :http-request="modeUpload"
              :on-change="fileChange"
              :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
              </el-upload>
            </el-form-item>
          </template>
          <template v-else-if="dialogStatus==='assign'">
            <el-form-item label="选择指派对象">
              <el-select v-model="optionUuid" filterable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.uuid"
                  :label="item.name+' '+item.account"
                  :value="item.uuid">
                </el-option>
              </el-select>
              
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="deviceName" prop="deviceName" v-show="dialogStatus==='create'">
            <el-input v-model.trim="temp.deviceName" clearable placeholder="请输入设备名称" />
            </el-form-item>
            <el-form-item label="设备编号" prop="deviceNumber" v-show="dialogStatus==='create'">
                <el-input v-model.trim="temp.deviceNumber " clearable placeholder="请输入设备编号" />
            </el-form-item>
            <el-form-item label="标题" prop="title">
                <el-input v-model.trim="temp.title " clearable placeholder="请输入使用地址名称" />
            </el-form-item>
            <el-form-item label="版本号" prop="version">
                <el-input v-model.trim="temp.version" clearable placeholder="请输入设备版本号" />
            </el-form-item>
            </template>
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
import {getAdviceView,postDeviceUp,postDeviceAdd,postExcelUp,postAssignDevice} from '@/api/device'
import {getUsers} from '@/api/sys'
import PButton from '@/components/PermissionBtn'
import { hasBtnPermission } from '@/utils/permission'
import waves from '@/directive/waves' // waves directive

import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { options } from 'runjs'

export default {
  name:'device-manage',
  directives: { waves },
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
      allCheck:false,
      tableKey:0,
      check:false,
      list:[],
      listAll:[],
      listSelect:[],
      modeList:[],
      options:[],//系统管理员
      multipleSelection:[],//勾选的table
      optionUuid:'',//选择的指派对象
      total:0,
      userTotal:0,
      temp:{
        uuid:undefined,
        deviceNumber:undefined,
        deviceName:undefined,
        title:undefined,
        version:undefined,
      },
      listQuery:{
        page:1,
        limit:10,
        check:false,
        title:undefined,
        deviceName:undefined,
        deviceNumber:undefined,
        batch:undefined,
      },
      listLoading:false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap:{
        update: 'Edit',
        create: 'Create',
        import: 'Import',
        assign: 'Assign',
      },
      rules:{
        sort: [{ validator: checkSort, trigger: 'change' }],
        deviceName:[{required:true, message:'设备名称必填', trigger:'change'}],
        deviceNumber:[{required:true, message:'设备编号必填', trigger:'change'},
        // { pattern:/^[0-9]+$/, message:'设备编号为数字', trigger:'change'}
        ],
        version:[{pattern:/^[1-9]+\.?[0-9]*$/, message:'请输入正确设备版本号', trigger:'change'}],
      }
    }
  },
  watch:{
    list: {
      handler (value) {
        console.log('list监听')
        if (this.allCheck&&this.multipleSelection.length < this.total) {
          this.list.forEach(row => {
            if (row) {
              this.$refs['tableData'].toggleRowSelection(row, true)

            }
          });
        }
      }
    }
  },
  created(){
    this.getList();
  },
  methods:{
    getList(){
      console.log(this.multipleSelection)
      // this.multipleSelection = []
      this.listLoading = true
      getAdviceView(this.listQuery).then(response=>{
        this.list = response.respObj.item
        this.total = response.respObj.total
        this.listLoading = false
        let query = JSON.stringify(this.listQuery)
        query = JSON.parse(query) 
        if(this.total>0){
          query.limit = this.total
        }
        query.page = 1
        getAdviceView(query).then(response=>{
          this.listAll = response.respObj.item   
        })
      })
      const listQuery = {
        page:1,
        limit:20
      }
      getUsers(listQuery).then(response=>{
        this.userTotal = response.respObj.total
        if(this.userTotal>0){
          listQuery.limit = this.userTotal
        }
        getUsers(listQuery).then(response=>{
          this.options = response.respObj.item
        })
      })
     
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate(){
      this.resetTemp()
      console.log(this.temp)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      console.log(this.dialogStatus)
      this.$nextTick(()=>{
        this.$refs['dataForm'].clearValidate()
      })

    },
    createData(){
      console.log(this.temp)
      this.$refs['dataForm'].validate((valid) => {
      if(valid){
        let data = []
        data.push(this.temp)
        postDeviceAdd(data).then(response=>{
          this.dialogFormVisible = false
          console.log(response)
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
    handleImport(){
      this.modeList = []
      console.log(this.modeList)
      this.dialogStatus = 'import'
      this.dialogFormVisible = true
      this.$nextTick(()=>{
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleAssign(){
      if(this.multipleSelection.length === 0){
        this.$message({
          title: '警告',
          message: '未选择设备不能指派',
          type: 'error',
          duration: 2000
        })
        return
      }
      this.dialogStatus = 'assign'
      this.dialogFormVisible = true
      this.$nextTick(()=>{
        this.$refs['dataForm'].clearValidate()
      })
    },
    selectAll(){
      //取消全选清空
      if(!this.allCheck){
        this.$refs['tableData'].clearSelection()
      }else{
        //点击全选但此时并不是都为空
        // if(this.multipleSelection.length>0&&this.multipleSelection.length<this.listAll.length){
        //   this.$refs['tableData'].clearSelection()
        // }
        // 这里实际仅选中了当前页的所有数据,在watch中监听分页后继续选中
        this.list.forEach(row=>{
            this.$refs['tableData'].toggleRowSelection(row,true)
            this.reduceSame(this.multipleSelection)
        })
      }
      
    },
    AssignData(){
      const uuids = []
      //点击了全选没有切换数据不全时
      if(this.allCheck&&this.multipleSelection.length<this.total){
        this.multipleSelection = this.listAll
      }
      this.multipleSelection.forEach(item=>{
        uuids.push(item.uuid)
      })
      const data = {
        uuid:this.optionUuid,
        uuids:uuids
      }
      postAssignDevice(data).then(response=>{
          this.dialogFormVisible = false
          this.multipleSelection = []
          this.allCheck = false
          this.$refs['tableData'].clearSelection()
          this.$notify({
            title: '成功',
            message: '设备指派成功',
            type: 'success',
            duration: 2000
          })
        })

    },
    handleUpdate(row){
      this.dialogStatus = 'update'
      console.log(row)
      this.temp = Object.assign({}, row)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData(){
      if(this.dialogStatus ==='import'){
          this.submitUpload();
          return
      }else if(this.dialogStatus ==='assign'){
        this.AssignData()
        return
      }
      console.log(this.temp)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          postDeviceUp(this.temp).then(response => {
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
      this.$confirm('确定删除当前设备?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const param = []
        param.push(row.uuid)
        const requestData = { uuids: param}
        console.log(requestData)
        getAdvertsDel(requestData).then(response => {
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
    resetTemp(){
      this.temp = {
        uuid:undefined,
        deviceNumber:undefined,
        deviceName:undefined,
        title:undefined,
        version:undefined,
      }
    },
    cancel(){
      this.dialogFormVisible = false
    
    },
    statusChange(status, row) {
      // const formData = new FormData()
      // formData.append('uuids', row.uuid)
      // formData.append('status', status)
      console.log(this.temp)
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
    submitUpload() {
        this.$refs.upload.submit();
    },
    modeUpload(item) {
      console.log(item.file);
      this.mode = item.file
      let fd = new FormData()// FormData 对象
      fd.append('file', this.mode)// 文件对象
      postExcelUp(fd).then(response=>{
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success',
          duration: 2000
        })
        this.getList();
      })
    },
    fileChange(file, fileList) {
      this.modeList = []
      this.modeList.push(file)

    },
    //勾选数据去重
    reduceSame(arr) {
      let obj = {};
      return arr.reduce(function (prev, item) {
        obj[item.uuid] ? "" : (obj[item.uuid] = 1 && prev.push(item))
        return prev;
      }, []);
    },
    select(val,row){
      // 点击某一行复选框时
      this.multipleSelection = this.reduceSame(val);
      console.log('去重后')
      if(this.multipleSelection.length === this.total){
        this.allCheck = true
      }else{
        this.allCheck = false
      }
      console.log(this.multipleSelection)
    },
    handleSelectionChange(val) {
      //当表格复选框改变时
      this.multipleSelection = this.reduceSame(val);
      if(this.multipleSelection.length === this.total){
        this.allCheck = true
      }else{
        this.allCheck = false
      }
    }
  }
}
</script>
<style>
  .el-tag{
    font-size: 14px;
  }
</style>
