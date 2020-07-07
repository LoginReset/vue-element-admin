<template>
  <div class="app-container">
    <div class="filter-container">
   
      <el-input
        v-model.trim="listQuery.name"
        placeholder="行政区名称"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.code"
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
        perms="add"
        role="sys-permission"
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
            perms="edit"
            role="sys-permission"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row,$index)"
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
            <el-form-item label="地区名" prop="name">
                <el-input v-model.trim="temp.name" clearable placeholder="请输入地区名" />
            </el-form-item>
            <el-form-item label="行政编码" prop="divisionCode">
                <el-input v-model.trim="temp.divisionCode" clearable placeholder="请输入行政编码" />
            </el-form-item>
            <el-form-item label="所属地区" v-if="this.showProvinceList">
                <el-cascader
                    v-model="province"
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
import {getProvinceView,postCityUp} from '@/api/sys'
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
      maps:new Map(),
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
      showReviewer: false,
      createTemp:{
          name:undefined,
          code:undefined
      },
      temp: {
        uuid: undefined,
        name: undefined,
        divisionCode:undefined,
        status:1,
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
        // permission: [{ required: true, message: '权限名必填', trigger: 'change' },
        //   { max: 50, message: '长度不能超过50字符', trigger: 'change' }],
        // menuName: [{ required: true, message: '菜单名必填', trigger: 'change' },
        //   { max: 30, message: '长度不能超过30字符', trigger: 'change' }],
        // filterUrl: [{ required: true, message: '路径必填', trigger: 'change' },
        //   { max: 50, message: '长度不能超过50字符', trigger: 'change' }],
        // description: [{ max: 200, message: '长度不能超过200字符', trigger: 'change' }],
        // sort: [{ validator: checkSort, trigger: 'change' }]
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
        console.log(this.list)
        // const data = JSON.parse(list.replace(/cities/g,"areas"))
        // this.list = data
        // data.forEach(item=>{
        //   item.areas = []
        //   item.hasChildren = true
        // })
        // console.log(data)
        // this.list = data
        
        // list = list.replace(/provinceName/g,"areaName")
        // list = list.replace(/cityName/g,"areaName")
        // list = list.replace(/cities/g,"areas")
        // this.provinceList = JSON.parse(list)
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
        provinceName: undefined,
        cityName:undefined,
        areaName:undefined,
        cityName:undefined,
        provinceCode:undefined,
        cityCode:undefined,
        areaCode:undefined,
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
    console.log(this.temp)
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
        console.log(this.createTemp)
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       postPermissionAdd(Object.assign(this.temp, { puuid: (checkedUuid.length > 0 ? checkedUuid[0] : undefined) })).then(response => {
    //         this.dialogFormVisible = false
    //         this.getList()
    //         this.$notify({
    //           title: '成功',
    //           message: '创建成功',
    //           type: 'success',
    //           duration: 2000
    //         })
    //       })
    //     }
    //   })
    },
    handleUpdate(row,index) {
      this.index = index
      console.log(row)
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
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
                // this.list.splice(this.index,1,this.temp)

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
