<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form
                ref="dataForm"
                :rules="rules"
                :model="temp"
                label-position="right"
                label-width="100px"
                style="width: 800px; margin-left:20px;">
                <el-form-item>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="选择项目" prop="appKey">
                                <el-select v-model="temp.appKey" filterable placeholder="请选择" >
                                    <el-option v-for="item in proList" 
                                        :key="item.uuid" :label="item.name" :value="item.appKey">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="注册数量" prop="count">
                                <el-input v-model.trim="temp.count" clearable placeholder="请输入注册数量" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item style="margin-left:20px">
                                <el-button type="success" @click="batch">注册</el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item>
                                <el-button  type="primary" @click="batch">导出</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <el-table
                v-show="list.length>0"
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
                <el-table-column label="设备昵称" align="center" width="250">
                    <template slot-scope="{row}">
                    <el-tag>{{row.deviceNick}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="设备名称" align="center">
                    <template slot-scope="{row}">
                    <span>{{row.deviceName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="appKey" align="center" width="220">
                    <template slot-scope="{row}">
                    <el-tag type="success">{{row.appKey}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="设备秘钥" align="center">
                    <template slot-scope="{row}">
                    <span>{{row.deviceSecret}}</span>
                    </template>
                </el-table-column>
                
                <el-table-column label="注册编号" align="center">
                    <template slot-scope="{row}">
                    <span>{{row.registerNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" sortable="custom" prop="create_date" width="230">
                    <template slot-scope="{row}">
                    <span>{{ row.createDate }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                v-show="list.length>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="getList"/>
        </div>
    </div>
</template>
<script>
import {getProView} from '@/api/product'

import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {getMqView,postMqBatch,postMqSp,postMqEnable} from '@/api/device'

export default {
    name:'device-batch',
    components:{
        Pagination
    },
    data(){
        return{
            tableKey:0,
            listLoading:false,
            list:[],
            proList:[],
            total:0,
            listQuery:{
               page:1,
               limit:20 
            },
            temp:{
                appKey:undefined,
                count:undefined
            },
            rules:{

            }
        }
    },
    created(){
        this.getList()
    },
    methods:{
        getList(){
            getProView(this.query).then(response=>{
                this.proList = response.respObj.item
                this.total = response.respObj.total
                if(this.total>this.listQuery.limit){
                    this.listQuery.limit = this.total
                    getProView(this.listQuery).then(response=>{
                        this.proList = response.respObj.item
                    })
                }
            })
        },
        batch(){
            console.log(this.temp)
            postMqBatch(this.temp).then(response=>{
                this.list = response.respObj
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
    }
}
</script>