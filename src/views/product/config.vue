<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.remark"
        clearable
        placeholder="备注"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.value"
        clearable
        placeholder="值"
        style="width: 150px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
       <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
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
      <el-table-column label="类型" align="center" show-overflow-tooltip width="220">
        <template slot-scope="{row}">
          <el-tag type="success">{{row.type}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="值" align="center">
        <template slot-scope="{row}">
          <span>{{row.value}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" show-overflow-tooltip width="220">
        <template slot-scope="{row}">
          <span>{{row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="create_date" sortable="custom" align="center"  width="180">
        <template slot-scope="{row}">
          <span>{{ row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center"  width="180">
        <template slot-scope="{row}">
          <span>{{ row.updateDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <PButton
            perms="product-config:edit"
            size="mini"
            type="primary"
            label="table.edit"
            @click="handleUpdate(row)"
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
          label-position="right"
          label-width="100px"
          style="width: 400px; margin-left:50px;">
          <el-form-item label="类型" prop="type">
            <el-input v-model.trim="temp.type" clearable placeholder="请输入类型" />
          </el-form-item>
          <!-- <el-form-item label="值" prop="value">
            <el-input v-model.trim="temp.value" clearable placeholder="请输入值" />
          </el-form-item> -->
           <el-form-item
            v-for="(param,index) in temp.value"
            :key="index"
            :label="'值'+(index+1)"
            prop="value">
            <el-col :span="19">
              <el-form-item
                :rules="[{required: true, message: '值必填', trigger: ['change','blur']},{max:100,message:'长度不能超过100',trigger:'change'}]"
                :prop="'value.'+index+'.val'"
                style="margin-right:10px">
                <el-input v-model.trim="param.val" placeholder="值" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item style="margin-left:20px" v-show="index>0">
                <el-button type="danger" @click.prevent="removeParam(param)">删除</el-button>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button style="" @click="addParam">添加参数</el-button>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model.trim="temp.remark" clearable placeholder="请输入备注" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="updateData()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>

      </el-dialog>
  </div>
</template>
<script>
import {getConfigView,postConfigUp} from '@/api/product'
import PButton from '@/components/PermissionBtn'
import waves from '@/directive/waves' // waves directive

import Pagination from '@/components/Pagination' // secondary package based on el-pagination


export default {
  name:'product-config',
  directives: { waves },
  components:{
    PButton,
    Pagination
  },
  data(){
    var checkType = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('类型必填'))
      }
      if (!/^[0-9]+$/.test(value)) {
        return callback(new Error('类型必须是数字'))
      }
    //   if (parseInt(value) > 99 || parseInt(value) < 0) {
    //     return callback(new Error('类型范围[0,99]'))
    //   }
      callback()
    }
    return{
      tableKey:0,
      list:[],
      total:0,
      temp:{
        type:undefined,
        value:{
            key:'',
            val:''
        },
        remark:undefined,
      },
      listQuery:{
        page:1,
        limit:20,
        value:undefined,
        orderField:undefined,
        orderType:undefined,
        remark:undefined,
      },
      listLoading:false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap:{
        update: 'Edit',
        create: 'Create'
      },
      rules:{
        type:[{ required: true, validator: checkType, trigger: 'change' }],
        // address:[{required:true, message:'公司地址必填', trigger:'change'}],
        // // companyTel:[{required:true, message:'公司电话必填', trigger:'change'}],
        // linkman:[{required:true, message:'公司联系人必填', trigger:'change'}],
        // phone:[{required:true,pattern:/^[1]([3-9])[0-9]{9}$/,message:'请输入正确电话号码', trigger:'change'}],
        // qrCodeType:[{required:true, validator: checkSort,trigger:'change'}],
      }
    }
  },
  created(){
    this.getList();
  },
  methods:{
    getList(){
      this.listLoading = true
      getConfigView(this.listQuery).then(response=>{
        this.list = response.respObj.item
        this.total = response.respObj.total
        console.log(this.listQuery)
        this.listLoading = false

      })
    },
    handleFilter(){
      this.listQuery.page = 1
      this.getList()
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
    jsonData(value){
        let data = JSON.parse(value)
        let newArr = []
        let i = 0
        for(let k in data){
            let obj = {
                key:k,
                val:data[k]
            }
            newArr.push(obj)
        }
        console.log('newArr',newArr)
        return newArr
    },
    changeValue(value){
      let obj = {}
      value.forEach(item=>{
          obj[item.key] = item.val
      })
      let val = JSON.stringify(obj)
      return val
    },
    handleUpdate(row){
      this.dialogStatus = 'update'
      console.log(row)
      this.temp = Object.assign({}, row)
      this.temp.value = this.jsonData(row.value)
      console.log(this.temp)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    
    updateData(){
      let value = this.changeValue(this.temp.value)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let data = {
              remark:this.temp.remark,
              type:this.temp.type,
              value
          }
          postConfigUp(data).then(response => {
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
    removeParam(param){
        let index = this.temp.value.indexOf(param)
        if(index>0){
            this.temp.value.splice(index,1)
        }
    },
    addParam(){
        console.log(this.temp.value)
        let len = this.temp.value.length+1
        this.temp.value.push({
          key: `value${len}`,
          val: ''
        });
    },
    resetTemp(){
      this.temp = {
        type:undefined,
        value:undefined,
        remark:undefined,

      }
    },
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
