<template>
  <div class="app-container">
    <div class="filter-container">
   
      <el-input
        v-model.trim="listQuery.name"
        clearable
        placeholder="行政区名称"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.code"
        clearable
        placeholder="行政区代码"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <PButton
        class="filter-item"
        icon="el-icon-edit"
        perms="sys-province:add"
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
      ref="provinceTable"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :row-class-name="rowClassName"
      row-key="id"
      :tree-props="{children: 'cities'}"
      @sort-change="sortChange"
    >
      <el-table-column
        label="序号"
        prop="id"
        align="center"
        type="index"
        width="60"
      />
      <el-table-column label="省市县" align="left" min-width="250px">
        <template slot-scope="{row}">
          <el-tag v-if="row.depth===1||row.depth===3">{{row.name}}</el-tag>
          <el-tag v-else type="success">{{row.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="行政编码" align="center" min-width="250px">
        <template slot-scope="{row}">
          <span>{{row.divisionCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" min-width="250px">
        <template slot-scope="{row}">
          <el-tag v-if="row.status===1">显示</el-tag>
          <el-tag type="info" v-else>隐藏</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <PButton
            class="filter-item"
            perms="sys-province:edit"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row,$index)"
          />
          <PButton
            v-if="row.status!='deleted'"
            class="filter-item"
            perms="sys-province:delete"
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
        label-width="80px"
        style="width: 400px; margin-left:50px;">
        <el-form-item label="地区名" prop="name">
          <el-input v-model.trim="temp.name" clearable placeholder="请输入地区名" />
        </el-form-item>
        <el-form-item label="行政编码" prop="divisionCode">
          <el-input v-model.trim="temp.divisionCode" clearable placeholder="请输入行政编码" />
        </el-form-item>
        <el-form-item label="所属地区" v-if="this.showProvinceList" prop="pid">
          <el-cascader
            v-model="temp.pid"
            :options="showList"
            :props="provinceProps"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="temp.status">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
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
import store from '@/store'
import {getProvinceView,postCityUpm,postCitieAdd} from '@/api/sys'
// import { getProvinceView } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// 按钮组件 全局使用
import PButton from '@/components/PermissionBtn'

export default {
  name: 'Permission',
  components: { Pagination, PButton },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      province:[],
      list: [],
      loadData:[],
      provinceList:[],
      showList:[],
      provinceProps: {
        value: 'divisionCode',
        label: 'name',
        children: 'cities',
        checkStrictly: true
      },
      showProvinceList:false,
      total: 0,
      totalAdd:true,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        orderField: undefined,
        orderType: undefined, // desc|asc
        name: undefined,
        code: undefined
      },
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        name: undefined,
        divisionCode:undefined,
        status:1,
        pid:[],
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
        name: [{ required: true, message: '地区名必填', trigger: 'change' },
          { max: 25, message: '长度不能超过25字符', trigger: 'change' }],
        divisionCode: [{ required: true, message: '行政编码必填', trigger: 'change' },
          { pattern:/^\d{6}$/, message: '行政编码必须为6位数字', trigger: 'change' }],
        pid: [{ required: true, message: '省份城市必选', trigger: 'change' }],
      },
      downloadLoading: false,
      checkStrictly: true,
      currentRow: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true

      getProvinceView(this.listQuery).then(response=>{
        console.log(response)
        this.list = response.respObj.item
        this.total = response.respObj.total
        if(this.totalAdd===true){
          this.totalAdd = response.respObj.total
        }
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
        name: undefined,
        divisionCode:undefined,
        pid:undefined,
        status:1,

      }
      this.province = []
    },
    showProvince() {
      const query = {
          page:1,
          limit:this.totalAdd
      }
      getProvinceView(query).then(response=>{
        this.showList = response.respObj.item
        let list = JSON.stringify(this.showList)
        const provinceList = JSON.parse(list)
        //一级
        
        provinceList.forEach(item=>{
          if(item.cities){
            item.cities.forEach(item1=>{
              delete item1.cities
            })
          }
        })
          this.showList = provinceList
          console.log(provinceList)
        })
      

    },
    handleCreate() {
      this.showProvince()
      this.showProvinceList = true
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.temp.pid = this.temp.pid[this.temp.pid.length-1]
      console.log(this.temp)
      return
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          postCitieAdd(this.temp).then(response => {
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
    handleUpdate(row,index) {
      this.index = index
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      console.log(this.temp)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
        //   this.temp.areas = undefined
          const tempData = Object.assign({}, this.temp)
          postCityUp(tempData).then(response => {
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
    
    cancel(){
        this.resetTemp();
        this.dialogFormVisible = false
        this.showProvinceList = false
    },
    handleChange(province){
        console.log(province)
    },
    handleLoad(tree,treeNode,resolve){
      conosle.log(tree)
    },
    load(tree, treeNode, resolve) {
      this.maps.set(tree.uuid, { tree, treeNode, resolve }); //将当前选中节点数据存储到maps中
      const query = {}
      if(tree.areaName){
        query = {areaName:tree.areaName}
      }else if(tree.cityName){
        query = {cityName:tree.cityName}
      }else{
        query = {provinceName:tree.provinceName}
      }
      getProvinceView(query).then(response=>{
        response.respObj[0].cities.forEach(item=>{
          item.areas = []
          item.hasChildren = true
        })
      //  this.loadData.push(response.respObj[0].cities)
      console.log(response.respObj)
        resolve(response.respObj[0].cities)
      })

      },
      rowClassName({row,rowIndex}){
        row.index = rowIndex
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
