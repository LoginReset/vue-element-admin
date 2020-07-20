<template>
  <div class="app-container">
      <div class="filter-container">
          <el-input 
            v-model.trim="listQuery.name"
            clearable
            placeholder="子用户名"
            style="width: 150px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-input 
            v-model.trim="listQuery.account"
            clearable
            placeholder="子用户账号"
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
                width="50"/>
            <el-table-column label="子用户名" align="center">
                <template slot-scope="{row}">
                <span>{{ row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="子用户账号" align="center">
                <template slot-scope="{row}">
                <el-tag>{{row.account}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="联系电话" align="center">
                <template slot-scope="{row}">
                <span>{{ row.phoneNum }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                <PButton
                    class="filter-item"
                    perms="advertise-manage:delete"
                    size="mini"
                    type="success"
                    label="table.search_device"
                    @click="handleDevice(row,$index)"/>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getList"/>
        </div>
        <el-dialog title="Device" :visible.sync="dialogFormVisible" customClass="customWidth">
            <el-input 
              v-model.trim="dListQuery.deviceName"
              clearable
              placeholder="deviceName"
              style="width: 150px;"
              class="filter-item"
              @keyup.enter.native="handleFilter(1)"
            />
            <el-input 
              v-model.trim="dListQuery.deviceNumber"
              clearable
              placeholder="设备编号"
              style="width: 150px;"
              class="filter-item"
              @keyup.enter.native="handleFilter(1)"
            />
            <el-input 
              v-model.trim="dListQuery.title"
              clearable
              placeholder="标题"
              style="width: 150px;"
              class="filter-item"
              @keyup.enter.native="handleFilter(1)"
            />
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter(1)">
              {{ $t('table.search') }}
            </el-button>
            <el-button
              class="filter-item"
              style="margin-left: 10px;"
              type="success"
              icon="el-icon-refresh"
              @click="getDlist"
          >{{ $t('table.refresh') }}
          </el-button>
           <el-table 
            :key="tableKey"
            :data="deviceList"
            border
            fit
            highlight-current-row
            style="width: 100%;margin-top:15px;"
            row-key="uuid">
              <el-table-column 
                label="序号"
                prop="id"
                align="center"
                type="index"
                width="50">
              </el-table-column>
              <el-table-column label="deviceName" align="center">
                <template slot-scope="{row}">
                <el-tag>{{row.deviceName}}</el-tag>
                </template>
            </el-table-column>
            
            <el-table-column label="设备编号" align="center">
                <template slot-scope="{row}">
                <el-tag>{{row.deviceNumber}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="appKey" align="center">
                <template slot-scope="{row}">
                <span>{{row.appKey}}</span>
                </template>
            </el-table-column>
            <el-table-column label="标题" align="center">
                <template slot-scope="{row}">
                <span>{{row.title}}</span>
                </template>
            </el-table-column>
            <el-table-column label="设备上传批次" align="center">
                <template slot-scope="{row}">
                <span>{{row.batch}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <el-popconfirm
                        title="确定解绑该设备吗？"
                        @onConfirm="handleUnbind(row,$index)">
                        <PButton
                            slot="reference"
                            class="filter-item"
                            perms="device-user:unbind"
                            size="mini"
                            type="danger"
                            label="table.unbind"
                            />
                    </el-popconfirm>
                </template>
            </el-table-column>
           </el-table>
           <pagination
            v-show="dtotal>0"
            :total="dtotal"
            :page.sync="page"
            :limit.sync="limit"
            @pagination="getDlist"/>
        </el-dialog>
    </div>
</template>
<script>
import {getUserDevice,getDeviceUnbind,getSelectDevice} from '@/api/device'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import PButton from '@/components/PermissionBtn'
import waves from '@/directive/waves' // waves directive

export default {
  name:'device-user',
  directives: { waves },
  components:{
    PButton,
    Pagination
  },
  data(){
    return{
      tableKey:0,
      list:[],
      deviceList:[],
      sysUuid:undefined,
      listLoading:false,
      total:0,
      dtotal:0,
      page:1,
      limit:10,
      listQuery:{
        page:1,
        limit:20,
        name:undefined,
        account:undefined,
      },
      dListQuery:{
        uuid:undefined,
        deviceNumber:undefined,
        deviceName:undefined,
        title:undefined,
      },
      dialogFormVisible:false,
    }
  },
  created(){
    this.getList()
  },
  methods:{
    getList(){
      console.log(this.listQuery)
      getUserDevice(this.listQuery).then(response=>{
          this.list = response.respObj.item
          this.total = response.respObj.total
      })
    },
    getDlist(){
      this.dListQuery.uuid = this.sysUuid
      console.log(this.dListQuery)
      getSelectDevice(this.dListQuery).then(response=>{
        console.log(response)
          this.deviceList = response.respObj
          this.dtotal = this.deviceList.length
          if (this.dtotal > this.limit) {
            const start = (this.page - 1) * this.limit
            const end = this.page * this.limit
            this.deviceList = this.deviceList.slice(start, end)
          }
          console.log(this.dtotal)
      })
    },
    handleFilter(key){
      //key=1为设备查询
      if(key===1){
        this.page = 1
        this.getDlist()
        return
      }
      this.listQuery.page = 1
      this.getList()
    },
    handleUnbind(row,index){
      console.log(this.sysUuid)
      const param = []
      param.push(row.uuid)
      const requestData = { 
          duuids: param,
          sysUuid:this.sysUuid
      }
        getDeviceUnbind(requestData).then(response => {
          this.$notify({
              title: '成功',
              message: '解绑成功',
              type: 'success',
              duration: 2000
          })
          this.deviceList.splice(index,1)
        })
      },
      handleDevice(row,index){
        this.sysUuid = row.uuid
        console.log(row)
        // this.listQuery.page = 1
        this.dListQuery.deviceNumber = ''
        this.dListQuery.deviceName = ''
        this.dListQuery.title = ''
        this.getDlist()
        this.dialogFormVisible = true
        console.log(this.deviceList)
      }
    }
    
}
</script>
<style>
  .el-tag{
      font-size: 14px;
  }
  .customWidth{
      width:74%;
      /* height: 74%; */
  }
</style>
