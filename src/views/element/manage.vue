<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.elementName"
        clearable
        placeholder="元件名称"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.typeName"
        clearable
        placeholder="元件类型"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.rankName"
        clearable
        placeholder="元件应用级别"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.brand"
        clearable
        placeholder="品牌"
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
        perms="element-name:add"
        type="primary"
        label="table.add"
        @click="handleCreate"
      />
      <!-- <PButton
        class="filter-item"
        icon="el-icon-upload"
        perms="element-name:add"
        type="primary"
        label="table.up_bom"
        @click="handleUpload"
      /> -->
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
      <el-table-column label="元件图标" align="center">
        <template slot-scope="{row}">
          <el-image 
            :src="row.imgPath" 
            :preview-src-list="srcList">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="元件名称" align="center">
        <template slot-scope="{row}">
          <el-tag>{{row.elementName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="元件类型" align="center">
        <template slot-scope="{row}">
          <span>{{row.typeName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="元件级别" align="center">
        <template slot-scope="{row}">
          <span>{{row.rankName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌" align="center">
        <template slot-scope="{row}">
          <span>{{row.brand}}</span>
        </template>
      </el-table-column>
      <el-table-column label="元件精度" align="center">
        <template slot-scope="{row}">
          <span>{{row.elPrecision?row.elPrecision+'%':''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="元件参数" align="center">
        <template slot-scope="{row}">
          <span>{{row.parameter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="功率" align="center">
        <template slot-scope="{row}">
          <span>{{row.power}}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格/元" align="center">
        <template slot-scope="{row}">
          <span>{{row.price>0?row.price/1000:0}}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="描述" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" align="center">
        <template slot-scope="{row}">
          <span>{{row.stock}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" sortable="custom" prop="createDate" width="200">
        <template slot-scope="{row}">
          <span>{{ row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300">
        <template slot-scope="{row,$index}">
          <PButton
            perms="element-name:edit"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row)"
          />
          <PButton
            perms="element-name:edit"
            size="mini"
            type="success"
            label="table.upStock"
            @click="handleUp(row)"
          />
          <PButton
            v-if="row.status!='deleted'"
            class="filter-item"
            perms="element-name:delete"
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
          <template v-if="dialogStatus==='upStock'">
            <el-form
            ref="dataForm"
              :rules="rules"
              :model="temp"
              label-position="left"
              label-width="100px"
              style="width: 400px; margin-left:50px;">
                <el-form-item label="库存操作" >
                  <el-radio-group v-model="temp.aboolean">
                    <el-radio :label="true">增加</el-radio>
                    <el-radio :label="false">减少</el-radio>
                  </el-radio-group>
                    
                </el-form-item>
                <el-form-item label="库存数量" prop="stock">
                    <el-input v-model.trim="temp.stock" clearable placeholder="请输入操作库存数量" />
                </el-form-item>
            </el-form>
        </template>
        <!-- <template v-else>
            <el-upload
              class="upload-demo"
              style=" margin-left:250px;"
              ref="upload"
              drag
              action="#"
              :file-list="modeList"
              :http-request="modeUpload"
              :on-change="fileChange"
              :on-preview="handlePreview"
              accept=".xls,.xlsx"
              :auto-upload="false">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">上传成功后会自动下载</div>
            </el-upload> 
            <el-button @click="submitUpload">点击上传文件</el-button>
          </template> -->
        <div slot="footer" class="dialog-footer" v-show="dialogStatus==='upStock'">
          <el-button @click="dialogFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary " @click="upStock">
            {{ $t('table.confirm') }}
          </el-button>
        </div>

      </el-dialog>
  </div>
</template>
<script>
import {getComView,postComAdd,postComeUp,getComDel,getComUpStock,postUpBom} from '@/api/ele'
import {getHome} from '@/api/ele'

import PButton from '@/components/PermissionBtn'
import waves from '@/directive/waves' // waves directive

import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export default {
  name:'element-name',
  directives: { waves },
  components:{
    PButton,
    Pagination
  },
  data(){
    var checkStock = (rule,value,callback)=>{
          console.log(value)

          // value = Number(value)
          if(!/^\+?[1-9][0-9]*$/.test(value)||value>99999||value<0){
              callback(new Error('请输入[0,99999]的正整数'))
          }
          callback()
    }
    return{
      url:'',
      tableKey:0,
      list:[],
      srcList:[],
      modeList:[],
      total:0,
      temp:{
        uuid:undefined,
        aboolean:true,
        stock:undefined,
      },
      listQuery:{
        page:1,
        limit:20,
        elementName:undefined,
        typeName:undefined,
        rankName:undefined,
        brand:undefined,
        orderField:undefined,
        orderType:undefined
      },
      listLoading:false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap:{
        upStock: '库存管理',
        upBom: '上传Bom清单'
      },
      rules:{
        stock:[{ required: true, message: '库存数量必填', trigger: 'change' },
               { validator: checkStock, trigger: 'change' }]
      }
    }
  },
  created(){
    this.getList();
  },
  methods:{
    
    getList(){
      this.listLoading = true
      getComView(this.listQuery).then(response=>{
        this.list = response.respObj.item
        this.total = response.respObj.total
        this.listLoading = false
        this.srcList = []
        console.log(this.list)
        this.list.forEach(item=>{
          console.log(item)
            this.srcList.push(item.imgPath)
        })
        console.log(this.srcList)
      })
      
    },
    handleFilter(){
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate(){
        this.$router.push({name:'element-create'})
    

    },
    createData(){
      console.log(this.temp)
      this.$refs['dataForm'].validate((valid) => {
      if(valid){
        postElAdd(this.temp).then(response=>{
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
    handleUpdate(row){
      const data = JSON.stringify(row)
      sessionStorage.setItem('elData', data)
      this.$router.push({ name: 'element-edit' })
      

    //   this.temp = Object.assign({}, row)
    //   console.log(this.temp)
    //   this.dialogFormVisible = true
    //   this.$nextTick(() => {
    //     this.$refs['dataForm'].clearValidate()
    //   })
    },
    updateData(){
      console.log(this.temp)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          getComUpStock(this.temp).then(response => {
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
    sortChange(data) { // 排序
        console.log(151551515)

      const { prop, order } = data
      if (prop === 'createDate') {
        console.log(151551515)
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
    handleUp(row){
        this.temp.uuid = row.uuid
        this.dialogStatus = 'upStock'
        this.dialogFormVisible = true
        this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
        })
    },
    upStock(){
        this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.stock = Number(this.temp.stock)
          console.log(this.temp)
          getComUpStock(this.temp).then(response => {
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
    handleUpload(){
      this.dialogStatus = 'upBom'
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //     this.$refs['dataForm'].clearValidate()
      // })
    },
    modeUpload(item) {
      this.mode = item.file
      let fd = new FormData()// FormData 对象
      fd.append('file', this.mode)// 文件对象
      console.log(fd.get('file'))
      postUpBom(fd).then(response=>{
        this.url = response.respObj
        this.handlePreview(item.file)
      })
    },
    fileChange(file, fileList) {
      console.log(file)
      // console.log(file.raw)
      this.modeList = []
      this.modeList.push(file)
      this.submitUpload()
    },
    submitUpload() {
        this.$refs.upload.submit();
      },
    handlePreview(file) {
        var a = document.createElement('a');
        var event = new MouseEvent('click');
        a.download = file.name;
        a.href = this.url;
        a.dispatchEvent(event);
        console.log('handlePreview')
        console.log(file)
        console.log(this.url)
    },
    upload(){

    },
    handleDelete(row,index){
      this.$confirm('确定删除元件参数?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const param = []
        param.push(row.uuid)
        const requestData = { uuids: param }
        console.log(requestData)
        getComDel(requestData).then(response => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
      }).catch(err => {

      })
    },
    // resetTemp(){
    //   this.temp = {
    //     uuid:undefined,
    //     description :undefined,
    //     brand:undefined,
    //     elPrecision :undefined,
    //     elementName :undefined,
    //     packaging :undefined,
    //     power :undefined,
    //     price :undefined,
    //     rankName :undefined,
    //     stock :undefined,
    //     parameter :undefined,
    //     typeName :undefined,
    //   }
    // },
    cancel(){
      this.dialogFormVisible = false
      console.log(this.temp)
    }
  }
}
</script>
<style scoped>
    .el-tag{
        font-size: 14px;
    }
</style>