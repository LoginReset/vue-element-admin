<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.elementName" 
        clearable filterable 
        placeholder="元件名称"  
        style="width: 120px;" 
        class="filter-item"
        @change="handleFilter">
            <el-option v-for="(item,index) in ele.elementNames"
              :key="index" :label="item" :value="item">
            </el-option>
      </el-select>

      <el-select v-model="listQuery.typeName" 
        clearable filterable 
        placeholder="元件类型"  
        style="width: 120px;" 
        class="filter-item"
        @change="handleFilter">
            <el-option v-for="(item,index) in ele.typeNames"
              :key="index" :label="item" :value="item">
            </el-option>
      </el-select>

      <el-select v-model="listQuery.rankName" clearable filterable 
        placeholder="元件级别"  style="width: 120px;" class="filter-item"
        @change="handleFilter">
            <el-option v-for="(item,index) in ele.rankNames"
              :key="index" :label="item" :value="item">
            </el-option>
      </el-select>
      
      <el-input
        v-model.trim="listQuery.brand"
        clearable
        placeholder="品牌"
        style="width: 120px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.elPrecision"
        clearable
        placeholder="元件精度"
        style="width: 120px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.parameter"
        clearable
        placeholder="元件参数"
        style="width: 120px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.packaging"
        clearable
        placeholder="封装参数"
        style="width: 120px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.power"
        clearable
        placeholder="功率"
        style="width: 120px;"
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
          <el-tag v-if="!row.imgPath" type="info">不存在</el-tag>
          <el-image 
            v-else
            :src="row.imgPath" 
            :preview-src-list="srcList">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="元件名称" align="center">
        <template slot-scope="{row}">
          <el-tag type="warning" v-if="row.elementName">{{row.elementName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="元件类型" align="center">
        <template slot-scope="{row}">
          <el-tag type="warning" v-if="row.typeName">{{row.typeName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="元件级别" align="center">
        <template slot-scope="{row}">
          <el-tag type="warning" v-if="row.rankName">{{row.rankName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="品牌" align="center">
        <template slot-scope="{row}">
          <span>{{row.brand}}</span>
        </template>
      </el-table-column>
      <el-table-column label="元件精度" align="center">
        <template slot-scope="{row}">
          <span>{{row.elPrecision}}</span>
        </template>
      </el-table-column>
      <el-table-column label="元件参数" align="center">
        <template slot-scope="{row}">
          <el-tag>{{row.parameter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="封装参数" align="center" show-overflow-tooltip> 
        <template slot-scope="{row}">
          <el-tag>{{row.packaging}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="功率" align="center">
        <template slot-scope="{row}">
          <span>{{row.power}}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格/元" align="center">
        <template slot-scope="{row}">
          <el-tag type="success">{{row.price>0?row.price:0}}</el-tag>
        </template>
      </el-table-column>
      
      <el-table-column label="描述" align="center" width="150" show-overflow-tooltip>
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="350">
        <template slot-scope="{row,$index}">
          <PButton
            perms="element-manage:edit"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row)"
          />
          <PButton
            perms="element-manage:price"
            size="mini"
            type="success"
            label="table.priceUp"
            @click="handleUpPrice(row)"
          />
          <PButton
            perms="element-manage:stock"
            size="mini"
            type=""
            label="table.upStock"
            @click="handleUp(row)"
          />
          <PButton
            v-if="row.status!='deleted'"
            class="filter-item"
            perms="element-manage:delete"
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
          <template>
            <el-form
            ref="dataForm"
              :rules="rules"
              :model="temp"
              label-position="left"
              label-width="100px"
              style="width: 400px; margin-left:50px;">
                <template v-if="dialogStatus==='upStock'">
                  <el-form-item label="库存操作" >
                  <el-radio-group v-model="temp.aboolean">
                    <el-radio :label="true">增加</el-radio>
                    <el-radio :label="false">减少</el-radio>
                  </el-radio-group>
                    
                  </el-form-item>
                  <el-form-item label="库存数量" prop="stock">
                      <el-input v-model.trim="temp.stock" clearable placeholder="请输入操作库存数量" />
                  </el-form-item>
                </template>
                <template v-else>
                  <el-form-item label="价格" prop="price">
                    <el-input v-model.trim="temp.price" clearable placeholder="请输入价格"/>
                  </el-form-item>
                </template>
            </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary " @click="dialogStatus==='upStock'?upStock():upPrice()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import {getComView,postComAdd,postComeUp,getComDel,getComUpStock,postUpBom,postPriceUp} from '@/api/ele'
import {getElView,getRankView,getTypeView,getHome,postParameter} from '@/api/ele'
import PButton from '@/components/PermissionBtn'
import waves from '@/directive/waves' // waves directive
import { mapGetters } from 'vuex'

import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export default {
  name:'element-manage',
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
    var checkPrice = (rule,value,callback) =>{
      console.log(typeof Number(value))
      value = Number(value)
      
      if(!new RegExp("((^[1-9][0-9]{0,10})+(.?[0-9]{1,3})?$)|(^[0]+(.[0-9]{1,3})?$)").test(value)){
        callback(new Error('价格可精确到厘'))
      }
      console.log(value)
      callback()
    }
    return{
      url:'',
      tableKey:0,
      flag:false,//组合参数只查询一次
      ele:{},
      list:[],
      srcList:[],
      modeList:[],
      total:0,
      temp:{
        uuid:undefined,
        aboolean:true,
        stock:undefined,
        price:undefined,
      },
      listQuery:{
        page:1,
        limit:20,
        elementName:undefined,
        typeName:undefined,
        rankName:undefined,
        brand:undefined,
        elPrecision:undefined,
        parameter:undefined,
        packaging:undefined,
        power:undefined,
        orderField:undefined,
        orderType:undefined
      },
      listLoading:false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap:{
        upStock: '库存管理',
        upPrice: '修改价格'
      },
      rules:{
        stock:[{ required: true, message: '库存数量必填', trigger: 'change' },
               { validator: checkStock, trigger: 'change' }],
        price:[{ required: true,validator:checkPrice,trigger: 'change'}],

      }
    }
  },
  created(){
    this.getList();
  },
  computed:{
    ...mapGetters(['directFlag'])
  },
  watch:{
    directFlag: {
      handler: function(directFlag) {
        console.log(directFlag)
        if(directFlag){
          this.getList()
          directFlag = false
          this.$store.dispatch('tagsView/refreshView', directFlag)
        }
      },
      immediate: true
    },
  },
  methods:{
    getList(){
      this.listLoading = true
      getComView(this.listQuery).then(response=>{
        this.list = response.respObj.item
        this.total = response.respObj.total
        this.srcList = []
        this.list.forEach(item=>{
          item.price = item.price/1000
            this.srcList.push(item.imgPath)
        })
        if(!this.flag){
          postParameter().then(response=>{
            this.ele = response.respObj
            this.flag = true
          })
        }
        this.listLoading = false
      })
    },
    handleFilter(){
      this.listQuery.page = 1
      console.log(this.listQuery)
      this.getList()
    },
    handleCreate(){
      let directFlag = false
      this.$store.dispatch('tagsView/refreshView', directFlag)
      this.$router.push({name:'element-create'})
    },
    handleUpdate(row){
      let directFlag = false
      this.$store.dispatch('tagsView/refreshView', directFlag)
      const data = JSON.stringify(row)
      sessionStorage.setItem('elData', data)
      this.$router.push({ name: 'element-edit' })
      

    },
    sortChange(data) { // 排序
      const { prop, order } = data
      if (prop === 'createDate') {
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
    handleUpPrice(row){
      this.temp.uuid = row.uuid
      this.temp.price = row.price
      this.dialogStatus = 'upPrice'
      this.dialogFormVisible = true
      this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
      })
    },
    upPrice(){
      const data ={
        uuid:this.temp.uuid,
        price:this.temp.price*1000
      }
      postPriceUp(data).then(response=>{
        this.dialogFormVisible = false
              this.$notify({
              title: '成功',
              message: '修改价格成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
      })
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
              message: '更新库存成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
            this.resetTemp()
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
    handleDelete(row,index){
      this.$confirm('确定删除该元件参数?', '警告', {
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
    resetTemp(){
      this.temp = {
        uuid:undefined,
        aboolean :true,
        stock:undefined
      }
    },
    cancel(){
      this.dialogFormVisible = false
    }
  }
}
</script>
<style scoped>
    .el-tag{
        font-size: 14px;
    }
</style>