<template>
  <div class="app-container">
      <div class="filter-container">
          <el-input 
            v-model.trim="listQuery.name"
            clearable
            placeholder="经销商姓名"
            style="width: 150px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-input 
            v-model.trim="listQuery.account"
            clearable
            placeholder="经销商账号"
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
            <el-table-column label="经销商姓名" align="center">
                <template slot-scope="{row}">
                <span>{{ row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="经销商账号" align="center">
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
                    v-if="row.status!='deleted'"
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
        <el-dialog title="Device" :visible.sync="dialogFormVisible">
           <el-table 
            :key="tableKey"
            :data="deviceList"
            height="500"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            row-key="uuid">
              <el-table-column 
                label="序号"
                prop="id"
                align="center"
                type="index"
                width="50">
              </el-table-column>
              <el-table-column label="设备名称" align="center">
                <template slot-scope="{row}">
                <el-tag>{{row.deviceName}}</el-tag>
                </template>
            </el-table-column>
            
            <el-table-column label="设备账号" align="center">
                <template slot-scope="{row}">
                <el-tag>{{row.deviceNumber}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="appKey" align="center">
                <template slot-scope="{row}">
                <span>{{row.appKey}}</span>
                </template>
            </el-table-column>
            <el-table-column label="使用地方" align="center">
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
        </el-dialog>
    </div>
</template>
<script>
import {getUserDevice,getDeviceUnbind} from '@/api/device'
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
      listQuery:{
        page:1,
        limit:20,
        name:undefined,
        account:undefined
      },
      dialogFormVisible:false,
    }
  },
  created(){
    this.getList()
  },
  methods:{
    getList(){
      getUserDevice(this.listQuery).then(response=>{
          this.list = response.respObj.item
          this.total = response.respObj.total
      })
      },
      handleFilter(){
        this.listQuery.page = 1
        this.getList()
      },
      handleUnbind(row,index){
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
        this.deviceList = row.devices
        this.sysUuid = row.uuid
        this.dialogFormVisible = true
        console.log(this.deviceList)
      }
    }
    
}
</script>
<style scoped>
  .el-tag{
      font-size: 14px;
  }
</style>
