<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model.trim="listQuery.name"
        clearable
        placeholder="所属公司"
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
    >
      <el-table-column
        label="序号"
        prop="id"
        align="center"
        type="index"
        width="50"
      />
      <el-table-column label="logo" align="center" width="150">
        <template slot-scope="{row}">
          <el-image 
            :src="row.companyImg" 
            :preview-src-list="srcList">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="{row}">
          <span>{{row.companyTitle}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属公司" align="center">
        <template slot-scope="{row}">
          <el-tag>{{ row.name }}</el-tag>
        </template>
      </el-table-column>
     
      <el-table-column label="创建时间" align="center" sortable="custom" prop="create_date" width="230">
        <template slot-scope="{row}">
          <span>{{ row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <PButton
            perms="enterprise-manage:edit"
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
      <el-dialog title="Edit" :visible.sync="dialogFormVisible" height="100%">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="left"
          label-width="100px"
          style="width: 400px; margin-left:50px;">
          <el-form-item label="标题" prop="companyTitle">
            <el-input v-model.trim="temp.companyTitle" clearable placeholder="请输入公司名称" />
          </el-form-item>
          <el-form-item label="logo选择" prop="companyTitle">
            <el-upload
              ref="upload"
              action="#"
              accept="image/png,image/gif,image/jpg,image/jpeg"
              :file-list="modeList"
              :http-request="modeUpload"
              :on-change="fileChange"
              list-type="picture"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
            <!-- <el-button @click="submitUpload">点击上传文件</el-button> -->
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">
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
import {getEnterpriseView,postEnterpriseAdd,postEnterpriseUp,postImgUpload,postLogoUp} from '@/api/enterprise'
import PButton from '@/components/PermissionBtn'
import waves from '@/directive/waves' // waves directive

import Pagination from '@/components/Pagination' // secondary package based on el-pagination

import Vue from 'vue'
import {VueCropper} from 'vue-cropper' 
Vue.use(VueCropper)

export default {
  name:'enterprise-logo',
  directives:{waves},
  components:{
    PButton,
    Pagination,
    VueCropper
  },
  data(){
    return{
      tableKey:0,
      list:[],
      modeList: [],
      srcList:[],
      fileList:[],
      mode:{},
      action: 'https://jsonplaceholder.typicode.com/posts/',
      total:0,
      temp:{
        uuid:undefined,
        companyImg:undefined,
        companyTitle:undefined,
      },
      listQuery:{
        page:1,
        limit:5,
        name:undefined,
      },
      listLoading:false,
      dialogFormVisible: false,
      // option: {
      //   img: '', // 裁剪图片的地址
      //   size: 0.8, // 裁剪生成图片的质量
      //   outputType: 'png', // 裁剪生成图片的格式
      //   // info: true, // 裁剪框的大小信息
      //   canScale: false, // 图片是否允许滚轮缩放
      //   autoCrop: true, // 是否默认生成截图框
      //   autoCropWidth: 159, // 默认生成截图框宽度
      //   autoCropHeight: 91, // 默认生成截图框高度
      //   fixedBox: true, // 固定截图框大小 不允许改变
      //   fixed: true, // 是否开启截图框宽高固定比例
      //   fixedNumber: [1, 1], // 截图框的宽高比例
      //   canMove: true, // 上传图片是否可以移动
      //   canMoveBox: false, // 截图框能否拖动
      //   original: false, // 上传图片按照原始比例渲染
      //   centerBox: true, // 截图框是否被限制在图片里面
      //   infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      //   full: false, // 是否输出原图比例的截图
      //   enlarge: '0.5', // 图片根据截图框输出比例倍数
      //   mode: 'contain' // 图片默认渲染方式
      // },
      rules:{
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
      getEnterpriseView(this.listQuery).then(response=>{
        this.list = response.respObj.item
        this.list.forEach(item=>{
          this.srcList.push(item.companyImg)
        })
        this.total = response.respObj.total
        console.log(this.listQuery)
        this.listLoading = false 
      })
    },
    handleFilter(){
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row){
      // this.option.img = row.companyImg
      // console.log(this.option.img)
      console.log(row)
      this.temp = Object.assign({}, row)

      this.modeList = []
      this.modeList.push({
        name:row.companyTitle,
        url:row.companyImg
      })
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData(){
      console.log(this.temp)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // const data = {
          //   uuid:this.temp.uuid,
          //   companyImg:this.temp.companyImg,
          //   companyTitle:this.temp.companyTitle
          // }
          postLogoUp(this.temp).then(response => {
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
    resetTemp(){
      this.temp = {
        uuid:undefined,
        companyImg:undefined,
        companyTitle:undefined,
      }
    },
    cancel(){
      this.dialogFormVisible = false
    },
    modeUpload(item) {
      console.log(item.file);
      this.mode = item.file
      let fd = new FormData()// FormData 对象
      fd.append('file', this.mode)// 文件对象
      console.log(fd.get('file'))
      postImgUpload(fd).then(response=>{
        console.log(response)
        console.log(response.respObj)
        this.temp.companyImg = response.respObj
        console.log(this.temp.companyImg)
      })
      
    },
     
    // fileList 是文件列表发生变化后，返回的修改后的列表对象，这里直接赋值就好啦！
    fileChange(file, fileList) {
      // console.log(file.raw)
      this.modeList = []
      this.modeList.push(file)
      this.submitUpload()
    },
    submitUpload() {
        this.$refs.upload.submit();
      },
    upload() {
      let fd = new FormData()
      console.log(this.mode)
      fd.append('File', this.mode)
      console.log(fd)
      postImgUpload(fd).then(response=>{
        console.log(response.respObj)
      })
    },
  }
}
</script>
<style lang="scss" scoped>
  .el-tag{
    font-size: 14px;
  }

</style>
